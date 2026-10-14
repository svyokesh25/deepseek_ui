import { ref } from 'vue';

const STORAGE_KEY = 'xn_trade_journal';

/**
 * Generates an aesthetic SVG chart thumbnail data URL showing the trade execution
 */
export function generateChartSnapshot(symbol, side, price, pl = null) {
  const isProfit = pl !== null ? pl >= 0 : side === 'BUY';
  const color = isProfit ? '#10b981' : '#f43f5e';
  const sideColor = side === 'BUY' ? '#10b981' : '#f43f5e';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="140" viewBox="0 0 360 140" fill="none">
    <rect width="360" height="140" rx="10" fill="#090d16"/>
    <!-- Subtle grid lines -->
    <line x1="0" y1="35" x2="360" y2="35" stroke="#161f30" stroke-width="1" stroke-dasharray="3 3"/>
    <line x1="0" y1="70" x2="360" y2="70" stroke="#161f30" stroke-width="1" stroke-dasharray="3 3"/>
    <line x1="0" y1="105" x2="360" y2="105" stroke="#161f30" stroke-width="1" stroke-dasharray="3 3"/>
    <!-- Candlestick Wicks & Bodies -->
    <line x1="40" y1="80" x2="40" y2="115" stroke="#10b981" stroke-width="1.5"/>
    <rect x="36" y="90" width="8" height="20" fill="#10b981" rx="1"/>
    <line x1="80" y1="70" x2="80" y2="105" stroke="#f43f5e" stroke-width="1.5"/>
    <rect x="76" y="75" width="8" height="25" fill="#f43f5e" rx="1"/>
    <line x1="120" y1="60" x2="120" y2="95" stroke="#10b981" stroke-width="1.5"/>
    <rect x="116" y="65" width="8" height="22" fill="#10b981" rx="1"/>
    <line x1="160" y1="45" x2="160" y2="85" stroke="#10b981" stroke-width="1.5"/>
    <rect x="156" y="50" width="8" height="28" fill="#10b981" rx="1"/>
    <line x1="200" y1="55" x2="200" y2="90" stroke="#f43f5e" stroke-width="1.5"/>
    <rect x="196" y="60" width="8" height="20" fill="#f43f5e" rx="1"/>
    <line x1="240" y1="30" x2="240" y2="70" stroke="#10b981" stroke-width="1.5"/>
    <rect x="236" y="35" width="8" height="30" fill="#10b981" rx="1"/>
    <line x1="280" y1="20" x2="280" y2="60" stroke="#10b981" stroke-width="1.5"/>
    <rect x="276" y="25" width="8" height="25" fill="#10b981" rx="1"/>
    <!-- Execution marker arrow -->
    <circle cx="280" cy="40" r="14" fill="${sideColor}33" stroke="${sideColor}" stroke-width="1.5"/>
    <text x="280" y="44" font-family="sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle">${side}</text>
    <!-- Label Header -->
    <rect x="12" y="10" width="70" height="20" rx="4" fill="#1e293b"/>
    <text x="47" y="24" font-family="sans-serif" font-weight="bold" font-size="10" fill="#ffffff" text-anchor="middle">${symbol}</text>
    <text x="345" y="24" font-family="monospace" font-weight="bold" font-size="11" fill="${color}" text-anchor="end">${pl !== null ? (pl >= 0 ? '+' : '') + '$' + Number(pl).toFixed(2) : '@ ' + price}</text>
  </svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const defaultEntries = [
  {
    id: 101,
    date: '2026-10-14 11:30',
    symbol: 'XAUUSD',
    strategy: 'S/R Bounce',
    mindset: 'Disciplined',
    rating: 5,
    isAuto: true,
    side: 'BUY',
    lot: 0.20,
    price: 4165.20,
    pl: 185.00,
    mistakes: [],
    aiSuggestion: '✅ Pristine Execution: Perfect risk sizing (0.20 lot) and patient entry at key support.',
    snapshot: generateChartSnapshot('XAUUSD', 'BUY', 4165.20, 185.00),
    reason: 'Bought key 4,165 support confluence on 15m. Perfect liquidity sweep confirmation.',
    lesson: 'Patience pays off. Took profit at first trouble zone with 1:2.8 R:R.'
  },
  {
    id: 102,
    date: '2026-10-14 09:12',
    symbol: 'XAUUSD',
    strategy: 'Scalp',
    mindset: 'Revenge',
    rating: 2,
    isAuto: true,
    side: 'SELL',
    lot: 0.80,
    price: 4182.00,
    pl: -140.00,
    mistakes: ['Revenge Trading', 'Oversizing'],
    aiSuggestion: '⚠️ AI Alert: Entered 2m after taking a loss with 4x your typical lot size (0.80 vs 0.20). Implement a mandatory 15-minute cooldown rule after any loss.',
    snapshot: generateChartSnapshot('XAUUSD', 'SELL', 4182.00, -140.00),
    reason: 'Felt frustrated by previous stopped-out trade. Tried to quickly make back loss.',
    lesson: 'Never enter on tilt. Hard stop for the session if emotion takes over.'
  },
  {
    id: 103,
    date: '2026-10-13 16:45',
    symbol: 'EURUSD',
    strategy: 'Breakout',
    mindset: 'Confident',
    rating: 4,
    isAuto: true,
    side: 'BUY',
    lot: 0.25,
    price: 1.12050,
    pl: 74.20,
    mistakes: [],
    aiSuggestion: '✅ Disciplined execution with appropriate risk. Good trailing stop management.',
    snapshot: generateChartSnapshot('EURUSD', 'BUY', 1.12050, 74.20),
    reason: 'London close momentum push above daily high.',
    lesson: 'Closed 50% partial at +20 pips, moved stop to breakeven.'
  }
];

export const journalEntries = ref(loadJournalEntries());

let lastClosedLossTime = 0;

function loadJournalEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [...defaultEntries];
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journalEntries.value));
  } catch (e) {}
}

