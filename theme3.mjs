import { writeFileSync } from 'fs';

// ═══════════════════════════════════════════════════════════════
// LeftToolbar.vue — thin icon rail
// ═══════════════════════════════════════════════════════════════
writeFileSync('src/components/LeftToolbar.vue', `<template>
  <div class="w-11 bg-xn-panel border-r border-xn-border flex flex-col items-center py-2 gap-0.5 shrink-0">
    <div class="xn-tool" :class="{ active: active === 'cursor' }" @click="active = 'cursor'" title="Cursor">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'trend' }" @click="active = 'trend'" title="Trend line">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20 20 4"/><circle cx="4" cy="20" r="1.5"/><circle cx="20" cy="4" r="1.5"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'h-line' }" @click="active = 'h-line'" title="Horizontal line">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 12h18"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'rect' }" @click="active = 'rect'" title="Rectangle">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="5" width="16" height="14" rx="1"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'brush' }" @click="active = 'brush'" title="Brush">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20c2-2 4-3 4-6 0-2 2-4 4-4"/><path d="m14 4 6 6-9 9H5v-6z"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'text' }" @click="active = 'text'" title="Text">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 7V5h14v2M12 5v14M9 19h6"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'fib' }" @click="active = 'fib'" title="Fibonacci">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5h16M4 10h16M4 15h16M4 20h16"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'measure' }" @click="active = 'measure'" title="Measure">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 9 9 3l12 12-6 6z"/><path d="m7 7 2 2M10 4l2 2M13 7l2 2M16 10l2 2"/></svg>
    </div>
    <div class="flex-1"></div>
    <div class="xn-tool" :class="{ active: active === 'smile' }" @click="active = 'smile'" title="Notes">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'zoom-in' }" @click="active = 'zoom-in'" title="Zoom in">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'trash' }" @click="active = 'trash'" title="Clear">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const active = ref('cursor')
<\/script>
`, 'utf8');

// ═══════════════════════════════════════════════════════════════
// ChartPanel.vue
// ═══════════════════════════════════════════════════════════════
writeFileSync('src/components/ChartPanel.vue', `<template>
  <div ref="containerRef" class="w-full h-full bg-xn-bg"></div>
</template>

<script setup>
import { ref, toRef } from 'vue'
import { useChart } from '../composables/useChart.js'

const props = defineProps({
  bars: { type: Array, required: true },
  chartType: { type: String, default: 'candles' }
})

const containerRef = ref(null)
useChart(containerRef, toRef(props, 'bars'), toRef(props, 'chartType'))
<\/script>
`, 'utf8');

// ═══════════════════════════════════════════════════════════════
// Watchlist.vue — FAVORITES / ALL SYMBOLS tabs + BID / ASK rows
// ═══════════════════════════════════════════════════════════════
writeFileSync('src/components/Watchlist.vue', `<template>
  <div class="bg-xn-panel flex flex-col shrink-0 min-h-0 border-r border-xn-border"
       :style="{ width: width + 'px' }">

    <!-- Search -->
    <div class="px-3 py-2 border-b border-xn-border shrink-0">
      <div class="flex items-center gap-2 bg-xn-panel2 rounded px-2 py-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             class="text-xn-mute shrink-0">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input v-model="query" class="bg-transparent outline-none text-xs w-full placeholder:text-xn-mute"
               placeholder="Search eg: EUR/USD , BTC">
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-xn-border shrink-0">
      <div v-for="t in tabs" :key="t"
           @click="activeTab = t"
           class="flex-1 text-center text-[11px] font-semibold py-2.5 cursor-pointer transition-colors"
           :class="activeTab === t
             ? 'text-xn-text border-b-2 border-xn-accent'
             : 'text-xn-mute'">
        {{ t }}
      </div>
    </div>

    <!-- Column header -->
    <div class="grid px-3 py-1.5 text-[10px] text-xn-mute uppercase tracking-wide border-b border-xn-border shrink-0"
         style="grid-template-columns: 1fr 1fr 1fr">
      <span>Symbol</span>
      <span class="text-right">Bid</span>
      <span class="text-right">Ask</span>
    </div>

    <!-- Rows -->
    <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
      <div v-for="row in filteredRows" :key="row.symbol"
           class="grid px-3 py-2 cursor-pointer border-b border-xn-border hover:bg-xn-hover transition-colors"
           :class="{ 'bg-xn-active': row.symbol === currentSymbol }"
           style="grid-template-columns: 1fr 1fr 1fr"
           @click="$emit('select', row.symbol)">
        <div class="flex flex-col">
          <span class="text-[12px] font-semibold text-xn-text">{{ row.symbol }}</span>
          <span class="text-[10px] flex items-center gap-1"
                :class="row.change >= 0 ? 'text-xn-up' : 'text-xn-down'">
            {{ (row.change >= 0 ? '+' : '') + row.change.toFixed(2) }}%
            <svg v-if="row.change >= 0" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="m6 15 6-6 6 6"/>
            </svg>
            <svg v-else width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="m6 9 6 6 6-6"/>
            </svg>
            <span class="text-xn-mute">{{ row.spread }}</span>
          </span>
        </div>
        <div class="flex flex-col items-end justify-center">
          <span class="text-[12px] font-semibold"
                :class="row.change >= 0 ? 'text-xn-up' : 'text-xn-down'">{{ row.bid }}</span>
          <span class="text-[10px] text-xn-mute">L: {{ row.low }}</span>
        </div>
        <div class="flex flex-col items-end justify-center">
          <span class="text-[12px] font-semibold"
                :class="row.change >= 0 ? 'text-xn-up' : 'text-xn-down'">{{ row.ask }}</span>
          <span class="text-[10px] text-xn-mute">H: {{ row.high }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom pager -->
    <div class="flex items-center justify-center gap-3 text-[11px] text-xn-mute py-2 border-t border-xn-border shrink-0">
      <span v-for="n in 5" :key="n"
            class="w-6 h-6 flex items-center justify-center rounded hover:bg-xn-hover cursor-pointer"
            :class="{ 'text-xn-text font-semibold': n === 1 }">
        {{ n }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  rows: { type: Array, required: true },
  currentSymbol: String,
  width: { type: Number, default: 260 }
})
defineEmits(['select'])

const tabs = ['FAVORITES', 'ALL SYMBOLS']
const activeTab = ref('FAVORITES')
const query = ref('')

const filteredRows = computed(() => {
  const q = query.value.trim().toUpperCase()
  return props.rows.filter(r => !q || r.symbol.includes(q))
})
<\/script>
`, 'utf8');

console.log('  ✓ LeftToolbar.vue');
console.log('  ✓ ChartPanel.vue');
console.log('  ✓ Watchlist.vue');
console.log('theme3.mjs complete.');