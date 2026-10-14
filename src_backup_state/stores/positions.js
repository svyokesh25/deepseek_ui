// Reactive positions store. Single source of truth for every table,
// every tab count, and the footer account stats.
//
// Bulk operations closeAllPositions / closeProfitablePositions /
// closeLosingPositions all mutate positions.value in a single synchronous
// assignment, so Vue re-renders exactly once.

import { ref, computed } from 'vue';
import { SYMBOLS, contractSize } from '../data/marketData.js';
import { useNotifications } from './notifications.js';

// Seed initial positions matching original reference screenshot
const positions = ref([
  {
    id: 9923,
    time: '2026-10-06 17:20:57',
    symbol: 'BKNG.OQ',
    side: 'BUY',
    lot: 1,
    entry: 155.84,
    ltp: 160.24,
    partial: '',
    sl: '',
    tp: '',
    swap: -0.70,
    commission: 0.00,
    digits: 2,
    pl: 4.40
  },
  {
    id: 10188,
    time: '2026-10-09 07:03:56',
    symbol: 'EURUSD',
    side: 'BUY',
    lot: 0.01,
    entry: 1.12274,
    ltp: 1.12050,
    partial: '',
    sl: '',
    tp: '',
    swap: -0.14,
    commission: 0.00,
    digits: 5,
    pl: -2.24
  },
  {
    id: 10189,
    time: '2026-10-09 09:48:04',
    symbol: 'BMWG.DE',
    side: 'BUY',
    lot: 1,
    entry: 52.98,
    ltp: 57.52,
    partial: '',
    sl: '',
    tp: '',
    swap: -0.20,
    commission: 0.00,
    digits: 2,
    pl: 4.54
  }
]);

// Seed closed trades matching reference tab 'History 24H (6)'
const history = ref([
  { id: 9850, closeTime: '2026-10-06 14:15:22', symbol: 'AUDCAD', side: 'BUY',  lot: 0.01, entry: 0.99320, exit: 0.99420, pl: 1.00,  digits: 5 },
  { id: 9812, closeTime: '2026-10-06 11:02:10', symbol: 'EURUSD', side: 'SELL', lot: 0.01, entry: 1.12150, exit: 1.12080, pl: 0.70,  digits: 5 },
  { id: 9780, closeTime: '2026-10-05 18:40:05', symbol: 'XAUUSD', side: 'BUY',  lot: 0.01, entry: 4170.50, exit: 4172.00, pl: 1.50,  digits: 2 },
  { id: 9755, closeTime: '2026-10-05 16:22:30', symbol: 'BKNG.OQ', side: 'BUY',  lot: 1,    entry: 154.20,  exit: 155.50,  pl: 1.30,  digits: 2 },
  { id: 9720, closeTime: '2026-10-05 12:10:15', symbol: 'BMWG.DE', side: 'SELL', lot: 1,    entry: 53.40,   exit: 53.80,   pl: -0.40, digits: 2 },
  { id: 9690, closeTime: '2026-10-05 09:05:44', symbol: 'BSVUSD',  side: 'BUY',  lot: 0.01, entry: 19.20,   exit: 19.10,   pl: -0.10, digits: 2 }
]);

let nextId = 10220;
let lastOrderTime = 0;
let lastOrderKey = '';

// Exact seed balance matching reference (7,484.29)
const realizedBalance = ref(7484.29);

function updateQuote(symbol, price) {
  const meta = SYMBOLS[symbol] || SYMBOLS.BSVUSD || { digits: 5 };
  positions.value.forEach(p => {
    if (p.symbol !== symbol) return;
    p.ltp = +price.toFixed(p.digits || meta.digits);
    const diff = p.side === 'BUY' ? (p.ltp - p.entry) : (p.entry - p.ltp);
    const cSize = contractSize ? contractSize(symbol) : 1;
    // Pure floating gross P/L (swap is an accrual, not subtracted from price difference P/L)
    p.pl = +(diff * p.lot * cSize).toFixed(2);
  });
}

