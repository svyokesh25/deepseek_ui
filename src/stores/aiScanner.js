import { ref, reactive } from 'vue';
import { SYMBOLS } from '../data/marketData.js';
import { usePositions } from './positions.js';
import { addDrawing } from './drawings.js';

export const isScannerOpen = ref(false);
export const isScanning = ref(false);

export const scanResult = reactive({
  symbol: 'XAUUSD',
  timeframe: '15m',
  currentPrice: 4172.50,
  bias: 'BULLISH',
  confidence: 91,
  setupType: 'Smart Money (SMC) Liquidity Sweep',
  entry: 4170.00,
  sl: 4155.00,
  tp: 4215.00,
  rr: '1 : 3.0',
  fvgZone: '4162.50 - 4166.80',
  liquidityLevel: '4154.20 (Asian Session Low)',
  notes: 'Sell-side liquidity swept with instant bullish displacement. Order block retest in discount zone.'
});

export function openScanner(symbol = 'XAUUSD', timeframe = '15', price = 4172.50) {
  isScannerOpen.value = true;
  runAiScan(symbol, timeframe, price);
}

export function closeScanner() {
  isScannerOpen.value = false;
  isScanning.value = false;
}

export function runAiScan(symbol = 'XAUUSD', timeframe = '15', price = 4172.50) {
  isScanning.value = true;
  scanResult.symbol = symbol;
  scanResult.timeframe = `${timeframe}m`;

  const meta = SYMBOLS[symbol] || { digits: 2 };
  const dg = meta.digits ?? 2;
  const cur = Number(price) || meta.base || 100;
  scanResult.currentPrice = cur;

  // Simulate scanning radar delay (~700ms)
  setTimeout(() => {
    // Generate dynamic institutional setup based on current symbol and price
    const isBull = Math.random() > 0.35; // 65% bullish bias
    scanResult.bias = isBull ? 'BULLISH' : 'BEARISH';
    scanResult.confidence = Math.floor(Math.random() * 12) + 84; // 84% - 96%
    scanResult.setupType = isBull
      ? 'Institutional Order Block Retest'
      : 'Fair Value Gap (FVG) Breakdown';

    const delta = cur * 0.004; // 0.4% risk distance
    if (isBull) {
      scanResult.entry = +(cur).toFixed(dg);
      scanResult.sl = +(cur - delta).toFixed(dg);
      scanResult.tp = +(cur + delta * 3).toFixed(dg);
      scanResult.rr = '1 : 3.0';
      scanResult.fvgZone = `${(cur - delta * 0.5).toFixed(dg)} – ${(cur - delta * 0.2).toFixed(dg)}`;
      scanResult.liquidityLevel = `${(cur - delta * 1.1).toFixed(dg)} (Key Demand Pivot)`;
      scanResult.notes = 'Sell-side liquidity swept below Asian range. Imbalance filled with strong volume expansion.';
    } else {
      scanResult.entry = +(cur).toFixed(dg);
      scanResult.sl = +(cur + delta).toFixed(dg);
      scanResult.tp = +(cur - delta * 2.8).toFixed(dg);
      scanResult.rr = '1 : 2.8';
      scanResult.fvgZone = `${(cur + delta * 0.3).toFixed(dg)} – ${(cur + delta * 0.6).toFixed(dg)}`;
      scanResult.liquidityLevel = `${(cur + delta * 1.05).toFixed(dg)} (Equal Highs Swept)`;
      scanResult.notes = 'Buy-side liquidity swept into daily resistance. Bearish market structure shift (BOS) confirmed.';
    }

    isScanning.value = false;
  }, 650);
}

export function executeScannedTrade() {
  const account = usePositions();
  const side = scanResult.bias === 'BULLISH' ? 'BUY' : 'SELL';
  account.openPosition(scanResult.symbol, side, 0.10, scanResult.entry);
  closeScanner();
}

export function plotSetupOnChart() {
  const isBull = scanResult.bias === 'BULLISH';
  addDrawing({
    type: isBull ? 'long-pos' : 'short-pos',
    symbol: scanResult.symbol,
    x1: 150,
    y1: 220,
    x2: 360,
    y2: isBull ? 130 : 310
  });
  closeScanner();
}
