<template>
  <div
    class="bg-white dark:bg-[#090d16] flex flex-col shrink-0 min-h-0 border-r border-[#eef0f4] dark:border-[#162032] select-none relative font-sans transition-colors"
    :style="{ width: width + 'px' }"
  >
    <!-- 1. Search Bar (matching reference screenshot) -->
    <div class="px-3 pt-2 pb-1.5 border-b border-[#f0f2f5] dark:border-[#162032] shrink-0 bg-white dark:bg-[#090d16] transition-colors">
      <div class="flex items-center gap-2 bg-[#f4f6f9] dark:bg-[#070b12] rounded-md px-2.5 py-1.5 border border-transparent
                  focus-within:border-[#0072fd] focus-within:bg-white dark:focus-within:bg-[#070b12] transition-all">
        <svg class="w-3.5 h-3.5 text-[#9aa3b0] shrink-0" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          v-model="query"
          type="text"
          class="bg-transparent outline-none text-[11px] w-full text-[#212529] dark:text-[#d1d4dc] placeholder:text-[#9aa3b0] dark:placeholder:text-[#787b86] font-normal leading-tight"
          placeholder="Search eg: EUR/USD , BTC"
          autocomplete="off"
        />
        <button
          v-if="query"
          type="button"
          class="text-[#9aa3b0] hover:text-[#5d6673] dark:hover:text-white cursor-pointer"
          @click="query = ''"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 2. Segmented Tabs: FAVORITES | ALL SYMBOLS (matching reference screenshot) -->
    <div class="px-3 py-1.5 border-b border-[#f0f2f5] dark:border-[#162032] shrink-0 bg-white dark:bg-[#090d16] transition-colors">
      <div class="flex items-center bg-[#ebedf0] dark:bg-[#0c121e] p-0.5 rounded-lg text-xs">
        <button
          v-for="t in tabs" :key="t.id"
          type="button"
          class="flex-1 py-1 rounded-md text-center transition-all duration-150 cursor-pointer text-[10.5px] font-bold uppercase tracking-wider"
          :class="activeTab === t.id
            ? 'bg-white dark:bg-[#1a2333] text-[#212529] dark:text-white shadow-xs'
            : 'text-[#6c757d] dark:text-[#787b86] hover:text-[#212529] dark:hover:text-white font-semibold'"
          @click="activeTab = t.id"
        >{{ t.label }}</button>
      </div>
    </div>

    <!-- 3. Rows (compact font & height matching reference screenshot) -->
    <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden divide-y divide-[#f0f2f5] dark:divide-[#131b2a]">
      <div
        v-for="row in pageRows" :key="row.symbol"
        class="symbol-row relative h-[38px] px-3 flex items-center justify-between cursor-pointer group select-none transition-colors"
        :class="[
          row.symbol === currentSymbol ? 'bg-[#edf5ff] dark:bg-[#13223f]' : 'hover:bg-[#f8fafc] dark:hover:bg-[#0e1626]',
          flashClass(row.symbol)
        ]"
        @mouseenter="hovered = row.symbol"
        @mouseleave="onRowLeave"
        @focusin="hovered = row.symbol"
        @focusout="onRowBlur"
        @click="$emit('select', row.symbol)"
      >
        <!-- LEFT: Symbol name + Change % + Dual Arrow + Spread -->
        <div class="w-[115px] shrink-0 flex flex-col justify-center min-w-0 pointer-events-none">
          <span class="text-[11.5px] font-bold text-[#212529] dark:text-[#e2e8f0] leading-none truncate tracking-tight uppercase">
            {{ row.symbol }}
          </span>
          <div class="flex items-center gap-1 mt-0.5 text-[9.5px] leading-none">
            <span
              class="font-semibold tabular-nums"
              :class="row.change >= 0 ? 'text-[#0072fd] dark:text-[#38bdf8]' : 'text-[#f23645] dark:text-[#ef5350]'"
            >
              {{ (row.change >= 0 ? '' : '-') + Math.abs(row.change).toFixed(2) }}%
            </span>
            <!-- Dual arrow icon matching reference -->
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
                 :stroke="row.change >= 0 ? '#0072fd' : '#f23645'"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
              <path d="M4 12h16M4 12l3-3M4 12l3 3M20 12l-3-3M20 12l-3 3"/>
            </svg>
            <!-- Spread pill badge matching reference -->
            <span class="bg-[#e9edf2] dark:bg-[#151d2c] px-1 py-[0.5px] rounded text-[9px] text-[#6c757d] dark:text-[#8a94a6] tabular-nums font-medium leading-none">
              {{ row.spread || '2' }}
            </span>
          </div>
        </div>

        <!-- RIGHT: Normal Prices vs Hover Action Dock -->
        <div class="flex-1 flex items-center justify-end h-full">
          <!-- Normal state (2 columns: Bid/Low and Ask/High) -->
          <div
            class="flex items-center gap-2.5 transition-opacity"
            :class="{ 'opacity-0 pointer-events-none': hovered === row.symbol || dockHovered === row.symbol }"
          >
            <!-- Inactive / loading skeleton state (like ALGUSD in reference) -->
            <template v-if="row.isInactive || row.bid == null">
              <div class="flex items-center gap-2">
                <div class="w-[50px] h-[9px] rounded-xs bg-[#e2e6eb] dark:bg-[#151c28]"></div>
                <div class="w-[50px] h-[9px] rounded-xs bg-[#e2e6eb] dark:bg-[#151c28] flex items-center justify-end px-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#ef5350]/60"></span>
                </div>
              </div>
            </template>
            <template v-else>
              <!-- Column 1: Bid + Low -->
              <div class="w-[62px] flex flex-col items-end justify-center">
                <span
                  class="font-semibold text-[11.5px] leading-none tabular-nums"
                  :class="getBidColor(row)"
                >
                  {{ fmt(row.bid, row.symbol) }}
                </span>
                <span class="text-[9px] text-[#8a94a6] dark:text-[#787b86] font-normal leading-none tabular-nums mt-0.5">
                  L: {{ fmt(row.low, row.symbol) }}
                </span>
              </div>

              <!-- Column 2: Ask + High -->
              <div class="w-[62px] flex flex-col items-end justify-center">
                <span
                  class="font-semibold text-[11.5px] leading-none tabular-nums"
                  :class="getAskColor(row)"
                >
                  {{ fmt(row.ask, row.symbol) }}
                </span>
                <span class="text-[9px] text-[#8a94a6] dark:text-[#787b86] font-normal leading-none tabular-nums mt-0.5">
                  H: {{ fmt(row.high, row.symbol) }}
                </span>
              </div>
            </template>
          </div>

          <!-- Hover state dock: [Trash] [B] [S] [Chart] [...] matching reference screenshot -->
          <div
            class="action-dock absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1"
            :class="{ 'is-visible': hovered === row.symbol || dockHovered === row.symbol }"
            @mouseenter="dockHovered = row.symbol"
            @mouseleave="dockHovered = null"
            @click.stop
          >
            <!-- 1. Remove / Trash (white button with dark trash icon) -->
            <button
              type="button"
              class="w-[25px] h-[25px] rounded-[3px] bg-white text-[#212529] hover:bg-gray-100 dark:bg-white dark:text-[#212529]
                     flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-sm"
              title="Remove from favorites"
              @click.stop="promptDelete(row.symbol)"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>

            <!-- 2. Quick BUY [B] button (#0072fd) -->
            <button
              type="button"
              class="w-[25px] h-[25px] rounded-[3px] bg-[#0072fd] hover:bg-[#005cd0] text-white font-bold text-[11px]
                     flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-sm"
              title="Quick Buy"
              @click.stop.prevent="quickOrder(row, 'BUY')"
            >
              B
            </button>

            <!-- 3. Quick SELL [S] button (#ff5722) -->
            <button
              type="button"
              class="w-[25px] h-[25px] rounded-[3px] bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold text-[11px]
                     flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-sm"
              title="Quick Sell"
              @click.stop.prevent="quickOrder(row, 'SELL')"
            >
              S
            </button>

            <!-- 4. Open Chart icon (deep slate/blue #3b5998 with white zigzag chart) -->
            <button
              type="button"
              class="w-[25px] h-[25px] rounded-[3px] bg-[#3b5998] hover:bg-[#2d4373] text-white
                     flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-sm"
              title="Open chart"
              @click="$emit('select', row.symbol)"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </button>

            <!-- 5. More options [...] (white button with 3 dots) -->
            <div class="relative">
              <button
                type="button"
                class="w-[25px] h-[25px] rounded-[3px] bg-white text-[#212529] hover:bg-gray-100 dark:bg-white dark:text-[#212529]
                       flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-sm"
                title="More options"
                @click.stop="toggleMore(row.symbol)"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="18" cy="12" r="1.5" />
                  <circle cx="6" cy="12" r="1.5" />
                </svg>
              </button>
              <div
                v-if="moreOpen === row.symbol"
                class="absolute right-0 top-[30px] z-30 bg-white dark:bg-[#0d1322] border border-[#e3e6eb] dark:border-[#162032]
                       rounded-md shadow-lg min-w-[150px] py-1 text-xs"
              >
                <button class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#142340] dark:text-[#d1d4dc] cursor-pointer" @click="addToFav(row.symbol, 1)">Add to Fav 1</button>
                <button class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#142340] dark:text-[#d1d4dc] cursor-pointer" @click="addToFav(row.symbol, 2)">Add to Fav 2</button>
                <button class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#142340] dark:text-[#d1d4dc] cursor-pointer" @click="copySymbol(row.symbol)">Copy symbol</button>
              </div>
            </div>
          </div>

          <!-- Inline delete confirmation overlay -->
          <div
            v-if="pendingDelete === row.symbol"
            class="absolute inset-0 z-30 flex items-center justify-between px-3 text-[11px] font-semibold bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-xs border border-red-300 dark:border-red-900/50"
            @click.stop
          >
            <span class="text-red-500 font-medium">Remove {{ row.symbol }}?</span>
            <div class="flex items-center gap-1.5">
              <button
                type="button"
                class="px-2 py-0.5 rounded text-[10.5px] bg-gray-100 dark:bg-[#142340] text-gray-700 dark:text-[#d1d4dc] hover:bg-gray-200 dark:hover:bg-[#1a2f55] transition-colors cursor-pointer"
                @click.stop="pendingDelete = null"
              >Cancel</button>
              <button
                type="button"
                class="px-2 py-0.5 rounded text-[10.5px] font-bold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer shadow-xs active:scale-95"
                @click.stop="confirmDelete(row.symbol)"
              >Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="pageRows.length === 0" class="text-center text-[#9aa3b0] text-xs py-10">
        No symbols match "{{ query }}"
      </div>
    </div>

    <!-- 4. Bottom Pager: 1  2  3  4  5 with gold active underline matching reference screenshot -->
    <section class="border-t border-[#f0f2f5] dark:border-[#162032] py-2 shrink-0 bg-white dark:bg-[#090d16] flex items-center justify-center transition-colors">
      <ul class="flex items-center gap-6 text-[11px] font-medium m-0 p-0 list-none">
        <li
          v-for="n in totalPages" :key="n"
          class="cursor-pointer transition-colors px-1 pb-0.5"
          :class="n === page
            ? 'text-[#f5bf23] font-bold border-b-2 border-[#f5bf23]'
            : 'text-[#6c757d] dark:text-[#787b86] hover:text-[#212529] dark:hover:text-white font-normal'"
          @click="page = n"
        >{{ n }}</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, shallowRef, watch } from 'vue';
import { SYMBOLS, WATCHLIST } from '../data/marketData.js';
import { usePositions } from '../stores/positions.js';

const props = defineProps({
  rows:          { type: Array,  default: () => WATCHLIST.map(r => ({ ...r })) },
  currentSymbol: { type: String, default: '' },
  width:         { type: Number, default: 260 }
});
const emit = defineEmits(['select', 'remove-symbol', 'add-symbol']);

const { openPosition } = usePositions();

// Local reactive copy synced with props.rows
const localRows = ref((props.rows || WATCHLIST).map(r => ({ ...r })));

watch(() => props.rows, (newRows) => {
  if (newRows && newRows.length) {
    localRows.value = newRows.map(r => ({ ...r }));
  }
}, { deep: true });

// Flash animation tracking on price updates
const flashMap = shallowRef({});
function triggerFlash(symbol, dir) {
  flashMap.value = { ...flashMap.value, [symbol]: dir };
  setTimeout(() => {
    if (flashMap.value[symbol] === dir) {
      const next = { ...flashMap.value };
      delete next[symbol];
      flashMap.value = next;
    }
  }, 400);
}

function flashClass(symbol) {
  const f = flashMap.value[symbol];
  if (!f) return '';
  return f > 0 ? 'xn-flash-up' : 'xn-flash-down';
}

watch(() => localRows.value.map(r => ({ symbol: r.symbol, bid: r.bid })), (next, prev) => {
  if (!prev) return;
  next.forEach((cur, i) => {
    const p = prev[i];
    if (!p || p.symbol !== cur.symbol) return;
    if (cur.bid !== p.bid) {
      triggerFlash(cur.symbol, Number(cur.bid) >= Number(p.bid) ? 1 : -1);
    }
  });
}, { deep: true });

// Tabs matching screenshot 2
const tabs = [
  { id: 'favorites', label: 'FAVORITES' },
  { id: 'all',       label: 'ALL SYMBOLS' }
];
const activeTab = ref('favorites');
const query     = ref('');
const page      = ref(1);
const perPage   = 10;
const moreOpen  = ref(null);

const hovered       = ref(null);
const dockHovered   = ref(null);
const pendingDelete = ref(null);

function onRowLeave() {
  if (dockHovered.value) return;
  hovered.value = null;
}

function onRowBlur(e) {
  if (e.currentTarget.contains(e.relatedTarget)) return;
  hovered.value = null;
}

watch([query, activeTab], () => {
  page.value = 1;
});

// Close more menu on outside click
if (typeof window !== 'undefined') {
  window.addEventListener('click', () => {
    moreOpen.value = null;
  });
}

const allSymbolsList = computed(() => {
  return Object.keys(SYMBOLS).map(sym => {
    const meta = SYMBOLS[sym] || {};
    const existing = localRows.value.find(r => r.symbol === sym);
    if (existing) return existing;
    const base = meta.base || 100;
    const digits = meta.digits ?? 2;
    return {
      symbol: sym,
      bid: base.toFixed(digits),
      bidColor: 'blue',
      ask: (base * 1.0002).toFixed(digits),
      askColor: 'red',
      change: 0.15,
      low: (base * 0.985).toFixed(digits),
      high: (base * 1.015).toFixed(digits),
      spread: '2'
    };
  });
});

const filtered = computed(() => {
  const q = query.value.trim().toUpperCase();
  const source = activeTab.value === 'all' ? allSymbolsList.value : localRows.value;
  return source.filter(r => !q || r.symbol.toUpperCase().includes(q));
});

const totalPages = computed(() => Math.max(5, Math.ceil(filtered.value.length / perPage)));

const pageRows = computed(() => {
  const start = (page.value - 1) * perPage;
  return filtered.value.slice(start, start + perPage);
});

function fmt(v, sym) {
  if (v == null) return '—';
  const digits = sym && SYMBOLS[sym] ? SYMBOLS[sym].digits : 2;
  const n = Number(v);
  return isNaN(n) ? String(v) : n.toFixed(digits);
}

function getBidColor(row) {
  if (row.bidColor === 'blue') return 'text-[#0072fd] dark:text-[#38bdf8]';
  if (row.bidColor === 'red') return 'text-[#f23645] dark:text-[#ef5350]';
  return row.change >= 0 ? 'text-[#0072fd] dark:text-[#38bdf8]' : 'text-[#f23645] dark:text-[#ef5350]';
}

function getAskColor(row) {
  if (row.askColor === 'blue') return 'text-[#0072fd] dark:text-[#38bdf8]';
  if (row.askColor === 'red') return 'text-[#f23645] dark:text-[#ef5350]';
  return row.change >= 0 ? 'text-[#0072fd] dark:text-[#38bdf8]' : 'text-[#f23645] dark:text-[#ef5350]';
}

function promptDelete(sym) {
  pendingDelete.value = sym;
}

function confirmDelete(symbol) {
  localRows.value = localRows.value.filter(r => r.symbol !== symbol);
  emit('remove-symbol', symbol);
  pendingDelete.value = null;
  moreOpen.value = null;
}

function toggleMore(symbol) {
  moreOpen.value = moreOpen.value === symbol ? null : symbol;
}

function addToFav(symbol, section) {
  moreOpen.value = null;
  console.log('[xn] add to favorites section', section, ':', symbol);
}

function copySymbol(symbol) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(symbol).catch(() => {});
  }
  moreOpen.value = null;
}

// Quick order buttons (only triggers openPosition; openPosition handles notification)
let isOrdering = false;
function quickOrder(row, side) {
  if (isOrdering) return;
  isOrdering = true;
  setTimeout(() => { isOrdering = false; }, 400);

  const meta = SYMBOLS[row.symbol] || SYMBOLS.XAUUSD || { digits: 2 };
  const digits = meta.digits ?? 2;
  const price = side === 'BUY' ? Number(row.ask) : Number(row.bid);

  openPosition({
    symbol: row.symbol,
    side,
    lot: 0.01,
    price,
    digits
  });

  emit('select', row.symbol);
}
</script>

<style scoped>
/* ── Hover action dock ─────────────────────────────────────── */
.action-dock {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%) translateX(2px);
  transition: opacity 120ms ease, transform 120ms ease;
}

.action-dock.is-visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(-50%) translateX(0);
}

.symbol-row {
  height: 38px;
  min-height: 38px;
  max-height: 38px;
}

/* Flash animation */
.xn-flash-up {
  animation: xn-flash-up-anim 0.38s ease;
}
.xn-flash-down {
  animation: xn-flash-down-anim 0.38s ease;
}

@keyframes xn-flash-up-anim {
  0% { background-color: rgba(8, 153, 129, 0.22); }
  100% { background-color: transparent; }
}

@keyframes xn-flash-down-anim {
  0% { background-color: rgba(242, 54, 69, 0.22); }
  100% { background-color: transparent; }
}
</style>
