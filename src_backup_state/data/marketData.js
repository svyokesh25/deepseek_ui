function mulberry32(seed) {
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
  XAUUSD:    { name: 'Gold Spot / US Dollar', exchange: 'OANDA', base: 4176.43, vol: 0.006, digits: 2 },
  EURUSD:    { name: 'Euro / US Dollar',       exchange: 'OANDA', base: 1.12073, vol: 0.0015, digits: 5 },
  GBPUSD:    { name: 'Pound / US Dollar',      exchange: 'OANDA', base: 1.31928, vol: 0.0018, digits: 5 },
  USDJPY:    { name: 'US Dollar / Yen',        exchange: 'OANDA', base: 158.278, vol: 0.0016, digits: 3 },
  AUDUSD:    { name: 'Aussie / US Dollar',     exchange: 'OANDA', base: 0.99043, vol: 0.0016, digits: 5 },
  AUDCAD:    { name: 'Aussie / Loonie',        exchange: 'OANDA', base: 0.99320, vol: 0.0016, digits: 5 },
  USDCAD:    { name: 'US Dollar / Loonie',     exchange: 'OANDA', base: 1.42756, vol: 0.0014, digits: 5 },
  USDCHF:    { name: 'US Dollar / Franc',      exchange: 'OANDA', base: 0.83357, vol: 0.0014, digits: 5 },
  BTCUSD:    { name: 'Bitcoin / US Dollar',    exchange: 'CRYPTO', base: 68120.5, vol: 0.025, digits: 2 },
  ETHUSD:    { name: 'Ethereum / US Dollar',   exchange: 'CRYPTO', base: 3450.8,  vol: 0.028, digits: 2 },
  'BKNG.OQ': { name: 'Booking Holdings Inc.', exchange: 'NASDAQ', base: 159.91, vol: 0.008, digits: 2 },
  'BLK.N':   { name: 'BlackRock Inc.', exchange: 'NYSE', base: 1062.30, vol: 0.007, digits: 2 },
  'BMWG.DE': { name: '(BMW) Bay Mot Werke', exchange: 'XETRA', base: 52.42, vol: 0.009, digits: 2 },
  'BNBUSD':  { name: 'Binance Coin / US Dollar', exchange: 'CRYPTO', base: 749.04, vol: 0.015, digits: 2 },
  'BNPP.PA': { name: 'BNP Paribas', exchange: 'EURONEXT', base: 90.80, vol: 0.008, digits: 2 },
  'BRKb.N':  { name: 'Berkshire Hathaway Cl B', exchange: 'NYSE', base: 512.00, vol: 0.006, digits: 2 },
  'BSVUSD':  { name: 'Bitcoin SV / US Dollar', exchange: 'CRYPTO', base: 19.39, vol: 0.02, digits: 2 },
  'BTCEUR':  { name: 'Bitcoin / Euro', exchange: 'CRYPTO', base: 72653.78, vol: 0.025, digits: 2 },
  'C.N':     { name: 'Citigroup Inc.', exchange: 'NYSE', base: 128.05, vol: 0.008, digits: 2 },
  'CAPP.PA': { name: 'Capgemini SE', exchange: 'EURONEXT', base: 114.94, vol: 0.008, digits: 2 },
  'CKEUSD':  { name: 'CKE / US Dollar', exchange: 'CRYPTO', base: 2.16, vol: 0.02, digits: 2 },
  'ALGUSD':  { name: 'Algorand / US Dollar', exchange: 'CRYPTO', base: 0.13, vol: 0.02, digits: 6 },
  'AAL.OQ':  { name: 'American Airlines Group Inc.', exchange: 'NASDAQ', base: 12.79, vol: 0.015, digits: 2 }
}

