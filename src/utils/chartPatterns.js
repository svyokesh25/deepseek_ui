/**
 * Candlestick Pattern & Support/Resistance Detector Utility
 * Analyzes OHLC bars and identifies high-probability price action patterns
 */

export function detectCandlePatterns(bars) {
  if (!bars || bars.length < 5) return [];

  const detected = [];
  const len = bars.length;

  for (let i = 2; i < len; i++) {
    const cur = bars[i];
    const prev = bars[i - 1];
    const prev2 = bars[i - 2];

    const curBody = Math.abs(cur.close - cur.open);
    const curRange = cur.high - cur.low;
    const isCurBull = cur.close >= cur.open;

    const prevBody = Math.abs(prev.close - prev.open);
    const isPrevBull = prev.close >= prev.open;

    // 1. Bullish Engulfing
    if (!isPrevBull && isCurBull && cur.open <= prev.close && cur.close >= prev.open && curBody > prevBody * 1.1) {
      detected.push({
        id: `be_${i}`,
        index: i,
        time: cur.time,
        price: cur.low,
        name: 'Bullish Engulfing',
        shortName: 'Bull Engulf',
        bias: 'bullish',
        desc: 'Buyers completely overwhelmed previous selling pressure.'
      });
      continue;
    }

    // 2. Bearish Engulfing
    if (isPrevBull && !isCurBull && cur.open >= prev.close && cur.close <= prev.open && curBody > prevBody * 1.1) {
      detected.push({
        id: `bre_${i}`,
        index: i,
        time: cur.time,
        price: cur.high,
        name: 'Bearish Engulfing',
        shortName: 'Bear Engulf',
        bias: 'bearish',
        desc: 'Sellers completely overwhelmed previous buyer momentum.'
      });
      continue;
    }

    // 3. Hammer (Bullish Reversal on lower wick rejection)
    const lowerWick = Math.min(cur.open, cur.close) - cur.low;
    const upperWick = cur.high - Math.max(cur.open, cur.close);
    if (curRange > 0 && lowerWick >= curBody * 2 && upperWick <= curBody * 0.5) {
      detected.push({
        id: `hm_${i}`,
        index: i,
        time: cur.time,
        price: cur.low,
        name: 'Hammer',
        shortName: 'Hammer',
        bias: 'bullish',
        desc: 'Strong rejection of lower price levels indicating demand emergence.'
      });
      continue;
    }

    // 4. Shooting Star / Inverted Hammer (Bearish rejection of highs)
    if (curRange > 0 && upperWick >= curBody * 2 && lowerWick <= curBody * 0.5) {
      detected.push({
        id: `ss_${i}`,
        index: i,
        time: cur.time,
        price: cur.high,
        name: 'Shooting Star',
        shortName: 'Shoot Star',
        bias: 'bearish',
        desc: 'Rejection of higher prices with sellers driving price back down.'
      });
      continue;
    }

    // 5. Morning Star (3-bar bullish reversal)
    if (!isPrevBull && prev2 && !prev2.isBull && isCurBull && cur.close > (prev2.open + prev2.close) / 2) {
      if (prevBody < curBody * 0.5) {
        detected.push({
          id: `ms_${i}`,
          index: i,
          time: cur.time,
          price: cur.low,
          name: 'Morning Star',
          shortName: 'Morn Star',
          bias: 'bullish',
          desc: 'Three-candle reversal pattern confirming buyer exhaustion turnaround.'
        });
        continue;
      }
    }
  }

  // Return the most recent 6 patterns to keep the chart clean and uncluttered
  return detected.slice(-6);
}
