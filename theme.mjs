import { writeFileSync } from 'fs';

const F = {};

// ═══════════════════════════════════════════════════════════════
// tailwind.config.js  — light theme palette matching reference
// ═══════════════════════════════════════════════════════════════
F['tailwind.config.js'] = `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        xn: {
          bg: '#ffffff',
          panel: '#ffffff',
          panel2: '#f5f7fa',
          toolbar: '#ffffff',
          border: '#e3e6eb',
          border2: '#d4d9e0',
          text: '#131722',
          dim: '#5d6673',
          mute: '#9aa3b0',
          up: '#089981',
          down: '#f23645',
          accent: '#2962ff',
          accent2: '#1e88e5',
          buy: '#2962ff',
          sell: '#ff6a00',
          hover: '#f0f3fa',
          active: '#e3ebff',
          gold: '#f5bf23'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif']
      },
      fontSize: { '2xs': '10px' }
    }
  },
  plugins: []
}
`;

// ═══════════════════════════════════════════════════════════════
// src/style.css — light theme + component classes
// ═══════════════════════════════════════════════════════════════
F['src/style.css'] = `@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #app {
  height: 100%; margin: 0;
  background: #ffffff; color: #131722;
  font-size: 12px; overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d4d9e0; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #b8bec8; }

@layer components {
  .xn-btn {
    @apply inline-flex items-center justify-center gap-1 px-2 py-1 rounded
           text-xs text-xn-dim cursor-pointer transition-colors select-none
           whitespace-nowrap bg-transparent border border-transparent;
  }
  .xn-btn:hover { @apply bg-xn-hover text-xn-text; }
  .xn-btn.active { @apply bg-xn-active text-xn-accent border-xn-accent; }

  .xn-icon-btn {
    @apply w-7 h-7 flex items-center justify-center rounded text-xn-dim
           cursor-pointer transition-colors;
  }
  .xn-icon-btn:hover { @apply bg-xn-hover text-xn-text; }

  .xn-tool {
    @apply w-8 h-8 flex items-center justify-center rounded text-xn-dim
           cursor-pointer transition-colors;
  }
  .xn-tool:hover { @apply bg-xn-hover text-xn-text; }
  .xn-tool.active { @apply bg-xn-active text-xn-accent; }

  .xn-tab {
    @apply px-3 py-[7px] text-xn-dim cursor-pointer text-xs whitespace-nowrap
           transition-colors border-b-2 border-transparent;
  }
  .xn-tab:hover { @apply text-xn-text; }
  .xn-tab.active { @apply text-xn-text border-xn-accent font-medium bg-xn-panel2; }

  .xn-table { @apply w-full border-collapse text-[11px]; }
  .xn-table th {
    @apply text-left px-2 py-[6px] text-xn-mute font-normal border-b border-xn-border
           bg-xn-panel2 sticky top-0 text-[10px] uppercase tracking-wide;
  }
  .xn-table td {
    @apply px-2 py-[6px] border-b border-xn-border text-xn-dim whitespace-nowrap;
  }

  .xn-badge {
    @apply text-[10px] px-1.5 py-[1px] rounded font-semibold uppercase;
  }
  .xn-badge.buy  { @apply text-xn-buy; }
  .xn-badge.sell { @apply text-xn-sell; }

  .xn-input {
    @apply bg-xn-panel2 border border-xn-border text-xn-text px-2 py-1
           rounded text-xs outline-none;
  }
  .xn-input:focus { @apply border-xn-accent; }

  .dropdown {
    @apply absolute top-full left-0 mt-1 bg-xn-panel border border-xn-border2 rounded
           min-w-[130px] z-50 hidden;
    box-shadow: 0 4px 12px rgba(20,24,33,0.1);
  }
  .dropdown.open { @apply block; }
  .dropdown-item { @apply px-3 py-1.5 cursor-pointer text-xn-dim text-xs; }
  .dropdown-item:hover { @apply bg-xn-hover text-xn-text; }
  .dropdown-item.active { @apply text-xn-accent; }

  .resizer-v { @apply w-px cursor-col-resize transition-colors shrink-0 bg-xn-border; }
  .resizer-v:hover, .resizer-v.dragging { @apply bg-xn-accent; }
  .resizer-h { @apply h-px cursor-row-resize transition-colors shrink-0 bg-xn-border; }
  .resizer-h:hover, .resizer-h.dragging { @apply bg-xn-accent; }
}
`;

