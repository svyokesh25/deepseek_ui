/**
 * Real-time WebSocket Client & Universal Multi-Symbol OHLC Engine for XtremeNext Chart
 * Server: wss://cloud1.xtremenext.com/server3/
 * Auth:   { "type": "auth", "token": "DATA" }
 * Sub:    { "type": "subscribe", "token": "DATA", "symbol": ["XAUUSD", "EURUSD", ...] }
 * Output: { "type": "tick", "data": { "XAUUSD": { "a": 4190.2, "o": 4190.29 }, ... } }
 */

import { ref, reactive } from 'vue';
import { SYMBOLS, generateBars } from '../data/marketData.js';
import { applyExternalTick } from '../stores/marketFeed.js';

export const wsStatus = ref('disconnected'); // 'connecting' | 'connected' | 'disconnected'
export const lastWsTick = reactive({}); // Keyed by symbol: { symbol, price, ask, bid, time }

// Multi-Symbol Real-Time OHLC State for ALL symbols
export const allSymbolBars = reactive({}); // Key: `${sym}:${tfCode}` -> array of bar objects
export const allSymbolOHLC = reactive({}); // Key: sym -> { open, high, low, close, change, changePct, digits, time }

export const TIMEFRAME_SECONDS = {
  '1': 60,
  '3': 180,
  '5': 300,
  '10': 600,
  '15': 900,
  '30': 1800,
  '60': 3600,
  '120': 7200,
  '240': 14400,
  'D': 86400,
  'W': 604800,
  'M': 2592000
};

const WS_URL = 'wss://cloud1.xtremenext.com/server3/';
const WS_TOKEN = 'DATA';

let ws = null;
let reconnectTimer = null;
let isExplicitlyClosed = false;

// Pre-populate with all known catalog symbols from marketData.js
const allCatalogSymbols = Object.keys(SYMBOLS);
const subscribedSymbols = new Set(allCatalogSymbols.map(s => s.toUpperCase()));
const tickListeners = new Set();

/**
 * Normalizes incoming symbol string to match exact catalog key
 * Handles 'XAUUSD', 'EUR/USD', 'eurusd', 'c.eurusd', etc.
 */
export function normalizeSymbolKey(raw) {
  if (!raw) return '';
  const upper = String(raw).toUpperCase().trim();
  if (SYMBOLS[upper]) return upper;

  const clean = upper.replace(/[^A-Z0-9]/g, '');
  for (const k of Object.keys(SYMBOLS)) {
    if (k.replace(/[^A-Z0-9]/g, '') === clean) {
      return k;
    }
  }
  return upper;
}

export const activeChartTf = ref('15');
export function setActiveTimeframe(tf) {
  if (tf) activeChartTf.value = String(tf);
}

let activeSymbolName = 'XAUUSD';
export function setActiveSymbol(sym) {
  if (sym) {
    activeSymbolName = normalizeSymbolKey(sym);
    subscribeActiveSymbol(sym);
  }
}

/**
 * Connect to XtremeNext WebSocket server
 */
export function connectXtremeNextWs() {
  if (typeof window === 'undefined') return;
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return;
  }

  isExplicitlyClosed = false;
  wsStatus.value = 'connecting';

  try {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      wsStatus.value = 'connected';
      console.log('[XtremeNext WS] Connected to', WS_URL);

      // 1. Authenticate with server
      try {
        ws.send(JSON.stringify({
          type: 'auth',
          token: WS_TOKEN
        }));
      } catch (err) {
        console.error('[XtremeNext WS] Auth send error:', err);
      }

      // 2. Subscribe to instruments immediately
      sendSubscriptions();
      if (activeSymbolName) {
        subscribeActiveSymbol(activeSymbolName);
      }
    };

    ws.onmessage = (event) => {
      try {
        if (!event.data) return;
        const msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (msg && msg.type === 'auth_success') {
          console.log('[XtremeNext WS] Auth success received, ensuring subscriptions active');
          sendSubscriptions();
          if (activeSymbolName) {
            subscribeActiveSymbol(activeSymbolName);
          }
        }
        if (msg && msg.type === 'tick' && msg.data) {
          handleIncomingTickData(msg.data);
        }
      } catch (err) {
        console.warn('[XtremeNext WS] Error parsing message payload:', err);
      }
    };

    ws.onerror = (err) => {
      console.warn('[XtremeNext WS] Socket error:', err);
    };

    ws.onclose = () => {
      wsStatus.value = 'disconnected';
      ws = null;
      if (!isExplicitlyClosed) {
        if (reconnectTimer) clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(() => {
          connectXtremeNextWs();
        }, 3000);
      }
    };
  } catch (e) {
    console.error('[XtremeNext WS] Exception creating WebSocket:', e);
    wsStatus.value = 'disconnected';
    if (!isExplicitlyClosed) {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(connectXtremeNextWs, 3000);
    }
  }
}

