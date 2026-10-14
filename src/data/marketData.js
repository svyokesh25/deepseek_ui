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
  XAUUSD:    { name: 'Gold Spot / U.S. Dollar', exchange: 'OANDA', category: 'Commodity', badge: 'CMD', tag: 'XA', base: 4185.00, vol: 0.003, digits: 2 },
  XAGUSD:    { name: 'Silver Spot / U.S. Dollar', exchange: 'OANDA', category: 'Commodity', badge: 'CMD', tag: 'SI', base: 31.85, vol: 0.008, digits: 3 },
  USOIL:     { name: 'Crude Oil WTI', exchange: 'NYMEX', category: 'Commodity', badge: 'CMD', tag: 'CL', base: 74.20, vol: 0.012, digits: 2 },
  EURUSD:    { name: 'Euro / U.S. Dollar', exchange: 'OANDA', category: 'Forex', badge: 'FX', tag: 'EU', base: 1.11810, vol: 0.0015, digits: 5 },
  GBPUSD:    { name: 'British Pound / U.S. Dollar', exchange: 'OANDA', category: 'Forex', badge: 'FX', tag: 'GB', base: 1.32350, vol: 0.0018, digits: 5 },
  USDJPY:    { name: 'US Dollar / Japanese Yen', exchange: 'OANDA', category: 'Forex', badge: 'FX', tag: 'UJ', base: 158.060, vol: 0.0016, digits: 3 },
  AUDUSD:    { name: 'Australian Dollar / U.S. Dollar', exchange: 'OANDA', category: 'Forex', badge: 'FX', tag: 'AU', base: 0.69720, vol: 0.0016, digits: 5 },
  AUDCAD:    { name: 'Australian Dollar / Canadian Dollar', exchange: 'OANDA', category: 'Forex', badge: 'FX', tag: 'AC', base: 0.99420, vol: 0.0016, digits: 5 },
  USDCAD:    { name: 'U.S. Dollar / Canadian Dollar', exchange: 'OANDA', category: 'Forex', badge: 'FX', tag: 'UC', base: 1.42610, vol: 0.0014, digits: 5 },
  USDCHF:    { name: 'U.S. Dollar / Swiss Franc', exchange: 'OANDA', category: 'Forex', badge: 'FX', tag: 'UF', base: 0.83320, vol: 0.0014, digits: 5 },
  BTCUSD:    { name: 'Bitcoin / U.S. Dollar', exchange: 'CRYPTO', category: 'Crypto', badge: 'CRYPTO', tag: 'BT', base: 83520.0, vol: 0.015, digits: 2 },
  ETHUSD:    { name: 'Ethereum / U.S. Dollar', exchange: 'CRYPTO', category: 'Crypto', badge: 'CRYPTO', tag: 'ET', base: 2512.0, vol: 0.018, digits: 2 },
  BNBUSD:    { name: 'Binance Coin / U.S. Dollar', exchange: 'CRYPTO', category: 'Crypto', badge: 'CRYPTO', tag: 'BN', base: 741.90, vol: 0.012, digits: 2 },
  BSVUSD:    { name: 'Bitcoin SV / U.S. Dollar', exchange: 'CRYPTO', category: 'Crypto', badge: 'CRYPTO', tag: 'BS', base: 18.75, vol: 0.02, digits: 2 },
  BTCEUR:    { name: 'Bitcoin / Euro', exchange: 'CRYPTO', category: 'Crypto', badge: 'CRYPTO', tag: 'BE', base: 74620.0, vol: 0.015, digits: 2 },
  CKEUSD:    { name: 'CKE / U.S. Dollar', exchange: 'CRYPTO', category: 'Crypto', badge: 'CRYPTO', tag: 'CK', base: 2.30, vol: 0.02, digits: 2 },
  ALGUSD:    { name: 'Algorand / U.S. Dollar', exchange: 'CRYPTO', category: 'Crypto', badge: 'CRYPTO', tag: 'AL', base: 0.1180, vol: 0.02, digits: 4 },
  US30:      { name: 'Dow Jones Industrial 30', exchange: 'INDEX', category: 'Indices', badge: 'IND', tag: '30', base: 52180.0, vol: 0.005, digits: 1 },
  NAS100:    { name: 'Nasdaq 100 Index', exchange: 'INDEX', category: 'Indices', badge: 'IND', tag: 'NQ', base: 20420.0, vol: 0.008, digits: 1 },
  SPX500:    { name: 'S&P 500 Index', exchange: 'INDEX', category: 'Indices', badge: 'IND', tag: 'SP', base: 5850.5, vol: 0.006, digits: 1 },
  'BKNG.OQ': { name: 'Booking Holdings Inc.', exchange: 'NASDAQ', category: 'Stocks', badge: 'STOCK', tag: 'BK', base: 158.37, vol: 0.008, digits: 2 },
  'BLK.N':   { name: 'BlackRock Inc.', exchange: 'NYSE', category: 'Stocks', badge: 'STOCK', tag: 'BL', base: 1084.00, vol: 0.007, digits: 2 },
  'BMWG.DE': { name: '(BMW) Bay Mot Werke', exchange: 'XETRA', category: 'Stocks', badge: 'STOCK', tag: 'BM', base: 53.18, vol: 0.009, digits: 2 },
  'BNPP.PA': { name: 'BNP Paribas', exchange: 'EURONEXT', category: 'Stocks', badge: 'STOCK', tag: 'BN', base: 90.53, vol: 0.008, digits: 2 },
  'BRKb.N':  { name: 'Berkshire Hathaway Cl B', exchange: 'NYSE', category: 'Stocks', badge: 'STOCK', tag: 'BR', base: 517.40, vol: 0.006, digits: 2 },
  'C.N':     { name: 'Citigroup Inc.', exchange: 'NYSE', category: 'Stocks', badge: 'STOCK', tag: 'CI', base: 131.77, vol: 0.008, digits: 2 },
  'CAPP.PA': { name: 'Capgemini SE', exchange: 'EURONEXT', category: 'Stocks', badge: 'STOCK', tag: 'CA', base: 116.34, vol: 0.008, digits: 2 },
  'AAL.OQ':  { name: 'American Airlines Group Inc.', exchange: 'NASDAQ', category: 'Stocks', badge: 'STOCK', tag: 'AA', base: 12.61, vol: 0.015, digits: 2 }
}

