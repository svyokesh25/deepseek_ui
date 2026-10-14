<template>
  <div class="news-ticker-bar h-[28px] min-h-[28px] bg-[#f8fafc] dark:bg-[#0d111a] border-b border-[#e2e8f0] dark:border-[#1a2232] flex items-center overflow-hidden select-none relative shrink-0 transition-colors">
    <!-- Ticker Label -->
    <div class="flex items-center gap-1.5 px-3 border-r border-[#e2e8f0] dark:border-[#1a2232] h-full shrink-0 bg-[#eef2f6] dark:bg-[#0a0e17]">
      <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
      <span class="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">LIVE</span>
    </div>

    <!-- Scrolling Ticker -->
    <div class="flex-1 overflow-hidden relative">
      <div class="ticker-scroll flex items-center gap-8 whitespace-nowrap animate-ticker">
        <div
          v-for="(item, idx) in doubledItems"
          :key="idx"
          class="flex items-center gap-2 text-[11px] shrink-0 cursor-default"
        >
          <span
            class="w-1.5 h-1.5 rounded-full shrink-0"
            :class="item.sentiment === 'bullish' ? 'bg-emerald-500' : item.sentiment === 'bearish' ? 'bg-red-500' : 'bg-amber-500'"
          ></span>
          <span class="font-bold text-gray-900 dark:text-white/90">{{ item.symbol }}</span>
          <span class="text-gray-600 dark:text-gray-400 max-w-[280px] truncate">{{ item.headline }}</span>
          <span class="text-[9px] font-mono text-gray-400 dark:text-gray-500">{{ item.time }}</span>
        </div>
      </div>
    </div>

    <!-- Close / Toggle Button -->
    <button
      type="button"
      class="w-7 h-full flex items-center justify-center text-gray-400 hover:text-gray-800 dark:text-gray-500 dark:hover:text-white cursor-pointer transition-colors shrink-0 border-l border-[#e2e8f0] dark:border-[#1a2232]"
      title="Close news ticker"
      @click="$emit('close')"
    >
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

defineEmits(['close']);

const newsItems = ref([
  { symbol: 'XAUUSD', headline: 'Gold surges to new all-time high amid geopolitical tensions', sentiment: 'bullish', time: '2m ago' },
  { symbol: 'EURUSD', headline: 'ECB signals potential rate cut in December meeting minutes', sentiment: 'bearish', time: '5m ago' },
  { symbol: 'BTCUSD', headline: 'Bitcoin ETF inflows reach $1.2B — institutional demand accelerates', sentiment: 'bullish', time: '8m ago' },
  { symbol: 'USD', headline: 'US CPI comes in hotter than expected at 3.4% YoY', sentiment: 'bullish', time: '12m ago' },
  { symbol: 'GBPUSD', headline: 'Bank of England holds rates steady, pound weakens on dovish tone', sentiment: 'bearish', time: '15m ago' },
  { symbol: 'US30', headline: 'Dow Jones futures flat ahead of FOMC meeting this week', sentiment: 'neutral', time: '18m ago' },
  { symbol: 'XAGUSD', headline: 'Silver breaks above $32 resistance, targets $34 next', sentiment: 'bullish', time: '22m ago' },
  { symbol: 'USDJPY', headline: 'BOJ intervention fears grow as yen weakens past 158 handle', sentiment: 'bearish', time: '25m ago' },
  { symbol: 'NAS100', headline: 'Tech stocks rally on strong NVIDIA earnings beat, AI optimism', sentiment: 'bullish', time: '30m ago' },
  { symbol: 'OIL', headline: 'Crude oil dips as OPEC+ signals potential output increase', sentiment: 'bearish', time: '35m ago' },
]);

// Double items for seamless infinite scroll
const doubledItems = computed(() => [...newsItems.value, ...newsItems.value]);

// Simulate new headlines arriving
let interval = null;
const cycleHeadlines = [
  { symbol: 'XAUUSD', headline: 'Gold volatility spikes as safe-haven demand surges', sentiment: 'bullish' },
  { symbol: 'EURUSD', headline: 'EUR/USD drops below 1.1200 support on strong USD data', sentiment: 'bearish' },
  { symbol: 'BTCUSD', headline: 'Bitcoin dominance reaches 58% as altcoins lag behind', sentiment: 'neutral' },
  { symbol: 'SPX500', headline: 'S&P 500 hits record close, driven by AI sector rally', sentiment: 'bullish' },
];

onMounted(() => {
  let cycleIdx = 0;
  interval = setInterval(() => {
    const item = cycleHeadlines[cycleIdx % cycleHeadlines.length];
    newsItems.value.unshift({ ...item, time: 'Just now' });
    if (newsItems.value.length > 15) newsItems.value.pop();
    cycleIdx++;
  }, 45000); // New headline every 45s
});

onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
});
</script>

<style scoped>
@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-ticker {
  animation: ticker-scroll 60s linear infinite;
}
.animate-ticker:hover {
  animation-play-state: paused;
}
</style>