export function generateBars(symbol, tfCode, count = 300) {
  const meta = SYMBOLS[symbol] || SYMBOLS.XAUUSD
  const seed = hashString(symbol + '::' + tfCode)
  const rnd = mulberry32(seed)
  const tfSeconds = {
    '1': 60,
    '5': 300,
    '15': 900,
    '30': 1800,
    '60': 3600,
    '120': 7200,
    '240': 14400,
    'D': 86400,
    'W': 604800,
    'M': 2592000
  }[String(tfCode)] || 900
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
  { symbol: 'BNPP.PA', last: 90.19, bid: '90.19', bidColor: 'red', ask: '90.22', askColor: 'red', change: -0.42, low: '90.06', high: '91.07', spread: '3' },
  { symbol: 'BRKb.N', last: 515.33, bid: '515.33', bidColor: 'blue', ask: '515.71', askColor: 'red', change: 1.24, low: '508.01', high: '516.47', spread: '38' },
  { symbol: 'BSVUSD', last: 19.39, bid: '19.39', bidColor: 'blue', ask: '19.41', askColor: 'red', change: 2.10, low: '18.53', high: '19.80', spread: '2' },
  { symbol: 'BTCEUR', last: 74519.35, bid: '74519.35', bidColor: 'blue', ask: '74522.44', askColor: 'red', change: -0.24, low: '74359.19', high: '75200.82', spread: '309' },
  { symbol: 'C.N', last: 129.58, bid: '129.58', bidColor: 'blue', ask: '129.65', askColor: 'red', change: 1.64, low: '127.49', high: '129.86', spread: '7' },
  { symbol: 'CAPP.PA', last: 115.94, bid: '115.94', bidColor: 'red', ask: '116.11', askColor: 'blue', change: 2.70, low: '113.64', high: '115.94', spread: '17' },
  { symbol: 'CKEUSD', last: 2.36, bid: '2.36', bidColor: 'red', ask: '2.37', askColor: 'red', change: 0.00, low: '2.35', high: '2.43', spread: '1' },
  { symbol: 'ALGUSD', last: 0.13, bid: null, bidColor: '', ask: null, askColor: '', change: 0.00, low: '0.126000', high: '0.133600', spread: '0', isInactive: true },
  { symbol: 'AAL.OQ', last: 12.72, bid: '12.72', bidColor: 'blue', ask: '12.77', askColor: 'red', change: 0.87, low: '12.47', high: '12.80', spread: '5' },
  { symbol: 'AUDCAD', last: 0.99435, bid: '0.99435', bidColor: 'blue', ask: '0.99440', askColor: 'blue', change: -0.15, low: '0.99386', high: '0.99691', spread: '5' },
  // Page 2 & onwards
  { symbol: 'EURUSD', last: 1.11766, bid: '1.11766', bidColor: 'blue', ask: '1.11770', askColor: 'red', change: 0.21, low: '1.11430', high: '1.11980', spread: '2' },
  { symbol: 'XAUUSD', last: 4171.31, bid: '4171.31', bidColor: 'blue', ask: '4171.45', askColor: 'red', change: 0.36, low: '4150.20', high: '4185.30', spread: '8' },
  { symbol: 'BKNG.OQ', last: 159.84, bid: '159.84', bidColor: 'blue', ask: '159.99', askColor: 'red', change: 3.62, low: '154.25', high: '160.66', spread: '15' },
  { symbol: 'BMWG.DE', last: 53.08, bid: '53.08', bidColor: 'blue', ask: '53.24', askColor: 'blue', change: -0.04, low: '50.32', high: '53.22', spread: '16' },
  { symbol: 'BNBUSD', last: 740.49, bid: '740.49', bidColor: 'blue', ask: '740.50', askColor: 'blue', change: 0.60, low: '733.34', high: '745.39', spread: '1' },
  { symbol: 'USDJPY', last: 158.278, bid: '158.278', bidColor: 'blue', ask: '158.281', askColor: 'red', change: 0.15, low: '157.950', high: '158.620', spread: '3' },
  { symbol: 'GBPUSD', last: 1.31928, bid: '1.31928', bidColor: 'blue', ask: '1.31932', askColor: 'red', change: 0.15, low: '1.31600', high: '1.32100', spread: '2' },
  { symbol: 'AUDUSD', last: 0.99043, bid: '0.99043', bidColor: 'blue', ask: '0.99046', askColor: 'blue', change: 0.15, low: '0.98800', high: '0.99200', spread: '2' },
  { symbol: 'USDCAD', last: 1.42756, bid: '1.42756', bidColor: 'blue', ask: '1.42760', askColor: 'red', change: 0.15, low: '1.42400', high: '1.42900', spread: '2' },
  { symbol: 'USDCHF', last: 0.83357, bid: '0.83357', bidColor: 'blue', ask: '0.83360', askColor: 'blue', change: 0.15, low: '0.83100', high: '0.83500', spread: '2' }
]

export function contractSize(symbol) {
  if (!symbol) return 1
  // Forex major and minor pairs (100,000 units per standard lot)
  const forexPairs = [
    'EURUSD', 'GBPUSD', 'AUDCAD', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD',
    'EURGBP', 'EURAUD', 'EURCAD', 'EURCHF', 'EURJPY', 'EURNOK', 'EURNZD',
    'EURPLN', 'EURSEK', 'EURTRY', 'GBPAUD', 'GBPCAD', 'GBPCHF', 'GBPJPY',
    'GBPNZD', 'NZDCAD', 'NZDCHF', 'NZDJPY', 'SGDJPY', 'AUDCHF', 'AUDJPY',
    'AUDNZD', 'CADCHF', 'CADJPY', 'CHFJPY', 'USDSGD', 'USDHKD', 'USDMXN',
    'USDNOK', 'USDPLN', 'USDSEK', 'USDTRY', 'USDZAR'
  ]
  if (forexPairs.includes(symbol)) return 100000
  if (symbol === 'USDJPY') return 1000

  // Precious Metals (100 oz for Gold)
  if (symbol === 'XAUUSD') return 100

  // Equities / Stock CFDs (1 share per lot)
  if (symbol.includes('.')) return 1

  // Cryptocurrencies (1 token per lot)
  if (['BTCUSD', 'ETHUSD', 'BNBUSD', 'BTCEUR', 'BSVUSD', 'CKEUSD'].includes(symbol)) return 1

  return 1
}