export function generateBars(symbol, tfCode, count = 300) {
  const meta = SYMBOLS[symbol] || SYMBOLS.XAUUSD
  const seed = hashString(symbol + '::' + tfCode)
  const rnd = mulberry32(seed)
  const tfSeconds = {
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
  }[String(tfCode)] || 900

  // Exact bucket alignment: last bar (i = count - 1) has time === currentBucketTime
  const nowSec = Math.floor(Date.now() / 1000)
  const currentBucketTime = Math.floor(nowSec / tfSeconds) * tfSeconds
  const startTime = currentBucketTime - tfSeconds * (count - 1)
  const bars = []
  let price = meta.base * (1 - meta.vol * 3)
  const drift = (meta.base * meta.vol * 0.15) / count

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
      open:  open,
      high:  high,
      low:   low,
      close: close,
      volume
    })
    price = close
  }

  // Anchor final historical candle close directly to meta.base so live ticks connect seamlessly
  const targetEndPrice = meta.base
  const endDrift = targetEndPrice - (bars[bars.length - 1]?.close || targetEndPrice)
  return bars.map(b => ({
    time: b.time,
    open:  +Math.max(0.00001, b.open + endDrift).toFixed(meta.digits),
    high:  +Math.max(0.00001, b.high + endDrift).toFixed(meta.digits),
    low:   +Math.max(0.00001, b.low + endDrift).toFixed(meta.digits),
    close: +Math.max(0.00001, b.close + endDrift).toFixed(meta.digits),
    volume: b.volume
  }))
}

export function getSymbolSummary(symbol, tfCode) {
  const bars = generateBars(symbol, tfCode, 300)
  const last = bars[bars.length - 1]
  const prev = bars[Math.max(0, bars.length - 2)]
  const change = last.close - prev.close
  const changePct = prev.close > 0 ? (change / prev.close) * 100 : 0
  const meta = SYMBOLS[symbol] || SYMBOLS.XAUUSD
  return {
    symbol, name: meta.name, exchange: meta.exchange, digits: meta.digits,
    category: meta.category, badge: meta.badge, tag: meta.tag,
    open: Number(last.open).toFixed(meta.digits),
    high: Number(last.high).toFixed(meta.digits),
    low: Number(last.low).toFixed(meta.digits),
    close: Number(last.close).toFixed(meta.digits),
    change: +change.toFixed(meta.digits),
    changePct: +changePct.toFixed(2)
  }
}

