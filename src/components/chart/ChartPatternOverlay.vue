<template>
  <div class="pointer-events-none absolute inset-0 z-20 overflow-hidden font-sans select-none">
    <!-- Toggle Button settled cleanly inside chart canvas, safely clear of price scale line -->
    <div class="absolute top-2 right-28 pointer-events-auto z-30">
      <button
        type="button"
        class="flex items-center gap-1.5 px-2.5 h-[24px] rounded-md text-[11px] font-semibold border transition-all shadow-xs cursor-pointer select-none active:scale-95"
        :class="showPatterns
          ? 'bg-blue-600 text-white border-blue-500 shadow-xs dark:bg-blue-600/90 dark:text-white dark:border-blue-400/50'
          : 'bg-white/95 hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-[#d2d6dc] shadow-xs dark:bg-[#131823]/95 dark:hover:bg-[#182030] dark:text-gray-300 dark:border-[#1a2232]'"
        :title="showPatterns ? 'Hide AI Candlestick Patterns' : 'Detect & Overlay Candlestick Patterns'"
        @click="showPatterns = !showPatterns"
      >
        <span class="text-[10px] text-amber-500 leading-none">⚡</span>
        <span class="tracking-tight text-[10.5px] leading-none">AI Patterns</span>
        <span
          class="w-1.5 h-1.5 rounded-full ml-0.5"
          :class="showPatterns ? 'bg-cyan-200 dark:bg-cyan-300 animate-pulse' : 'bg-slate-400 dark:bg-gray-500'"
        ></span>
      </button>
    </div>

    <!-- Pattern Badges Overlaid on Chart Canvas -->
    <div v-if="showPatterns" class="absolute inset-0 pointer-events-none">
      <div
        v-for="(pat, idx) in detectedPatterns"
        :key="pat.id"
        class="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group cursor-pointer"
        :style="{
          left: (25 + (idx * 14)) + '%',
          top: (pat.bias === 'bullish' ? (58 - (idx % 3) * 6) : (28 + (idx % 3) * 6)) + '%'
        }"
        @click="selectedPattern = selectedPattern?.id === pat.id ? null : pat"
      >
        <!-- Floating Badge -->
        <div
          class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-tight shadow-md border backdrop-blur-md transition-transform group-hover:scale-110"
          :class="pat.bias === 'bullish'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-500/50 dark:shadow-[0_0_10px_rgba(16,185,129,0.3)]'
            : 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs dark:bg-rose-950/90 dark:text-rose-300 dark:border-rose-500/50 dark:shadow-[0_0_10px_rgba(244,63,94,0.3)]'"
        >
          <span>{{ pat.bias === 'bullish' ? '▲' : '▼' }}</span>
          <span>{{ pat.shortName }}</span>
        </div>

        <!-- Pattern Detail Popover on Click or Hover -->
        <div
          v-if="selectedPattern?.id === pat.id"
          class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2.5 rounded-xl bg-white/95 dark:bg-[#090e17]/95 border border-slate-200 dark:border-[#1e293b] shadow-2xl text-[10.5px] z-50 text-slate-800 dark:text-white space-y-1.5 backdrop-blur-xl animate-fade-in"
          @click.stop
        >
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-1">
            <span class="font-bold text-blue-600 dark:text-cyan-400">{{ pat.name }}</span>
            <span
              class="text-[9px] font-mono px-1 rounded uppercase font-bold"
              :class="pat.bias === 'bullish' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-rose-500/20 text-rose-600 dark:text-rose-300'"
            >
              {{ pat.bias }}
            </span>
          </div>
          <p class="text-slate-600 dark:text-gray-300 text-[10px] leading-tight">{{ pat.desc }}</p>
          <div class="text-[9px] font-mono text-slate-400 dark:text-gray-400 pt-1 flex justify-between">
            <span>Price: {{ pat.price }}</span>
            <span class="text-blue-600 dark:text-cyan-400 font-semibold cursor-pointer" @click="selectedPattern = null">✕ Dismiss</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { detectCandlePatterns } from '../../utils/chartPatterns.js';

const props = defineProps({
  bars: { type: Array, default: () => [] }
});

const showPatterns = ref(true);
const selectedPattern = ref(null);

const detectedPatterns = computed(() => {
  if (!props.bars || props.bars.length === 0) return [];
  return detectCandlePatterns(props.bars);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.15s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, 4px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
</style>
