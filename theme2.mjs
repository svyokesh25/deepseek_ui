import { writeFileSync } from 'fs';

// ═══════════════════════════════════════════════════════════════
// TopToolbar.vue — two top-tickers + search + Timeframe + Indicators
// ═══════════════════════════════════════════════════════════════
writeFileSync('src/components/TopToolbar.vue', `<template>
  <header class="h-[52px] bg-xn-panel border-b border-xn-border flex items-stretch shrink-0 z-30">
    <!-- Left: two top-tickers -->
    <div class="flex border-r border-xn-border">
      <div v-for="t in topTickers" :key="t.symbol"
           class="px-4 py-1.5 cursor-pointer border-r border-xn-border flex flex-col justify-center min-w-[110px]"
           @click="$emit('update:symbol', t.symbol)">
        <span class="text-[11px] text-xn-dim">{{ t.symbol }}</span>
        <span class="text-[13px] font-semibold"
              :class="t.change >= 0 ? 'text-xn-up' : 'text-xn-down'">
          {{ t.last }}
        </span>
      </div>
    </div>

    <!-- Search -->
    <div class="flex items-center gap-2 px-3 border-r border-xn-border flex-1 max-w-[420px]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           class="text-xn-mute shrink-0">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      <input v-model="query" @focus="showResults = true" @blur="onBlur"
             @keydown.esc="showResults = false"
             class="bg-transparent outline-none text-xs w-full placeholder:text-xn-mute"
             placeholder="Search eg: EUR/USD , BTC">
      <div v-if="showResults && filtered.length"
           class="dropdown open w-[280px] top-full left-0 mt-1">
        <div v-for="s in filtered" :key="s.symbol"
             class="dropdown-item flex justify-between"
             @mousedown.prevent="select(s.symbol)">
          <span class="font-medium">{{ s.symbol }}</span>
          <span class="text-xn-mute">{{ s.exchange }}</span>
        </div>
      </div>
    </div>

    <!-- Right: tool buttons -->
    <div class="flex items-center gap-0.5 px-2">
      <button class="xn-icon-btn" title="Add">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>
        </svg>
      </button>

      <button class="xn-btn border-xn-border text-[12px] font-medium px-2 py-1 mx-1">
        15m
      </button>

      <button class="xn-icon-btn" title="Chart type">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 5v4"/><rect width="4" height="6" x="7" y="9" rx="1"/>
          <path d="M9 15v2"/><path d="M17 3v2"/><rect width="4" height="8" x="15" y="5" rx="1"/>
        </svg>
      </button>

      <button class="xn-btn border-xn-border text-[12px] px-2 py-1 mx-1">
        <span class="font-serif italic text-[13px]">fx</span>
        <span class="ml-1">Indicators</span>
      </button>

      <button class="xn-icon-btn" title="Templates">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      </button>

      <button class="xn-icon-btn" title="Alert">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 3a2 2 0 0 0-2 2v1.5C7.6 7.4 6 9.6 6 12v4l-1.5 2h15L18 16v-4c0-2.4-1.6-4.6-4-5.5V5a2 2 0 0 0-2-2z"/>
        </svg>
      </button>

      <button class="xn-icon-btn" title="Camera">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      </button>

      <button class="xn-icon-btn" title="Undo">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 7v6h6M3 13a9 9 0 1 0 3-7.7L3 8"/>
        </svg>
      </button>

      <div class="w-px h-5 bg-xn-border mx-1"></div>

      <button class="xn-btn text-[12px] px-2 py-1">
        <span class="text-xn-text font-medium">Save</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      <button class="xn-icon-btn" title="Settings">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { SYMBOLS } from '../data/marketData.js'

defineProps({ currentTf: String, currentType: String, currentSymbol: String })
const emit = defineEmits(['update:tf', 'update:type', 'update:symbol'])

const topTickers = [
  { symbol: 'EURUSD', last: '$ 1.11770', change: -1 },
  { symbol: 'XAUUSD', last: '$ 4122.86', change: +1 }
]

const query = ref('')
const showResults = ref(false)

const filtered = computed(() => {
  const q = query.value.trim().toUpperCase()
  return Object.keys(SYMBOLS)
    .filter(s => !q || s.includes(q))
    .map(s => ({ symbol: s, exchange: SYMBOLS[s].exchange }))
    .slice(0, 8)
})

function select(sym) { emit('update:symbol', sym); query.value = ''; showResults.value = false }
function onBlur() { setTimeout(() => (showResults.value = false), 120) }
<\/script>
`, 'utf8');

// ═══════════════════════════════════════════════════════════════
// SymbolHeader.vue — symbol · interval · OHLC line
// ═══════════════════════════════════════════════════════════════
writeFileSync('src/components/SymbolHeader.vue', `<template>
  <div class="h-9 bg-xn-panel border-b border-xn-border flex items-center gap-3 px-3 shrink-0">
    <span class="text-[15px] font-semibold text-xn-text">{{ summary.symbol }}</span>
    <span class="text-xn-mute">·</span>
    <span class="text-[13px] text-xn-text">{{ currentTfLabel }}</span>
    <span class="w-2 h-2 rounded-full bg-xn-up ml-1"></span>
    <span class="text-[11px] text-xn-dim flex gap-2.5 ml-1">
      <span>O<span class="text-xn-text ml-1">{{ summary.open }}</span></span>
      <span>H<span class="text-xn-text ml-1">{{ summary.high }}</span></span>
      <span>L<span class="text-xn-text ml-1">{{ summary.low }}</span></span>
      <span>C<span class="text-xn-text ml-1">{{ summary.close }}</span></span>
      <span :class="summary.change >= 0 ? 'text-xn-up' : 'text-xn-down'">
        {{ (summary.change >= 0 ? '+' : '') + summary.change }}
        ({{ (summary.changePct >= 0 ? '+' : '') + summary.changePct }}%)
      </span>
    </span>
    <div class="flex-1"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  summary: { type: Object, required: true },
  currentTf: { type: String, default: '15' }
})
const tfMap = { '1': '1', '5': '5', '15': '15', '60': '60', 'D': '1D' }
const currentTfLabel = computed(() => tfMap[props.currentTf] || '15')
<\/script>
`, 'utf8');

console.log('  ✓ TopToolbar.vue');
console.log('  ✓ SymbolHeader.vue');
console.log('Part 2a done.');