/**
 * Sends subscriptions for all instruments to server.
 * Dispatches both the full array AND individual messages to guarantee compatibility.
 */
function sendSubscriptions() {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  const list = Array.from(subscribedSymbols);
  if (!list.length) return;

  try {
    // A. Send batch array: { type: 'subscribe', token: 'DATA', symbol: ["XAUUSD", "EURUSD", ...] }
    const subBatchMsg = {
      type: 'subscribe',
      token: WS_TOKEN,
      symbol: list
    };
    ws.send(JSON.stringify(subBatchMsg));

    // B. Also prioritize sending individual subscribe for EURUSD, XAUUSD, and active symbol
    if (activeSymbolName) {
      subscribeActiveSymbol(activeSymbolName);
    }
  } catch (e) {
    console.error('[XtremeNext WS] Error sending subscribe:', e);
  }
}

/**
 * Unconditionally subscribe to an active instrument symbol
 */
export function subscribeActiveSymbol(sym) {
  if (!sym) return;
  const normalized = normalizeSymbolKey(sym);
  if (!normalized) return;

  subscribedSymbols.add(normalized);
  if (ws && ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(JSON.stringify({
        type: 'subscribe',
        token: WS_TOKEN,
        symbol: [normalized]
      }));
    } catch (e) {
      console.warn('[XtremeNext WS] Error subscribing active symbol:', e);
    }
  }
}

/**
 * Subscribe to additional instrument symbols
 */
export function subscribeSymbol(symbols) {
  if (!symbols) return;
  const arr = Array.isArray(symbols) ? symbols : [symbols];
  let hasNew = false;
  arr.forEach(s => {
    if (s && typeof s === 'string') {
      const normalized = normalizeSymbolKey(s);
      if (!subscribedSymbols.has(normalized)) {
        subscribedSymbols.add(normalized);
        hasNew = true;
      }
    }
  });

  if (hasNew && ws && ws.readyState === WebSocket.OPEN) {
    sendSubscriptions();
  }
}

/**
 * Register tick event listener
 */
export function onWsTick(callback) {
  tickListeners.add(callback);
  return () => tickListeners.delete(callback);
}

/**
 * Retrieve or initialize bar array for any symbol and timeframe
 */
export function getBarsForSymbol(sym, tfCode = '15') {
  const normSym = normalizeSymbolKey(sym);
  const key = `${normSym}:${tfCode}`;
  if (!allSymbolBars[key] || !allSymbolBars[key].length) {
    allSymbolBars[key] = generateBars(normSym, tfCode, 300);
  }
  return allSymbolBars[key];
}

/**
 * Real-time OHLC Bar Generator from Live WebSocket Ticks
 * Updates the existing candle or creates a new candle when the timeframe bucket elapses.
 */