export const WATCHLIST = [
  { symbol: 'XAUUSD', name: 'Gold Spot / U.S. Dollar', category: 'Commodity', badge: 'CMD', tag: 'XA', last: 4185.00, bid: '4184.95', ask: '4185.07', change: 32.40, changePercent: 0.78, digits: 2, spread: '12' },
  { symbol: 'EURUSD', name: 'Euro / U.S. Dollar', category: 'Forex', badge: 'FX', tag: 'EU', last: 1.11810, bid: '1.11810', ask: '1.11812', change: 0.0014, changePercent: 0.13, digits: 5, spread: '2' },
  { symbol: 'GBPUSD', name: 'British Pound / U.S. Dollar', category: 'Forex', badge: 'FX', tag: 'GB', last: 1.32350, bid: '1.32350', ask: '1.32352', change: 0.0042, changePercent: 0.32, digits: 5, spread: '2' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'Forex', badge: 'FX', tag: 'UJ', last: 158.060, bid: '158.058', ask: '158.061', change: 0.18, changePercent: 0.11, digits: 3, spread: '3' },
  { symbol: 'AUDUSD', name: 'Australian Dollar / U.S. Dollar', category: 'Forex', badge: 'FX', tag: 'AU', last: 0.69720, bid: '0.69718', ask: '0.69721', change: 0.0018, changePercent: 0.26, digits: 5, spread: '3' },
  { symbol: 'AUDCAD', name: 'Australian Dollar / Canadian Dollar', category: 'Forex', badge: 'FX', tag: 'AC', last: 0.99420, bid: '0.99418', ask: '0.99424', change: 0.0011, changePercent: 0.11, digits: 5, spread: '6' },
  { symbol: 'USDCAD', name: 'U.S. Dollar / Canadian Dollar', category: 'Forex', badge: 'FX', tag: 'UC', last: 1.42610, bid: '1.42608', ask: '1.42612', change: -0.0012, changePercent: -0.08, digits: 5, spread: '4' },
  { symbol: 'USDCHF', name: 'U.S. Dollar / Swiss Franc', category: 'Forex', badge: 'FX', tag: 'UF', base: 0.83320, last: 0.83320, bid: '0.83318', ask: '0.83321', change: 0.0008, changePercent: 0.10, digits: 5, spread: '3' },
  { symbol: 'XAGUSD', name: 'Silver Spot / U.S. Dollar', category: 'Commodity', badge: 'CMD', tag: 'SI', last: 31.85, bid: '31.85', ask: '31.87', change: 0.42, changePercent: 1.33, digits: 3, spread: '20' },
  { symbol: 'USOIL', name: 'Crude Oil WTI', category: 'Commodity', badge: 'CMD', tag: 'CL', last: 74.20, bid: '74.20', ask: '74.23', change: -0.65, changePercent: -0.87, digits: 2, spread: '3' },
  { symbol: 'BTCUSD', name: 'Bitcoin / U.S. Dollar', category: 'Crypto', badge: 'CRYPTO', tag: 'BT', last: 83520.00, bid: '83520.00', ask: '83522.00', change: 1650.00, changePercent: 2.02, digits: 2, spread: '200' },
  { symbol: 'ETHUSD', name: 'Ethereum / U.S. Dollar', category: 'Crypto', badge: 'CRYPTO', tag: 'ET', last: 2512.00, bid: '2512.00', ask: '2512.30', change: 45.20, changePercent: 1.83, digits: 2, spread: '30' },
  { symbol: 'BNBUSD', name: 'Binance Coin / U.S. Dollar', category: 'Crypto', badge: 'CRYPTO', tag: 'BN', last: 741.90, bid: '741.90', ask: '741.92', change: 5.80, changePercent: 0.79, digits: 2, spread: '2' },
  { symbol: 'BSVUSD', name: 'Bitcoin SV / U.S. Dollar', category: 'Crypto', badge: 'CRYPTO', tag: 'BS', last: 18.75, bid: '18.75', ask: '18.77', change: -0.15, changePercent: -0.79, digits: 2, spread: '2' },
  { symbol: 'BTCEUR', name: 'Bitcoin / Euro', category: 'Crypto', badge: 'CRYPTO', tag: 'BE', last: 74620.00, bid: '74618.00', ask: '74622.00', change: 1350.00, changePercent: 1.84, digits: 2, spread: '400' },
  { symbol: 'CKEUSD', name: 'CKE / U.S. Dollar', category: 'Crypto', badge: 'CRYPTO', tag: 'CK', last: 2.30, bid: '2.30', ask: '2.31', change: 0.04, changePercent: 1.77, digits: 2, spread: '1' },
  { symbol: 'ALGUSD', name: 'Algorand / U.S. Dollar', category: 'Crypto', badge: 'CRYPTO', tag: 'AL', last: 0.1180, bid: '0.1179', ask: '0.1181', change: 0.0000, changePercent: 0.00, digits: 4, spread: '2' },
  { symbol: 'US30', name: 'Dow Jones Industrial 30', category: 'Indices', badge: 'IND', tag: '30', last: 52180.0, bid: '52179.0', ask: '52181.0', change: 210.0, changePercent: 0.40, digits: 1, spread: '2' },
  { symbol: 'NAS100', name: 'Nasdaq 100 Index', category: 'Indices', badge: 'IND', tag: 'NQ', last: 20420.0, bid: '20420.0', ask: '20421.5', change: 165.0, changePercent: 0.81, digits: 1, spread: '15' },
  { symbol: 'SPX500', name: 'S&P 500 Index', category: 'Indices', badge: 'IND', tag: 'SP', last: 5850.5, bid: '5850.5', ask: '5851.0', change: 32.2, changePercent: 0.55, digits: 1, spread: '5' },
  { symbol: 'BKNG.OQ', name: 'Booking Holdings Inc.', category: 'Stocks', badge: 'STOCK', tag: 'BK', last: 158.37, bid: '158.37', ask: '158.54', change: 4.12, changePercent: 2.67, digits: 2, spread: '17' },
  { symbol: 'BLK.N', name: 'BlackRock Inc.', category: 'Stocks', badge: 'STOCK', tag: 'BL', last: 1084.00, bid: '1084.00', ask: '1085.90', change: 14.50, changePercent: 1.36, digits: 2, spread: '190' },
  { symbol: 'BMWG.DE', name: '(BMW) Bay Mot Werke', category: 'Stocks', badge: 'STOCK', tag: 'BM', last: 53.18, bid: '53.18', ask: '53.32', change: 0.12, changePercent: 0.23, digits: 2, spread: '14' },
  { symbol: 'BNPP.PA', name: 'BNP Paribas', category: 'Stocks', badge: 'STOCK', tag: 'BN', last: 90.53, bid: '90.53', ask: '90.57', change: -0.22, changePercent: -0.24, digits: 2, spread: '4' },
  { symbol: 'BRKb.N', name: 'Berkshire Hathaway Cl B', category: 'Stocks', badge: 'STOCK', tag: 'BR', base: 517.40, last: 517.40, bid: '517.40', ask: '517.90', change: 7.20, changePercent: 1.41, digits: 2, spread: '50' },
  { symbol: 'C.N', name: 'Citigroup Inc.', category: 'Stocks', badge: 'STOCK', tag: 'CI', last: 131.77, bid: '131.77', ask: '132.01', change: 2.45, changePercent: 1.89, digits: 2, spread: '24' },
  { symbol: 'CAPP.PA', name: 'Capgemini SE', category: 'Stocks', badge: 'STOCK', tag: 'CA', last: 116.34, bid: '116.34', ask: '116.46', change: 3.45, changePercent: 3.06, digits: 2, spread: '12' },
  { symbol: 'AAL.OQ', name: 'American Airlines Group', category: 'Stocks', badge: 'STOCK', tag: 'AA', last: 12.61, bid: '12.61', ask: '12.66', change: -0.05, changePercent: -0.40, digits: 2, spread: '5' }
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
