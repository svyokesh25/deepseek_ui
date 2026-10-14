<template>
  <div class="w-full h-full relative overflow-hidden bg-white dark:bg-[#0a0e17] select-none transition-colors">
    <!-- 1. Native XtremeNext Chart (Lightweight Candlestick Chart) -->
    <div
      v-show="engine === 'xtremenext'"
      ref="containerRef"
      class="w-full h-full"
    ></div>

    <!-- Faded Symbol Watermark Behind Candles -->
    <div
      v-if="engine === 'xtremenext'"
      class="absolute inset-0 pointer-events-none flex items-start justify-end pr-16 pt-4 select-none"
    >
      <span class="text-[48px] font-black tracking-tight text-[#1a1d24] dark:text-white opacity-[0.04] uppercase font-sans">
        {{ symbol }}
      </span>
    </div>

    <!-- Floating Top-Left Overlay: Symbol Legend + Compact Buy/Sell Widget -->
    <div
      v-if="engine === 'xtremenext' && showLegend"
      class="absolute top-2 left-3 z-10 flex flex-col gap-1.5 pointer-events-none select-none font-sans"
    >
      <!-- Row 1: Symbol Legend Pill -->
      <div class="flex items-center gap-2 text-xs bg-white/90 dark:bg-[#0d1322]/90 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs border border-[#e3e6eb] dark:border-[#162032] pointer-events-auto transition-colors">
        <div class="flex items-center gap-1 font-semibold text-[#1a1d24] dark:text-white">
          <span>{{ symbol }}</span>
          <span class="text-[#9aa3b0] dark:text-[#5d6673]">·</span>
          <span class="text-[#5d6673] dark:text-[#a0a5b0]">{{ timeframeLabel }}</span>
          <button
            type="button"
            class="p-0.5 text-[#8a94a6] hover:text-[#1a1d24] dark:hover:text-white cursor-pointer ml-0.5 transition-colors"
            title="Toggle Indicator / Drawing Visibility"
            @click="toggleVisibility"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        <div class="flex items-center gap-2 text-[11px] tabular-nums font-mono text-[#5d6673] dark:text-[#a0a5b0]">
          <span>O <b class="font-normal text-[#1a1d24] dark:text-[#e2e8f0]">{{ activeBar.open }}</b></span>
          <span>H <b class="font-normal text-[#1a1d24] dark:text-[#e2e8f0]">{{ activeBar.high }}</b></span>
          <span>L <b class="font-normal text-[#1a1d24] dark:text-[#e2e8f0]">{{ activeBar.low }}</b></span>
          <span>C <b class="font-normal text-[#1a1d24] dark:text-[#e2e8f0]">{{ activeBar.close }}</b></span>
          <span :class="activeBarChange >= 0 ? 'text-[#0072fd] dark:text-[#26a69a]' : 'text-[#f23645] dark:text-[#ef5350]'">
            {{ (activeBarChange >= 0 ? '+' : '') + activeBarChange.toFixed(digits) }}
            ({{ (activeBarChangePct >= 0 ? '+' : '') + activeBarChangePct.toFixed(2) }}%)
          </span>
        </div>
      </div>

      <!-- Row 2: Floating Compact BUY | Lot | SELL Widget -->
      <div class="flex items-center shadow-xs rounded-md border border-[#d2d6dc] dark:border-[#162032] bg-white dark:bg-[#0d1322] overflow-hidden pointer-events-auto h-[26px] w-fit transition-colors">
        <!-- BUY Button -->
        <button
          type="button"
          class="bg-[#0072fd] hover:bg-[#005cd0] active:scale-95 text-white text-[11px] font-bold px-3 h-full flex items-center justify-center transition-all cursor-pointer select-none"
          title="Place Instant BUY Order"
          @click.stop.prevent="$emit('buy', lot)"
        >
          BUY
        </button>

        <!-- Lot input & stepper -->
        <div class="flex items-center bg-white dark:bg-[#0a0e17] px-1 h-full border-x border-[#e3e6eb] dark:border-[#162032]">
          <button
            type="button"
            class="w-4 h-full flex items-center justify-center text-gray-400 hover:text-gray-800 dark:hover:text-white text-xs font-bold cursor-pointer transition-colors active:scale-90"
            @click="decrementLot"
          >−</button>
          <input
            v-model.number="lot"
            type="number"
            step="0.01"
            min="0.01"
            class="w-[42px] text-center text-[11px] font-semibold text-gray-800 dark:text-gray-100 bg-transparent outline-none tabular-nums"
          />
          <button
            type="button"
            class="w-4 h-full flex items-center justify-center text-gray-400 hover:text-gray-800 dark:hover:text-white text-xs font-bold cursor-pointer transition-colors active:scale-90"
            @click="incrementLot"
          >+</button>
        </div>

        <!-- SELL Button -->
        <button
          type="button"
          class="bg-[#ff5722] hover:bg-[#e64a19] active:scale-95 text-white text-[11px] font-bold px-3 h-full flex items-center justify-center transition-all cursor-pointer select-none"
          title="Place Instant SELL Order"
          @click.stop.prevent="$emit('sell', lot)"
        >
          SELL
        </button>
      </div>
    </div>

    <!-- 2. BlackTrader Chart (Mounted via v-if so canvas & scripts initialize with full desktop dimensions) -->
    <div
      v-if="engine === 'blacktrader'"
      class="w-full h-full relative bg-white dark:bg-[#080b11]"
    >
      <iframe
        :key="btKey"
        ref="blackTraderFrame"
        :src="blackTraderUrl"
        class="w-full h-full border-0 bg-white dark:bg-[#080b11]"
        allow="clipboard-read; clipboard-write; fullscreen; accelerometer; gyroscope; encrypted-media; autoplay"
        loading="eager"
        title="BlackTrader Chart"
      ></iframe>

      <!-- Discreet fail-safe & reload action pill in top-right corner -->
      <div class="absolute top-2 right-2 z-20 flex items-center gap-2 bg-white/95 dark:bg-[#0d1322]/95 backdrop-blur-sm px-2.5 py-1 rounded-md border border-[#e3e6eb] dark:border-[#162032] shadow-xs text-[11px] select-none text-[#5d6673] dark:text-[#a0a5b0]">
        <button
          type="button"
          class="flex items-center gap-1 hover:text-[#0072fd] dark:hover:text-white font-medium cursor-pointer transition-colors"
          title="Reload BlackTrader Chart"
          @click="reloadBlackTrader"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
          <span>Reload</span>
        </button>
        <span class="text-[#d1d5db] dark:text-[#162032]">|</span>
        <a
          :href="blackTraderUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 hover:text-[#0072fd] dark:hover:text-white font-medium cursor-pointer transition-colors"
          title="Open BlackTrader in direct browser tab"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span>Direct Tab</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRef, watch, nextTick } from 'vue';
