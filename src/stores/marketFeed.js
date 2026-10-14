import { ref, reactive, computed } from 'vue';
import { SYMBOLS, WATCHLIST } from '../data/marketData.js';
import { usePositions } from './positions.js';

// Reactive map of all live symbol feeds
export const livePrices = reactive({});

// Flash states for visual glow indicators: { [symbol]: 'up' | 'down' }
export const priceFlashes = reactive({});

// Sparkline helper
function createInitialSparkline(basePrice) {
  const candles = [];
  let price = Number(basePrice) || 100;
  const spread = Math.max(0.0001, price * 0.0012);
  for (let i = 0; i < 6; i++) {
    const delta = (Math.random() - 0.49) * spread;
    const open = price;
    const close = price + delta;
    const high = Math.max(open, close) + Math.random() * (spread * 0.4);
    const low = Math.min(open, close) - Math.random() * (spread * 0.4);
    candles.push({ open, close, high, low, isUp: close >= open });
    price = close;
  }
  return candles;
}

// Initialize all symbols with accurate seed values
export function initMarketFeed() {
  Object.keys(SYMBOLS).forEach(sym => {
    if (livePrices[sym]) return;
    const meta = SYMBOLS[sym];
    const watchRow = WATCHLIST.find(w => w.symbol === sym);
    const dg = meta.digits ?? 2;
    const base = watchRow?.last ?? meta.base ?? 100;
    const open = watchRow ? (base - (watchRow.change || 0)) : base * 0.998;
    const change = Number((base - open).toFixed(dg));
    const changePct = open > 0 ? Number(((change / open) * 100).toFixed(2)) : 0;
    const spreadPts = Math.max(1, Math.round(base * 0.00015 * Math.pow(10, dg)));
    const spreadVal = spreadPts * Math.pow(10, -dg);

    livePrices[sym] = {
      symbol: sym,
      name: meta.name || sym,
      category: meta.category || 'Forex',
      badge: meta.badge || 'FX',
      tag: meta.tag || sym.slice(0, 2),
      digits: dg,
      price: base,
      open: +open.toFixed(dg),
      high: Math.max(base, open) + (base * 0.002),
      low: Math.min(base, open) - (base * 0.002),
      close: base,
      change,
      changePct,
      bid: base,
      ask: +(base + spreadVal).toFixed(dg),
      spread: String(spreadPts),
      buyerRatio: Math.floor(Math.random() * 20) + 42,
      sparkline: createInitialSparkline(base),
      tickCount: 0,
      lastTickTime: Date.now()
    };
  });
}

// Flash timer store
const flashTimers = {};

function triggerFlash(sym, dir) {
  priceFlashes[sym] = dir > 0 ? 'up' : 'down';
  if (flashTimers[sym]) clearTimeout(flashTimers[sym]);
  flashTimers[sym] = setTimeout(() => {
    delete priceFlashes[sym];
  }, 650);
}

// Tick listeners (e.g. for App.vue to update active chart candle)
const tickListeners = new Set();
export function onMarketTick(cb) {
  tickListeners.add(cb);
  return () => tickListeners.delete(cb);
}

// Ingest external live tick (e.g. from XtremeNext WebSocket)
export function applyExternalTick(sym, price, ask, bid) {
  initMarketFeed();
  const item = livePrices[sym];
  if (!item) return null;

  const dg = item.digits;
  const p = +Number(price).toFixed(dg);
  const oldPrice = item.price;
  const dir = p >= oldPrice ? 1 : -1;

  item.price = p;
  item.close = p;
  if (p > item.high) item.high = p;
  if (p < item.low) item.low = p;

  item.change = +(item.price - item.open).toFixed(dg);
  item.changePct = item.open > 0 ? +((item.change / item.open) * 100).toFixed(2) : 0;

  if (ask != null) item.ask = +Number(ask).toFixed(dg);
  if (bid != null) item.bid = +Number(bid).toFixed(dg);

  // Update live micro-candlestick sparkline
  if (item.sparkline && item.sparkline.length) {
    const lastC = item.sparkline[item.sparkline.length - 1];
    lastC.close = item.price;
    if (item.price > lastC.high) lastC.high = item.price;
    if (item.price < lastC.low) lastC.low = item.price;
    lastC.isUp = lastC.close >= lastC.open;

    item.tickCount = (item.tickCount || 0) + 1;
    if (item.tickCount >= 4) {
      item.tickCount = 0;
      item.sparkline.shift();
      item.sparkline.push({
        open: item.price,
        close: item.price,
        high: item.price,
        low: item.price,
        isUp: true
      });
    }
  }

  item.lastTickTime = Date.now();
  triggerFlash(sym, dir);

  // Sync open positions store
  try {
    const { updateLtp } = usePositions();
    updateLtp(sym, item.price);
  } catch (e) {}

  // Broadcast to listeners (Watchlist, TopToolbar, etc.)
  tickListeners.forEach(cb => {
    try {
      cb(sym, item, dir);
    } catch (e) {
      console.warn('[marketFeed] listener error:', e);
    }
  });

  return item;
}

