import { onBeforeUnmount, onMounted, watch, shallowRef, ref } from 'vue';
import { createChart, CrosshairMode, ColorType } from 'lightweight-charts';
import { useTheme } from './useTheme.js';
import { SYMBOLS } from '../data/marketData.js';

export function useChart(containerRef, barsRef, chartTypeRef, symbolRef) {
  const chart = shallowRef(null);
  const hoveredBar = ref(null);
  let candleSeries = null, volumeSeries = null;
  let lineSeries = null, areaSeries = null, barSeries = null;
  let resizeObserver = null;

  const { isDark } = useTheme();

  function getPalette() {
    let custom = null;
    try {
      const raw = localStorage.getItem('xn_chart_theme');
      if (raw) custom = JSON.parse(raw);
    } catch { }

    const upColor = custom?.up || '#089981';
    const downColor = custom?.down || '#f23645';

    if (isDark.value) {
      return {
        bg: custom?.bg || '#090d15',
        border: '#1a2232',
        grid: '#131926',
        text: '#8b95a5',
        up: upColor,
        down: downColor,
        volUp: upColor.startsWith('#') ? `${upColor}73` : 'rgba(8, 153, 129, 0.45)',
        volDown: downColor.startsWith('#') ? `${downColor}73` : 'rgba(242, 54, 69, 0.45)'
      };
    }
    return {
      bg: '#ffffff',
      border: '#e5e7eb',
      grid: '#f4f4f5',
      text: '#52525b',
      up: upColor,
      down: downColor,
      volUp: upColor.startsWith('#') ? `${upColor}73` : 'rgba(8, 153, 129, 0.45)',
      volDown: downColor.startsWith('#') ? `${downColor}73` : 'rgba(242, 54, 69, 0.45)'
    };
  }

  function getSymbolPrecision(sym) {
    const s = String(sym || 'XAUUSD').toUpperCase();
    const meta = SYMBOLS[s] || SYMBOLS.XAUUSD;
    return meta?.digits ?? 2;
  }

  function getSeriesFormatOpts() {
    const dg = getSymbolPrecision(symbolRef?.value);
    const minMove = Math.pow(10, -dg);
    return {
      priceFormat: {
        type: 'price',
        precision: dg,
        minMove: minMove
      },
      priceLineVisible: true,
      lastValueVisible: true
    };
  }

  function updatePriceFormat() {
    if (!chart.value) return;
    const opts = getSeriesFormatOpts();
    if (candleSeries) candleSeries.applyOptions(opts);
    if (lineSeries) lineSeries.applyOptions(opts);
    if (areaSeries) areaSeries.applyOptions(opts);
    if (barSeries) barSeries.applyOptions(opts);
    ribbonSeries.forEach(item => {
      try {
        item.series.applyOptions({
          priceFormat: opts.priceFormat,
          priceLineVisible: false,
          lastValueVisible: false
        });
      } catch (e) { }
    });
  }

  // Indicators toggle state (Clean candles by default, toggleable via Indicators button or eye icon)
  const indicatorsVisible = ref(false);

  function setIndicatorsVisible(val) {
    indicatorsVisible.value = !!val;
    ribbonSeries.forEach(item => {
      try {
        item.series.applyOptions({
          visible: indicatorsVisible.value,
          priceLineVisible: false,
          lastValueVisible: false
        });
      } catch (e) { }
    });
  }

  function toggleIndicators() {
    setIndicatorsVisible(!indicatorsVisible.value);
  }

  // 5 smooth flowing wave indicator curves matching reference screenshot
  const RIBBON_DEFS = [
    { period: 9, color: '#00e5ff', width: 2 },
    { period: 21, color: '#38bdf8', width: 1.5 },
    { period: 50, color: '#2979ff', width: 1.5 },
    { period: 100, color: '#7c4dff', width: 1.5 },
    { period: 200, color: '#ff4081', width: 1.5 }
  ];
  let ribbonSeries = [];

  function calculateEMA(bars, period, dg) {
    if (!bars || !bars.length) return [];
    const k = 2 / (period + 1);
    let ema = bars[0].close;
    const result = [];
    for (let i = 0; i < bars.length; i++) {
      const p = bars[i].close;
      ema = i === 0 ? p : (p * k) + (ema * (1 - k));
      result.push({ time: bars[i].time, value: +ema.toFixed(dg) });
    }
    return result;
  }

  function buildSeries(type) {
    if (!chart.value) return;
    if (candleSeries) { chart.value.removeSeries(candleSeries); candleSeries = null; }
    if (lineSeries) { chart.value.removeSeries(lineSeries); lineSeries = null; }
    if (areaSeries) { chart.value.removeSeries(areaSeries); areaSeries = null; }
    if (barSeries) { chart.value.removeSeries(barSeries); barSeries = null; }

    ribbonSeries.forEach(item => {
      try { chart.value.removeSeries(item.series); } catch (e) { }
    });
    ribbonSeries = [];

    const p = getPalette();
    const commonOpts = getSeriesFormatOpts();

    if (type === 'line') {
      lineSeries = chart.value.addLineSeries({ color: p.up, lineWidth: 2, ...commonOpts });
    } else if (type === 'area') {
      areaSeries = chart.value.addAreaSeries({
        lineColor: p.up,
        topColor: isDark.value ? 'rgba(38,166,154,0.25)' : 'rgba(8,153,129,0.22)',
        bottomColor: 'rgba(8,153,129,0.01)',
        lineWidth: 2,
        ...commonOpts
      });
    } else if (type === 'bar') {
      barSeries = chart.value.addBarSeries({ upColor: p.up, downColor: p.down, ...commonOpts });
    } else {
      candleSeries = chart.value.addCandlestickSeries({
        upColor: p.up,
        downColor: p.down,
        borderUpColor: p.up,
        borderDownColor: p.down,
        wickUpColor: p.up,
        wickDownColor: p.down,
        ...commonOpts
      });
    }

    // Add indicator ribbons without polluting the right price scale
    RIBBON_DEFS.forEach(cfg => {
      const s = chart.value.addLineSeries({
        ...commonOpts,
        color: cfg.color,
        lineWidth: cfg.width,
        visible: indicatorsVisible.value,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false
      });
      ribbonSeries.push({ series: s, period: cfg.period, lastVal: null });
    });

    applyData(barsRef.value);
  }

  function applyData(bars) {
    if (!chart.value || !bars?.length) return;
    const p = getPalette();
    const dg = getSymbolPrecision(symbolRef?.value);

    const formattedBars = bars.map(b => ({
      time: b.time,
      open: +Number(b.open).toFixed(dg),
      high: +Number(b.high).toFixed(dg),
      low: +Number(b.low).toFixed(dg),
      close: +Number(b.close).toFixed(dg),
      volume: b.volume
    }));

    if (candleSeries) candleSeries.setData(formattedBars);
    if (lineSeries) lineSeries.setData(formattedBars.map(b => ({ time: b.time, value: b.close })));
    if (areaSeries) areaSeries.setData(formattedBars.map(b => ({ time: b.time, value: b.close })));
    if (barSeries) barSeries.setData(formattedBars);
    if (volumeSeries) volumeSeries.setData(formattedBars.map(b => ({
      time: b.time,
      value: b.volume,
      color: b.close >= b.open ? p.volUp : p.volDown
    })));

    // Compute and set ribbon indicator data
    ribbonSeries.forEach(item => {
      const emaData = calculateEMA(formattedBars, item.period, dg);
      item.series.setData(emaData);
      item.lastVal = emaData.length ? emaData[emaData.length - 1].value : null;
    });

    chart.value.timeScale().fitContent();
  }

  function updateBar(b) {
    if (!chart.value || !b) return;
    const p = getPalette();
    const dg = getSymbolPrecision(symbolRef?.value);

    const formattedBar = {
      time: b.time,
      open: +Number(b.open).toFixed(dg),
      high: +Number(b.high).toFixed(dg),
      low: +Number(b.low).toFixed(dg),
      close: +Number(b.close).toFixed(dg)
    };

    if (candleSeries) {
      try {
        candleSeries.update(formattedBar);
      } catch (e) {
        applyData(barsRef.value);
      }
    }
    if (lineSeries) {
      try {
        lineSeries.update({ time: b.time, value: formattedBar.close });
      } catch (e) {
        applyData(barsRef.value);
      }
    }
    if (areaSeries) {
      try {
        areaSeries.update({ time: b.time, value: formattedBar.close });
      } catch (e) {
        applyData(barsRef.value);
      }
    }
    if (barSeries) {
      try {
        barSeries.update(formattedBar);
      } catch (e) {
        applyData(barsRef.value);
      }
    }
    if (volumeSeries && b.volume !== undefined) {
      try {
        volumeSeries.update({
          time: b.time,
          value: b.volume,
          color: b.close >= b.open ? p.volUp : p.volDown
        });
      } catch (e) { }
    }

    ribbonSeries.forEach(item => {
      const k = 2 / (item.period + 1);
      const prev = item.lastVal !== null ? item.lastVal : formattedBar.close;
      const nextVal = +((formattedBar.close * k) + (prev * (1 - k))).toFixed(dg);
      try {
        item.series.update({ time: formattedBar.time, value: nextVal });
      } catch (e) { }
    });
  }

  function applyTheme() {
    if (!chart.value) return;
    const p = getPalette();
    chart.value.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: p.bg },
        textColor: p.text
      },
      grid: {
        vertLines: { color: p.grid },
        horzLines: { color: p.grid }
      },
      crosshair: {
        vertLine: { color: p.text, labelBackgroundColor: p.up },
        horzLine: { color: p.text, labelBackgroundColor: p.up }
      },
      rightPriceScale: { borderColor: p.border },
      timeScale: { borderColor: p.border }
    });
    buildSeries(chartTypeRef.value);
  }

  onMounted(() => {
    if (!containerRef.value) return;
    const p = getPalette();
    chart.value = createChart(containerRef.value, {
      layout: {
        background: { type: ColorType.Solid, color: p.bg },
        textColor: p.text,
        fontSize: 11,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      },
      grid: {
        vertLines: { color: p.grid, style: 1 },
        horzLines: { color: p.grid, style: 1 }
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: p.text, width: 1, style: 3, labelBackgroundColor: p.up },
        horzLine: { color: p.text, width: 1, style: 3, labelBackgroundColor: p.up }
      },
      rightPriceScale: { borderColor: p.border, scaleMargins: { top: 0.08, bottom: 0.28 } },
      timeScale: { borderColor: p.border, timeVisible: true, secondsVisible: false },
      handleScroll: true,
      handleScale: true
    });

    volumeSeries = chart.value.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
      scaleMargins: { top: 0.8, bottom: 0 }
    });
    chart.value.priceScale('volume').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });

    buildSeries(chartTypeRef.value);
    applyData(barsRef.value);

    // Crosshair movement listener
    chart.value.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData) {
        hoveredBar.value = null;
        return;
      }
      const activeSeries = candleSeries || barSeries;
      const d = activeSeries ? param.seriesData.get(activeSeries) : null;
      if (d) {
        hoveredBar.value = {
          open: d.open ?? d.value ?? 0,
          high: d.high ?? d.value ?? 0,
          low: d.low ?? d.value ?? 0,
          close: d.close ?? d.value ?? 0
        };
      } else {
        hoveredBar.value = null;
      }
    });

    resizeObserver = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        if (width && height) chart.value?.applyOptions({ width, height });
      }
    });
    resizeObserver.observe(containerRef.value);

    window.addEventListener('xn:theme-change', applyTheme);

    const onIndicatorToggleEvt = (e) => {
      if (e?.detail?.visible !== undefined) {
        setIndicatorsVisible(e.detail.visible);
      } else {
        toggleIndicators();
      }
    };
    window.addEventListener('xn:toggle-indicators', onIndicatorToggleEvt);
  });

  watch(barsRef, (bars) => applyData(bars));
  watch(chartTypeRef, (t) => buildSeries(t));
  watch(isDark, () => applyTheme());

  if (symbolRef) {
    watch(symbolRef, () => {
      updatePriceFormat();
      applyData(barsRef.value);
      chart.value?.timeScale().fitContent();
    });
  }

  onBeforeUnmount(() => {
    window.removeEventListener('xn:theme-change', applyTheme);
    window.removeEventListener('xn:toggle-indicators', onIndicatorToggleEvt);
    resizeObserver?.disconnect();
    chart.value?.remove();
  });

  return {
    chart,
    hoveredBar,
    updateBar,
    updatePriceFormat,
    indicatorsVisible,
    toggleIndicators,
    setIndicatorsVisible
  };
}
