import { ref, reactive } from 'vue';

export const isPnlModalOpen = ref(false);

export const activePnlTrade = reactive({
  symbol: 'XAUUSD',
  side: 'BUY',
  lot: 1.00,
  entry: 4140.20,
  currentPrice: 4172.50,
  pl: 323.00,
  plPercent: 78.02,
  digits: 2,
  leverage: '100x',
  date: new Date().toISOString().slice(0, 10),
  time: new Date().toTimeString().slice(0, 5),
  traderName: 'Trader_X7'
});

export function openPnlCard(trade) {
  if (trade) {
    activePnlTrade.symbol = trade.symbol || 'XAUUSD';
    activePnlTrade.side = trade.side || 'BUY';
    activePnlTrade.lot = trade.lot || 0.01;
    activePnlTrade.entry = Number(trade.entry || 0);
    activePnlTrade.currentPrice = Number(trade.exit || trade.ltp || trade.entry || 0);
    activePnlTrade.pl = Number(trade.pl || 0);
    activePnlTrade.digits = trade.digits ?? 2;
    activePnlTrade.date = trade.time ? trade.time.slice(0, 10) : new Date().toISOString().slice(0, 10);
    activePnlTrade.time = trade.time ? trade.time.slice(11, 16) : new Date().toTimeString().slice(0, 5);

    // Compute realistic ROI percentage based on entry and lot
    const diff = activePnlTrade.currentPrice - activePnlTrade.entry;
    const rawPct = activePnlTrade.entry > 0 ? (diff / activePnlTrade.entry) * 100 * 50 : 0;
    activePnlTrade.plPercent = activePnlTrade.side === 'BUY' ? rawPct : -rawPct;
    if (activePnlTrade.pl > 0 && activePnlTrade.plPercent <= 0) activePnlTrade.plPercent = Math.abs(activePnlTrade.plPercent) || 34.5;
    if (activePnlTrade.pl < 0 && activePnlTrade.plPercent >= 0) activePnlTrade.plPercent = -Math.abs(activePnlTrade.plPercent) || -12.4;
  }
  isPnlModalOpen.value = true;
}

export function closePnlCard() {
  isPnlModalOpen.value = false;
}
