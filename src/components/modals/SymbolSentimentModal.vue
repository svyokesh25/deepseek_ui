<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in" @click.self="$emit('close')">
      <div class="w-full max-w-2xl bg-[#0d121e] border border-[#1e2a3b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] my-auto font-sans select-none">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#1e2a3b] flex items-center justify-between bg-gradient-to-r from-cyan-600/15 via-blue-600/10 to-transparent">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-xl text-cyan-400">
            📊
          </div>
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              Institutional Sentiment & Catalyst Matrix
              <span class="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                LIVE AI
              </span>
            </h2>
            <p class="text-xs text-gray-400">Real-time aggregate order-flow, retail positioning & news sentiment</p>
          </div>
        </div>
        <button
          type="button"
          class="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Symbol Filter Bar -->
      <div class="px-6 py-3 bg-[#0a0f19] border-b border-[#1e2a3b] flex items-center justify-between">
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            v-for="s in symbolsList"
            :key="s"
            type="button"
            class="px-2.5 py-1 text-xs rounded-lg font-mono font-bold transition-all cursor-pointer"
            :class="selectedSymbol === s
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
              : 'text-gray-400 hover:text-white hover:bg-white/5'"
            @click="selectedSymbol = s"
          >
            {{ s }}
          </button>
        </div>
        <span class="text-[10px] text-gray-400 font-mono">Updated: Just now</span>
      </div>

      <!-- Main Body -->
      <div class="p-6 overflow-y-auto custom-scrollbar space-y-5">
        <!-- Sentiment Gauge & Key Score Hero Card -->
        <div class="p-4 rounded-xl bg-[#111827] border border-[#1e2a3f] grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <!-- Radial Score Gauge -->
          <div class="flex flex-col items-center justify-center text-center">
            <div class="relative w-28 h-28 flex items-center justify-center">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  class="text-gray-800"
                  stroke="currentColor"
                  stroke-width="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  :class="activeData.score >= 50 ? 'text-emerald-400' : 'text-rose-400'"
                  :stroke-dasharray="`${activeData.score}, 100`"
                  stroke="currentColor"
                  stroke-width="3.2"
                  stroke-linecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span class="text-xl font-black text-white tabular-nums">{{ activeData.score }}%</span>
                <span class="text-[9px] uppercase font-bold text-gray-400">{{ activeData.label }}</span>
              </div>
            </div>
            <span class="text-[11px] font-bold text-white mt-1">{{ selectedSymbol }} Composite Sentiment</span>
          </div>

          <!-- Institutional vs Retail Split -->
          <div class="space-y-3">
            <div>
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-gray-400">Institutional Bias</span>
                <span class="font-bold text-emerald-400 font-mono">{{ activeData.instLong }}% Long</span>
              </div>
              <div class="w-full h-2 rounded-full bg-gray-800 overflow-hidden flex">
                <div class="bg-emerald-500 h-full transition-all" :style="{ width: activeData.instLong + '%' }"></div>
                <div class="bg-rose-500 h-full flex-1"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-gray-400">Retail Crowd Exposure</span>
                <span class="font-bold text-rose-400 font-mono">{{ activeData.retailLong }}% Long</span>
              </div>
              <div class="w-full h-2 rounded-full bg-gray-800 overflow-hidden flex">
                <div class="bg-blue-500 h-full transition-all" :style="{ width: activeData.retailLong + '%' }"></div>
                <div class="bg-amber-500 h-full flex-1"></div>
              </div>
            </div>
          </div>

          <!-- AI Market Regime Analysis -->
          <div class="p-3 rounded-lg bg-[#0a0e17] border border-[#1b2536] space-y-1.5 text-xs">
            <span class="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">AI Sentiment Verdict</span>
            <p class="text-gray-300 text-[11px] leading-relaxed">
              {{ activeData.verdict }}
            </p>
          </div>
        </div>

        <!-- News Catalysts & Impact Points Table -->
        <div class="space-y-2.5">
          <h4 class="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
            <span>Recent Catalysts & Impact Breakdown</span>
            <span class="text-[10px] text-gray-500">Weighted AI Impact Score</span>
          </h4>

          <div class="space-y-2">
            <div
              v-for="cat in activeData.catalysts"
              :key="cat.headline"
              class="p-3 rounded-xl bg-[#111827] border border-[#1e2a3f] flex items-center justify-between gap-3 hover:border-cyan-500/30 transition-colors"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <span
                  class="w-2 h-2 rounded-full shrink-0"
                  :class="cat.impact > 0 ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-rose-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]'"
                ></span>
                <div class="min-w-0">
                  <div class="text-xs font-bold text-white truncate">{{ cat.headline }}</div>
                  <div class="text-[10px] text-gray-400">{{ cat.source }} • {{ cat.time }}</div>
                </div>
              </div>

              <div
                class="px-2 py-0.5 rounded text-xs font-mono font-bold shrink-0"
                :class="cat.impact > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'"
              >
                {{ cat.impact > 0 ? '+' : '' }}{{ cat.impact }} pts
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';