// Core tick generator for a given symbol
export function tickSymbol(sym, forcedDir = 0) {
  const item = livePrices[sym];
  if (!item) return null;

  const dg = item.digits;
  const step = Math.pow(10, -dg);
  const dir = forcedDir !== 0 ? forcedDir : (Math.random() > 0.48 ? 1 : -1);
  const ticks = Math.floor(Math.random() * 3) + 1;
  const newPrice = Math.max(0.00001, +(item.price + dir * step * ticks).toFixed(dg));

  item.price = newPrice;
  item.close = newPrice;
  if (newPrice > item.high) item.high = newPrice;
  if (newPrice < item.low) item.low = newPrice;

  item.change = +(item.price - item.open).toFixed(dg);
  item.changePct = item.open > 0 ? +((item.change / item.open) * 100).toFixed(2) : 0;

  const spreadPts = Math.max(1, parseInt(item.spread, 10) || 2);
  const spreadVal = spreadPts * Math.pow(10, -dg);
  item.bid = item.price;
  item.ask = +(item.price + spreadVal).toFixed(dg);

  if (dir > 0) {
    item.buyerRatio = Math.min(84, (item.buyerRatio || 52) + Math.floor(Math.random() * 3) + 1);
  } else {
    item.buyerRatio = Math.max(18, (item.buyerRatio || 52) - Math.floor(Math.random() * 3) - 1);
  }

  // Update live micro-candlestick sparkline
  if (item.sparkline && item.sparkline.length) {
    const lastC = item.sparkline[item.sparkline.length - 1];
    lastC.close = item.price;
    if (item.price > lastC.high) lastC.high = item.price;
    if (item.price < lastC.low) lastC.low = item.price;
    lastC.isUp = lastC.close >= lastC.open;

    item.tickCount = (item.tickCount || 0) + 1;
    if (item.tickCount >= 4) {
      item.tickCount = 0;
      item.sparkline.shift();
      item.sparkline.push({
        open: item.price,
        close: item.price,
        high: item.price,
        low: item.price,
        isUp: true
      });
    }
  }

  item.lastTickTime = Date.now();
  triggerFlash(sym, dir);

  // Sync to open positions store for floating P/L
  try {
    const { updateLtp } = usePositions();
    updateLtp(sym, item.price);
  } catch (e) {}

  // Notify registered listeners (e.g. Chart candle update)
  tickListeners.forEach(cb => {
    try {
      cb(sym, item, dir);
    } catch (e) {
      console.warn('[marketFeed] listener error:', e);
    }
  });

  return item;
}

// Master streaming ticker loop
let tickerInterval = null;
let activeChartSymbol = 'XAUUSD';

export function setActiveChartSymbol(sym) {
  activeChartSymbol = sym;
}

export function startMarketStream() {
  initMarketFeed();
  if (tickerInterval) return;

  tickerInterval = setInterval(() => {
    const allSymbols = Object.keys(livePrices);
    if (!allSymbols.length) return;

    // 1. High-frequency tick on the active chart symbol (70% probability each interval)
    if (activeChartSymbol && livePrices[activeChartSymbol] && Math.random() > 0.15) {
      tickSymbol(activeChartSymbol);
    }

    // 2. Continuous background ticks on other symbols (2-3 symbols per tick interval)
    const extraCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < extraCount; i++) {
      const randomSym = allSymbols[Math.floor(Math.random() * allSymbols.length)];
      if (randomSym && randomSym !== activeChartSymbol) {
        tickSymbol(randomSym);
      }
    }
  }, 750); // Fluid 750ms pulse rate for realistic trading floor feel
}

export function stopMarketStream() {
  if (tickerInterval) {
    clearInterval(tickerInterval);
    tickerInterval = null;
  }
}

// Top tickers computed property for TopToolbar (XAUUSD and EURUSD or custom)
export const topTickers = computed(() => {
  const xau = livePrices['XAUUSD'];
  const eur = livePrices['EURUSD'];
  return [
    {
      symbol: 'XAUUSD',
      price: xau ? xau.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '4,192.72',
      changePct: xau ? (xau.changePct >= 0 ? '+' : '') + xau.changePct.toFixed(2) : '+0.97',
      flash: priceFlashes['XAUUSD'] || null
    },
    {
      symbol: 'EURUSD',
      price: eur ? eur.price.toFixed(5) : '1.11713',
      changePct: eur ? (eur.changePct >= 0 ? '+' : '') + eur.changePct.toFixed(2) : '-0.17',
      flash: priceFlashes['EURUSD'] || null
    }
  ];
});