// ═══════════════════════════════════════════════════════════════
// src/data/marketData.js — same data, untouched logic
// ═══════════════════════════════════════════════════════════════
F['src/data/marketData.js'] = `function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

export const SYMBOLS = {
  XAUUSD: { name: 'Gold Spot / US Dollar', exchange: 'OANDA', base: 4122.86, vol: 0.006, digits: 2 },
  EURUSD: { name: 'Euro / US Dollar',       exchange: 'OANDA', base: 1.11770, vol: 0.0015, digits: 5 },
  GBPUSD: { name: 'Pound / US Dollar',      exchange: 'OANDA', base: 1.31928, vol: 0.0018, digits: 5 },
  USDJPY: { name: 'US Dollar / Yen',        exchange: 'OANDA', base: 158.278, vol: 0.0016, digits: 3 },
  AUDUSD: { name: 'Aussie / US Dollar',     exchange: 'OANDA', base: 0.99043, vol: 0.0016, digits: 5 },
  AUDCAD: { name: 'Aussie / Loonie',        exchange: 'OANDA', base: 0.99043, vol: 0.0016, digits: 5 },
  USDCAD: { name: 'US Dollar / Loonie',     exchange: 'OANDA', base: 1.42756, vol: 0.0014, digits: 5 },
  USDCHF: { name: 'US Dollar / Franc',      exchange: 'OANDA', base: 0.83357, vol: 0.0014, digits: 5 },
  BTCUSD: { name: 'Bitcoin / US Dollar',    exchange: 'CRYPTO', base: 68120.5, vol: 0.025, digits: 2 },
  ETHUSD: { name: 'Ethereum / US Dollar',   exchange: 'CRYPTO', base: 3450.8,  vol: 0.028, digits: 2 }
}

export function generateBars(symbol, tfCode, count = 300) {
  const meta = SYMBOLS[symbol] || SYMBOLS.XAUUSD
  const seed = hashString(symbol + '::' + tfCode)
  const rnd = mulberry32(seed)
  const tfSeconds = { '1': 60, '5': 300, '15': 900, '60': 3600, 'D': 86400 }[String(tfCode)] || 900
  const nowSec = Math.floor(Date.now() / 1000)
  const startTime = nowSec - tfSeconds * count
  const bars = []
  let price = meta.base * (1 - meta.vol * 6)
  const drift = meta.base * meta.vol * 0.15 / count
  for (let i = 0; i < count; i++) {
    const t = startTime + i * tfSeconds
    const volatility = meta.base * meta.vol * (0.6 + rnd() * 0.9)
    const open = price
    const change = (rnd() - 0.48) * volatility + drift
    const close = Math.max(open + change, meta.base * 0.01)
    const high = Math.max(open, close) + rnd() * volatility * 0.5
    const low  = Math.min(open, close) - rnd() * volatility * 0.5
    const volume = Math.floor((0.5 + rnd()) * 10000 + rnd() * 5000)
    bars.push({
      time: t,
      open:  +open.toFixed(meta.digits),
      high:  +high.toFixed(meta.digits),
      low:   +low.toFixed(meta.digits),
      close: +close.toFixed(meta.digits),
      volume
    })
    price = close
  }
  return bars
}

export function getSymbolSummary(symbol, tfCode) {
  const bars = generateBars(symbol, tfCode, 300)
  const last = bars[bars.length - 1]
  const prev = bars[Math.max(0, bars.length - 2)]
  const change = last.close - prev.close
  const changePct = (change / prev.close) * 100
  const meta = SYMBOLS[symbol] || SYMBOLS.XAUUSD
  return {
    symbol, name: meta.name, exchange: meta.exchange, digits: meta.digits,
    open: last.open, high: last.high, low: last.low, close: last.close,
    change: +change.toFixed(meta.digits),
    changePct: +changePct.toFixed(2)
  }
}

export const WATCHLIST = [
  { symbol: 'AUDCAD', last: 0.99043, bid: 0.99043, ask: 0.99050, change: -0.20, low: 0.98968, high: 0.99312, spread: 7 },
  { symbol: 'EURUSD', last: 1.11770, bid: 1.11770, ask: 1.11771, change: -0.21, low: 1.11738, high: 1.12127, spread: 1 },
  { symbol: 'GBPUSD', last: 1.31928, bid: 1.31928, ask: 1.31929, change: -0.16, low: 1.31844, high: 1.32224, spread: 1 },
  { symbol: 'USDCAD', last: 1.42756, bid: 1.42756, ask: 1.42758, change: +0.12, low: 1.42435, high: 1.42777, spread: 2 },
  { symbol: 'USDCHF', last: 0.83357, bid: 0.83357, ask: 0.83358, change: +0.06, low: 0.83205, high: 0.83466, spread: 1 },
  { symbol: 'USDJPY', last: 158.278, bid: 158.278, ask: 158.279, change: +0.11, low: 157.581, high: 158.300, spread: 1 },
  { symbol: 'XAUUSD', last: 4122.86, bid: 4122.86, ask: 4122.94, change: +0.36, low: 4105.57, high: 4143.21, spread: 8 }
]
`;