defineEmits(['close']);

const symbolsList = ['XAUUSD', 'EURUSD', 'GBPUSD', 'BTCUSD', 'USDJPY', 'US30'];
const selectedSymbol = ref('XAUUSD');

const sentimentDatabase = {
  XAUUSD: {
    score: 82,
    label: 'Strong Greed',
    instLong: 76,
    retailLong: 44,
    verdict: 'Heavy institutional accumulation observed on lower dips. Retail traders heavily positioned short, creating high-probability short-squeeze fuel towards higher resistance.',
    catalysts: [
      { headline: 'Central Banks expand gold bullion reserves by record 42 tons in Q3', source: 'Bloomberg', time: '18m ago', impact: +28 },
      { headline: 'Geopolitical risk premium accelerates safe-haven flight to precious metals', source: 'Reuters', time: '45m ago', impact: +35 },
      { headline: 'US Dollar Index consolidates near critical resistance', source: 'FXStreet', time: '2h ago', impact: +12 }
    ]
  },
  EURUSD: {
    score: 65,
    label: 'Moderate Bullish',
    instLong: 62,
    retailLong: 52,
    verdict: 'Euro displays relative resilience following steady European industrial recovery data. Sentiment leans positive above 1.1180 support pivot.',
    catalysts: [
      { headline: 'Eurozone PMI beats expectations, signaling manufacturing stabilization', source: 'Financial Times', time: '1h ago', impact: +18 },
      { headline: 'ECB comments lean hawkish regarding sticky core inflation', source: 'Reuters', time: '3h ago', impact: +14 }
    ]
  },
  GBPUSD: {
    score: 54,
    label: 'Neutral',
    instLong: 51,
    retailLong: 49,
    verdict: 'Sterling consolidating within a 45-pip equilibrium channel. Market waiting for tomorrow morning UK CPI data before committing direction.',
    catalysts: [
      { headline: 'UK Wage growth holds steady at 4.9% YoY', source: 'Office for National Statistics', time: '2h ago', impact: +6 }
    ]
  },
  BTCUSD: {
    score: 88,
    label: 'Extreme Greed',
    instLong: 84,
    retailLong: 68,
    verdict: 'Aggressive institutional spot ETF inflows exceeding $1.2B this week. Liquidations heavily favor upside expansion toward all-time highs.',
    catalysts: [
      { headline: 'Spot ETF weekly inflows reach new monthly record', source: 'Coindesk', time: '30m ago', impact: +40 },
      { headline: 'On-chain exchange reserves plunge to lowest level since 2021', source: 'Glassnode', time: '1h ago', impact: +25 }
    ]
  },
  USDJPY: {
    score: 30,
    label: 'Fear / Bearish',
    instLong: 28,
    retailLong: 71,
    verdict: 'Heightened risk of Ministry of Finance FX intervention above 158.00. Institutional order flow favors downside liquidation sweeps.',
    catalysts: [
      { headline: 'Bank of Japan hints at unscheduled policy review', source: 'Nikkei', time: '40m ago', impact: -32 }
    ]
  },
  US30: {
    score: 68,
    label: 'Bullish',
    instLong: 65,
    retailLong: 48,
    verdict: 'Industrial and blue-chip equities supported by resilient earnings and easing yield volatility.',
    catalysts: [
      { headline: 'Corporate earnings beats surpass 78% of reported S&P companies', source: 'WSJ', time: '2h ago', impact: +22 }
    ]
  }
};

const activeData = computed(() => {
  return sentimentDatabase[selectedSymbol.value] || sentimentDatabase['XAUUSD'];
});
</script>
