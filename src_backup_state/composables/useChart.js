import { onBeforeUnmount, onMounted, watch, shallowRef, ref } from 'vue';
import { createChart, CrosshairMode, ColorType } from 'lightweight-charts';
import { useTheme } from './useTheme.js';

export function useChart(containerRef, barsRef, chartTypeRef) {
  const chart = shallowRef(null);
  const hoveredBar = ref(null);
  let candleSeries = null, volumeSeries = null;
  let lineSeries = null, areaSeries = null, barSeries = null;
  let resizeObserver = null;

  const { isDark } = useTheme();

  function getPalette() {
    if (isDark.value) {
      return {
        bg: '#0a0e17',
        border: '#162032',
        grid: '#0f1726',
        text: '#7e8d9f',
        up: '#089981',
        down: '#f23645',
        volUp: 'rgba(8, 153, 129, 0.45)',
        volDown: 'rgba(242, 54, 69, 0.45)'
      };
    }
    return {
      bg: '#ffffff',
      border: '#e3e6eb',
      grid: '#f0f2f5',
      text: '#5d6673',
      up: '#089981',
      down: '#f23645',
      volUp: 'rgba(38, 166, 154, 0.45)',
      volDown: 'rgba(239, 83, 80, 0.45)'
    };
  }

  function buildSeries(type) {
    if (!chart.value) return;
    if (candleSeries) { chart.value.removeSeries(candleSeries); candleSeries = null; }
    if (lineSeries)   { chart.value.removeSeries(lineSeries);   lineSeries = null; }
    if (areaSeries)   { chart.value.removeSeries(areaSeries);   areaSeries = null; }
    if (barSeries)    { chart.value.removeSeries(barSeries);    barSeries = null; }

    const p = getPalette();
    const commonOpts = { priceLineVisible: false, lastValueVisible: true };

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
    applyData(barsRef.value);
  }

  function applyData(bars) {
    if (!chart.value || !bars?.length) return;
    const p = getPalette();
    if (candleSeries) candleSeries.setData(bars.map(b => ({ time: b.time, open: b.open, high: b.high, low: b.low, close: b.close })));
    if (lineSeries)   lineSeries.setData(bars.map(b => ({ time: b.time, value: b.close })));
    if (areaSeries)   areaSeries.setData(bars.map(b => ({ time: b.time, value: b.close })));
    if (barSeries)    barSeries.setData(bars.map(b => ({ time: b.time, open: b.open, high: b.high, low: b.low, close: b.close })));
    if (volumeSeries) volumeSeries.setData(bars.map(b => ({
      time: b.time,
      value: b.volume,
      color: b.close >= b.open ? p.volUp : p.volDown
    })));
    chart.value.timeScale().fitContent();
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
  });

  watch(barsRef, (bars) => applyData(bars));
  watch(chartTypeRef, (t) => buildSeries(t));
  watch(isDark, () => applyTheme());

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    chart.value?.remove();
  });

  return { chart, hoveredBar };
}