// ═══════════════════════════════════════════════════════════════
// src/composables/useChart.js — light theme colors
// ═══════════════════════════════════════════════════════════════
F['src/composables/useChart.js'] = `import { onBeforeUnmount, onMounted, watch, shallowRef } from 'vue'
import { createChart, CrosshairMode } from 'lightweight-charts'

const COLORS = {
  bg: '#ffffff',
  border: '#e3e6eb',
  text: '#5d6673',
  up: '#089981',
  down: '#f23645',
  accent: '#2962ff'
}

export function useChart(containerRef, barsRef, chartTypeRef) {
  const chart = shallowRef(null)
  let candleSeries = null, volumeSeries = null
  let lineSeries = null, areaSeries = null, barSeries = null
  let resizeObserver = null

  function buildSeries(type) {
    if (!chart.value) return
    if (candleSeries) { chart.value.removeSeries(candleSeries); candleSeries = null }
    if (lineSeries)   { chart.value.removeSeries(lineSeries);   lineSeries = null }
    if (areaSeries)   { chart.value.removeSeries(areaSeries);   areaSeries = null }
    if (barSeries)    { chart.value.removeSeries(barSeries);    barSeries = null }
    const commonOpts = { priceLineVisible: false, lastValueVisible: true }
    if (type === 'line') {
      lineSeries = chart.value.addLineSeries({ color: COLORS.accent, lineWidth: 2, ...commonOpts })
    } else if (type === 'area') {
      areaSeries = chart.value.addAreaSeries({
        lineColor: COLORS.accent, topColor: 'rgba(41,98,255,0.22)',
        bottomColor: 'rgba(41,98,255,0.01)', lineWidth: 2, ...commonOpts
      })
    } else if (type === 'bar') {
      barSeries = chart.value.addBarSeries({ upColor: COLORS.up, downColor: COLORS.down, ...commonOpts })
    } else {
      candleSeries = chart.value.addCandlestickSeries({
        upColor: COLORS.up, downColor: COLORS.down,
        borderUpColor: COLORS.up, borderDownColor: COLORS.down,
        wickUpColor: COLORS.up, wickDownColor: COLORS.down, ...commonOpts
      })
    }
    applyData(barsRef.value)
  }

  function applyData(bars) {
    if (!chart.value || !bars?.length) return
    if (candleSeries) candleSeries.setData(bars.map(b => ({ time: b.time, open: b.open, high: b.high, low: b.low, close: b.close })))
    if (lineSeries)   lineSeries.setData(bars.map(b => ({ time: b.time, value: b.close })))
    if (areaSeries)   areaSeries.setData(bars.map(b => ({ time: b.time, value: b.close })))
    if (barSeries)    barSeries.setData(bars.map(b => ({ time: b.time, open: b.open, high: b.high, low: b.low, close: b.close })))
    if (volumeSeries) volumeSeries.setData(bars.map(b => ({ time: b.time, value: b.volume, color: b.close >= b.open ? 'rgba(8,153,129,0.35)' : 'rgba(242,54,69,0.35)' })))
    chart.value.timeScale().fitContent()
  }

  onMounted(() => {
    if (!containerRef.value) return
    chart.value = createChart(containerRef.value, {
      layout: {
        background: { color: COLORS.bg },
        textColor: COLORS.text, fontSize: 11,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      },
      grid: { vertLines: { color: COLORS.border }, horzLines: { color: COLORS.border } },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: COLORS.border, scaleMargins: { top: 0.08, bottom: 0.28 } },
      timeScale: { borderColor: COLORS.border, timeVisible: true, secondsVisible: false },
      handleScroll: true, handleScale: true
    })
    volumeSeries = chart.value.addHistogramSeries({
      priceFormat: { type: 'volume' }, priceScaleId: 'volume', scaleMargins: { top: 0.8, bottom: 0 }
    })
    chart.value.priceScale('volume').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } })
    buildSeries(chartTypeRef.value)
    applyData(barsRef.value)
    resizeObserver = new ResizeObserver(entries => {
      for (const e of entries) {
        const { width, height } = e.contentRect
        if (width && height) chart.value?.applyOptions({ width, height })
      }
    })
    resizeObserver.observe(containerRef.value)
  })

  watch(barsRef, (bars) => applyData(bars))
  watch(chartTypeRef, (t) => buildSeries(t))

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    chart.value?.remove()
  })
  return { chart }
}
`;

writeFileSync('tailwind.config.js', F['tailwind.config.js'], 'utf8');
writeFileSync('src/style.css', F['src/style.css'], 'utf8');
writeFileSync('src/data/marketData.js', F['src/data/marketData.js'], 'utf8');
writeFileSync('src/composables/useChart.js', F['src/composables/useChart.js'], 'utf8');

console.log('  ✓ tailwind.config.js');
console.log('  ✓ src/style.css');
console.log('  ✓ src/data/marketData.js');
console.log('  ✓ src/composables/useChart.js');
console.log('Part 1 done.');