export function updateBarsWithWsTick(bars, tickPrice, tfCode, digits = 2) {
  if (!bars || !bars.length || !tickPrice || isNaN(tickPrice)) return null;

  const tfSec = TIMEFRAME_SECONDS[String(tfCode)] || 900;
  const nowSec = Math.floor(Date.now() / 1000);
  const currentBucketTime = Math.floor(nowSec / tfSec) * tfSec;

  const lastBar = bars[bars.length - 1];
  const p = +Number(tickPrice).toFixed(digits);

  // 1. Same candle bucket: update high, low, close, volume
  if (lastBar.time === currentBucketTime) {
    lastBar.close = p;
    if (p > lastBar.high) lastBar.high = p;
    if (p < lastBar.low) lastBar.low = p;
    lastBar.volume = (lastBar.volume || 1000) + 1;
    return { bar: lastBar, isNew: false };
  }
  // 2. New timeframe period started: roll over into a new candle
  else if (currentBucketTime > lastBar.time) {
    const newBar = {
      time: currentBucketTime,
      open: p,
      high: p,
      low: p,
      close: p,
      volume: 1
    };
    bars.push(newBar);
    return { bar: newBar, isNew: true };
  }
  // 3. Fallback if timestamps are equal or last bar time is slightly ahead of local clock
  else {
    lastBar.close = p;
    if (p > lastBar.high) lastBar.high = p;
    if (p < lastBar.low) lastBar.low = p;
    lastBar.volume = (lastBar.volume || 1000) + 1;
    return { bar: lastBar, isNew: false };
  }
}

/**
 * Calculate OHLC for ANY symbol from incoming price
 */
export function calculateOHLCForSymbol(sym, price, tfCode = '15') {
  const normSym = normalizeSymbolKey(sym);
  const meta = SYMBOLS[normSym] || { digits: 2 };
  const dg = meta.digits ?? 2;

  const bars = getBarsForSymbol(normSym, tfCode);
  const ohlcResult = updateBarsWithWsTick(bars, price, tfCode, dg);

  if (ohlcResult && ohlcResult.bar) {
    const bar = ohlcResult.bar;
    const openP = bar.open;
    const closeP = bar.close;
    const change = +(closeP - openP).toFixed(dg);
    const changePct = openP > 0 ? +((change / openP) * 100).toFixed(2) : 0;

    allSymbolOHLC[normSym] = {
      symbol: normSym,
      name: meta.name || normSym,
      digits: dg,
      open: Number(openP).toFixed(dg),
      high: Number(bar.high).toFixed(dg),
      low: Number(bar.low).toFixed(dg),
      close: Number(closeP).toFixed(dg),
      change,
      changePct,
      time: bar.time,
      isNew: ohlcResult.isNew
    };

    return allSymbolOHLC[normSym];
  }
  return null;
}

/**
 * Process incoming tick dictionary
 * Format: { "XAUUSD": { "a": 4190.2, "o": 4190.29 }, "EURUSD": { "a": ..., "o": ... } }
 */
function handleIncomingTickData(tickDict) {
  if (!tickDict || typeof tickDict !== 'object') return;

  Object.keys(tickDict).forEach(rawSym => {
    const symKey = normalizeSymbolKey(rawSym);
    const item = tickDict[rawSym];
    if (!item) return;

    let price = 0;
    let ask = 0;
    let bid = 0;

    if (typeof item === 'number') {
      price = item;
      ask = item;
      bid = item;
    } else {
      const oVal = item.o != null ? Number(item.o) : null;
      const aVal = item.a != null ? Number(item.a) : null;
      const bVal = item.b != null ? Number(item.b) : null;
      const pVal = item.p != null ? Number(item.p) : null;

      price = oVal ?? aVal ?? bVal ?? pVal ?? 0;
      ask = aVal ?? price;
      bid = bVal ?? oVal ?? price;
    }

    if (!price || isNaN(price)) return;

    const payload = {
      symbol: symKey,
      price,
      ask,
      bid,
      raw: item,
      time: Date.now()
    };

    lastWsTick[symKey] = payload;

    // 1. Calculate live OHLC for this symbol across active timeframe
    calculateOHLCForSymbol(symKey, price, activeChartTf.value);

    // 2. Synchronize to central market feed (Watchlist, TopToolbar, sparklines, positions)
    try {
      applyExternalTick(symKey, price, ask, bid);
    } catch (e) {}

    // 3. Broadcast to tick listeners
    tickListeners.forEach(cb => {
      try {
        cb(symKey, payload);
      } catch (err) {
        console.error('[XtremeNext WS] Callback error:', err);
      }
    });
  });
}

/**
 * Disconnect socket cleanly
 */
export function disconnectXtremeNextWs() {
  isExplicitlyClosed = true;
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (ws) {
    ws.close();
    ws = null;
  }
  wsStatus.value = 'disconnected';
}