export function usePositions() {
  // ---- single-position operations ----
  function openPosition({ symbol, side, lot, price, digits }) {
    const nowMs = Date.now();
    const orderKey = `${symbol}_${side}_${lot}`;

    // Bulletproof de-duplication: discard duplicate orders within 450ms
    if (nowMs - lastOrderTime < 450 && lastOrderKey === orderKey) {
      console.warn('[xn] Ignored duplicate order submission:', orderKey);
      return null;
    }
    lastOrderTime = nowMs;
    lastOrderKey = orderKey;

    const meta = SYMBOLS[symbol] || SYMBOLS.BSVUSD || { digits: 5 };
    const dg = digits != null ? digits : meta.digits;
    const id = ++nextId;
    const now = new Date();
    const time = now.toISOString().slice(0, 10) + ' ' + now.toISOString().slice(11, 19);
    const entry = +(+price).toFixed(dg);

    const newPos = {
      id,
      time,
      symbol,
      side,
      lot: typeof lot === 'number' && !isNaN(lot) ? +lot : 0.01,
      entry,
      ltp: entry,
      partial: '',
      sl: '',
      tp: '',
      swap: 0.00, // Newly opened intraday positions start with 0.00 swap
      commission: 0.00,
      digits: dg,
      pl: 0.00
    };
    positions.value.push(newPos);

    // Trigger toast notification matching reference format
    const { notifyOrder } = useNotifications();
    notifyOrder(side, symbol, newPos.lot, entry, dg);

    return id;
  }

  function closePosition(id) {
    const p = positions.value.find(x => x.id === id);
    if (p) {
      const realizedPl = p.pl || 0;
      realizedBalance.value = +(realizedBalance.value + realizedPl).toFixed(2);

      const now = new Date();
      const closeTime = now.toISOString().slice(0, 10) + ' ' + now.toISOString().slice(11, 19);
      history.value.unshift({
        id: p.id,
        closeTime,
        symbol: p.symbol,
        side: p.side,
        lot: p.lot,
        entry: p.entry,
        exit: p.ltp || p.entry,
        pl: realizedPl,
        digits: p.digits || 2
      });

      const { notifyClose } = useNotifications();
      notifyClose(p.id, p.symbol);
    }
    positions.value = positions.value.filter(p => p.id !== id);
  }

  function updateLtp(symbol, price) {
    updateQuote(symbol, price);
  }

  function setStopLoss(id, value) {
    const p = positions.value.find(x => x.id === id);
    if (p) p.sl = value;
  }

  function setTarget(id, value) {
    const p = positions.value.find(x => x.id === id);
    if (p) p.tp = value;
  }

  // ---- bulk operations (used by the ... menu in the tab strip) ----
  function closeAllPositions() {
    const count = positions.value.length;
    if (count === 0) return;

    const now = new Date();
    const closeTime = now.toISOString().slice(0, 10) + ' ' + now.toISOString().slice(11, 19);

    positions.value.forEach(p => {
      const realizedPl = p.pl || 0;
      realizedBalance.value = +(realizedBalance.value + realizedPl).toFixed(2);
      history.value.unshift({
        id: p.id,
        closeTime,
        symbol: p.symbol,
        side: p.side,
        lot: p.lot,
        entry: p.entry,
        exit: p.ltp || p.entry,
        pl: realizedPl,
        digits: p.digits || 2
      });
    });

    positions.value = [];
    const { notify } = useNotifications();
    notify({ message: `Closed all ${count} open positions`, type: 'info' });
  }

  function closeProfitablePositions() {
    const profitable = positions.value.filter(p => (p.pl || 0) > 0);
    if (profitable.length === 0) return;

    const now = new Date();
    const closeTime = now.toISOString().slice(0, 10) + ' ' + now.toISOString().slice(11, 19);

    profitable.forEach(p => {
      const realizedPl = p.pl || 0;
      realizedBalance.value = +(realizedBalance.value + realizedPl).toFixed(2);
      history.value.unshift({
        id: p.id,
        closeTime,
        symbol: p.symbol,
        side: p.side,
        lot: p.lot,
        entry: p.entry,
        exit: p.ltp || p.entry,
        pl: realizedPl,
        digits: p.digits || 2
      });
    });

    positions.value = positions.value.filter(p => (p.pl || 0) <= 0);
    const { notify } = useNotifications();
    notify({ message: `Closed ${profitable.length} profitable positions`, type: 'info' });
  }

  function closeLosingPositions() {
    const losing = positions.value.filter(p => (p.pl || 0) < 0);
    if (losing.length === 0) return;

    const now = new Date();
    const closeTime = now.toISOString().slice(0, 10) + ' ' + now.toISOString().slice(11, 19);

    losing.forEach(p => {
      const realizedPl = p.pl || 0;
      realizedBalance.value = +(realizedBalance.value + realizedPl).toFixed(2);
      history.value.unshift({
        id: p.id,
        closeTime,
        symbol: p.symbol,
        side: p.side,
        lot: p.lot,
        entry: p.entry,
        exit: p.ltp || p.entry,
        pl: realizedPl,
        digits: p.digits || 2
      });
    });

    positions.value = positions.value.filter(p => (p.pl || 0) >= 0);
    const { notify } = useNotifications();
    notify({ message: `Closed ${losing.length} losing positions`, type: 'info' });
  }

  async function cancelAllPendingOrders() { return { cancelled: 0 }; }
  async function cancelLimitOrders()      { return { cancelled: 0 }; }
  async function cancelStopOrders()       { return { cancelled: 0 }; }

  // ---- derived account stats ----
  const totalPl = computed(() =>
    +positions.value.reduce((s, p) => s + (p.pl || 0), 0).toFixed(2)
  );
  const balance = computed(() => +realizedBalance.value.toFixed(2));
  const equity  = computed(() => +(realizedBalance.value + totalPl.value).toFixed(2));
  const usedMargin = computed(() => 0.00);
  const freeMargin = computed(() => +(equity.value).toFixed(2));
  // In demo accounts where used margin is 0.00, Margin Level is safely reported as 0.00%
  const marginLevel = computed(() => usedMargin.value <= 0 ? 0.00 : +((equity.value / usedMargin.value) * 100).toFixed(2));
  const positionCount = computed(() => positions.value.length);
  const historyCount = computed(() => history.value.length);

  const pnlBySymbol = computed(() => {
    const map = {};
    positions.value.forEach(p => {
      if (!map[p.symbol]) map[p.symbol] = 0;
      map[p.symbol] += (p.pl || 0);
    });
    return map;
  });

  return {
    positions,
    history,
    openPosition,
    closePosition,
    updateLtp,
    setStopLoss,
    setTarget,
    updateQuote,

    // bulk
    closeAllPositions,
    closeProfitablePositions,
    closeLosingPositions,
    cancelAllPendingOrders,
    cancelLimitOrders,
    cancelStopOrders,

    // derived
    positionCount,
    historyCount,
    pnlBySymbol,
    balance,
    equity,
    usedMargin,
    freeMargin,
    marginLevel,
    totalPl
  };
}