import { useChart } from '../composables/useChart.js';
import { SYMBOLS } from '../data/marketData.js';

const props = defineProps({
  engine:    { type: String, default: 'xtremenext' }, // 'xtremenext' | 'blacktrader'
  symbol:    { type: String, default: 'AUDCAD' },
  timeframe: { type: String, default: '15' },
  bars:      { type: Array,  default: () => [] },
  chartType: { type: String, default: 'candles' },
  summary:   { type: Object, default: () => ({ open: '1.00', high: '1.00', low: '1.00', close: '1.00', change: 0, changePct: 0 }) }
});

const emit = defineEmits(['buy', 'sell']);

const containerRef = ref(null);
const blackTraderFrame = ref(null);
const btKey = ref(1);

const lot = ref(0.01);
function incrementLot() { lot.value = +(lot.value + 0.01).toFixed(2); }
function decrementLot() { if (lot.value > 0.01) lot.value = +(lot.value - 0.01).toFixed(2); }

const showLegend = ref(true);
function toggleVisibility() {
  showLegend.value = !showLegend.value;
}

const tfLabels = {
  '1': '1m', '5': '5m', '15': '15m', '30': '30m',
  '60': '1h', '120': '2h', '240': '4h',
  'D': '1D', 'W': '1W', 'M': '1M'
};
const timeframeLabel = computed(() => tfLabels[props.timeframe] || `${props.timeframe}m`);
const digits = computed(() => (SYMBOLS[props.symbol]?.digits) ?? 2);

const blackTraderUrl = 'https://chart.blacktrader.com/#chart_MiD2b';

function reloadBlackTrader() {
  btKey.value += 1;
}

// Mount native lightweight chart for XtremeNext with crosshair support
const { hoveredBar } = useChart(containerRef, toRef(props, 'bars'), toRef(props, 'chartType'));

const activeBar = computed(() => {
  if (hoveredBar.value) {
    const dg = digits.value;
    return {
      open:  Number(hoveredBar.value.open).toFixed(dg),
      high:  Number(hoveredBar.value.high).toFixed(dg),
      low:   Number(hoveredBar.value.low).toFixed(dg),
      close: Number(hoveredBar.value.close).toFixed(dg)
    };
  }
  return {
    open:  props.summary.open,
    high:  props.summary.high,
    low:   props.summary.low,
    close: props.summary.close
  };
});

const activeBarChange = computed(() => {
  const o = Number(activeBar.value.open) || 0;
  const c = Number(activeBar.value.close) || 0;
  return c - o;
});

const activeBarChangePct = computed(() => {
  const o = Number(activeBar.value.open) || 0;
  if (!o) return 0;
  return (activeBarChange.value / o) * 100;
});

// Trigger resize pass when switching back to XtremeNext
watch(() => props.engine, (eng) => {
  if (eng === 'xtremenext') {
    nextTick(() => {
      window.dispatchEvent(new Event('resize'));
    });
  } else if (eng === 'blacktrader') {
    btKey.value += 1;
  }
});

defineExpose({
  toggleLegend: () => { showLegend.value = !showLegend.value; },
  getLot: () => lot.value
});
</script>