export function addJournalEntry(entry) {
  const newEntry = {
    id: Date.now(),
    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    rating: 5,
    mindset: 'Disciplined',
    strategy: 'Discretionary',
    mistakes: [],
    aiSuggestion: 'Manual entry logged. Reflect on rule compliance.',
    isAuto: false,
    ...entry
  };
  journalEntries.value.unshift(newEntry);
  persist();
  return newEntry;
}

export function autoLogTrade(trade, eventType = 'OPEN') {
  const nowMs = Date.now();
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const isClose = eventType === 'CLOSE';
  const lot = trade.lot || 0.01;
  const pl = isClose ? (trade.pl || 0) : null;

  // Automated Mistake Detection Engine
  const detectedMistakes = [];
  let aiSuggestion = '';

  // 1. Detect Revenge Trading (new trade within 3m of last loss)
  if (!isClose && lastClosedLossTime > 0 && (nowMs - lastClosedLossTime) < 180000) {
    detectedMistakes.push('Revenge Trading');
  }

  // 2. Detect Oversizing (> 0.50 lot or > 2.5x standard 0.10 lot)
  if (lot >= 0.50) {
    detectedMistakes.push('Oversizing');
  }

  // Update last loss tracker
  if (isClose && pl < 0) {
    lastClosedLossTime = nowMs;
  }

  if (detectedMistakes.includes('Revenge Trading') && detectedMistakes.includes('Oversizing')) {
    aiSuggestion = '🚨 High Risk Tilt: Opened trade immediately after a loss with elevated lot size. Take a 15-minute breather to reset.';
  } else if (detectedMistakes.includes('Revenge Trading')) {
    aiSuggestion = '⚠️ Revenge Trading Risk: Trade opened within 3 minutes of a loss. Step away for 10 minutes to protect capital.';
  } else if (detectedMistakes.includes('Oversizing')) {
    aiSuggestion = `⚠️ Oversizing Risk: Lot size (${lot}) is significantly above normal risk parameters. Keep risk within 1-2% of equity.`;
  } else if (isClose) {
    aiSuggestion = pl >= 0
      ? '✅ Well-managed execution. Trade hit target with planned risk/reward.'
      : '🛡️ Clean stop-loss execution. Cutting losses without hesitation preserves trading capital.';
  } else {
    aiSuggestion = '✅ Disciplined Execution: Standard sizing and proper entry parameters followed.';
  }

  const entry = {
    id: nowMs,
    date: now,
    symbol: trade.symbol,
    side: trade.side,
    lot: lot,
    price: trade.entry || trade.exit || 0,
    pl: pl,
    strategy: isClose ? 'Trade Closed' : 'Execution Snapshot',
    mindset: detectedMistakes.length > 0 ? (detectedMistakes.includes('Revenge Trading') ? 'Revenge' : 'FOMO') : (isClose && pl > 0 ? 'Confident' : 'Disciplined'),
    rating: detectedMistakes.length > 0 ? 2 : (isClose && pl > 0 ? 5 : 4),
    mistakes: detectedMistakes,
    aiSuggestion: aiSuggestion,
    isAuto: true,
    snapshot: generateChartSnapshot(
      trade.symbol,
      trade.side,
      trade.entry || trade.exit || 0,
      pl
    ),
    reason: isClose
      ? `Auto-Closed ${trade.side} ${lot} lot of ${trade.symbol} at ${trade.exit || trade.entry}. Realized P/L: ${pl >= 0 ? '+' : ''}$${Number(pl).toFixed(2)}.`
      : `Auto-Executed ${trade.side} ${lot} lot of ${trade.symbol} at ${trade.entry}. Live execution snapshot captured.`,
    lesson: isClose
      ? (pl >= 0 ? 'Trade played out according to plan. Great profit capture.' : 'Cut loss early without hesitation. Capital preserved.')
      : 'Order entered with optimal spread.'
  };

  journalEntries.value.unshift(entry);
  persist();
}

export function deleteJournalEntry(id) {
  journalEntries.value = journalEntries.value.filter(e => e.id !== id);
  persist();
}
