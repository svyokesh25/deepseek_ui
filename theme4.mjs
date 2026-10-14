import { writeFileSync } from 'fs';

// ═══════════════════════════════════════════════════════════════
// BottomPanel.vue — Positions / Pending / History / Cancelled tabs
// ═══════════════════════════════════════════════════════════════
writeFileSync('src/components/BottomPanel.vue', `<template>
  <div class="bg-xn-panel flex flex-col shrink-0 min-h-0 border-t border-xn-border"
       :style="{ height: height + 'px' }">
    <div class="flex items-center border-b border-xn-border shrink-0 overflow-x-auto">
      <div v-for="t in tabs" :key="t.id"
           class="xn-tab" :class="{ active: active === t.id }"
           @click="active = t.id">
        {{ t.label }}<span class="text-xn-mute"> ({{ t.count }})</span>
      </div>
      <div class="flex-1"></div>
      <div class="xn-icon-btn" @click="$emit('toggle-collapse')" title="Collapse">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
      <div class="xn-icon-btn" title="More">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
        </svg>
      </div>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
      <div v-show="active === 'positions'">
        <table class="xn-table">
          <thead>
            <tr>
              <th>ID</th><th>Time</th><th>Symbol</th><th>Order</th><th>Lot</th>
              <th>Price</th><th>Partial</th><th>SL</th><th>TP</th><th>SWAP</th>
              <th>LTP</th><th>PROFIT</th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="positions.length === 0">
              <td colspan="13" class="text-center text-xn-mute py-6">No Position(s) Found</td>
            </tr>
            <tr v-for="p in positions" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.time }}</td>
              <td class="text-xn-text font-medium">{{ p.symbol }}</td>
              <td><span class="xn-badge" :class="p.side === 'BUY' ? 'buy' : 'sell'">{{ p.side }}</span></td>
              <td>{{ p.lot }}</td>
              <td>{{ p.entry }}</td>
              <td>--</td>
              <td>{{ p.sl }}</td>
              <td>{{ p.tp }}</td>
              <td>0.00</td>
              <td>{{ p.ltp }}</td>
              <td :class="p.pl >= 0 ? 'text-xn-up' : 'text-xn-down'">
                {{ (p.pl >= 0 ? '+' : '') + p.pl.toFixed(2) }}
              </td>
              <td class="text-xn-down cursor-pointer">&#x2715;</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-show="active === 'pending'">
        <table class="xn-table">
          <thead>
            <tr>
              <th>ID</th><th>Time</th><th>Symbol</th><th>Order</th><th>Lot</th>
              <th>Trigger</th><th>SL</th><th>TP</th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="orders.length === 0">
              <td colspan="9" class="text-center text-xn-mute py-6">No Order(s) Found</td>
            </tr>
            <tr v-for="o in orders" :key="o.id">
              <td>{{ o.id }}</td>
              <td>{{ o.time }}</td>
              <td class="text-xn-text font-medium">{{ o.symbol }}</td>
              <td><span class="xn-badge" :class="o.side === 'BUY' ? 'buy' : 'sell'">{{ o.side }}</span></td>
              <td>{{ o.lot }}</td>
              <td>{{ o.trigger }}</td>
              <td>{{ o.sl }}</td>
              <td>{{ o.tp }}</td>
              <td class="text-xn-down cursor-pointer">&#x2715;</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-show="active === 'history'">
        <table class="xn-table">
          <thead>
            <tr>
              <th>ID</th><th>Close Time</th><th>Symbol</th><th>Order</th><th>Lot</th>
              <th>Entry</th><th>Exit</th><th>P/L</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="h in history" :key="h.id">
              <td>{{ h.id }}</td>
              <td>{{ h.closeTime }}</td>
              <td class="text-xn-text font-medium">{{ h.symbol }}</td>
              <td><span class="xn-badge" :class="h.side === 'BUY' ? 'buy' : 'sell'">{{ h.side }}</span></td>
              <td>{{ h.lot }}</td>
              <td>{{ h.entry }}</td>
              <td>{{ h.exit }}</td>
              <td :class="h.pl >= 0 ? 'text-xn-up' : 'text-xn-down'">
                {{ (h.pl >= 0 ? '+' : '') + h.pl.toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-show="active === 'cancelled'">
        <table class="xn-table">
          <thead><tr><th>ID</th><th>Time</th><th>Symbol</th><th>Status</th></tr></thead>
          <tbody><tr><td colspan="4" class="text-center text-xn-mute py-6">No Cancelled Order(s) Found</td></tr></tbody>
        </table>
      </div>
    </div>

    <!-- Account stats bar -->
    <div class="border-t border-xn-border px-3 py-1.5 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-xn-dim shrink-0">
      <span>Balance : <b class="text-xn-accent font-semibold">9,981.07</b></span>
      <span>Equity : <b class="text-xn-accent font-semibold">9,981.07</b></span>
      <span>Used Margin : <b class="text-xn-accent font-semibold">0.00</b></span>
      <span>Free Margin : <b class="text-xn-accent font-semibold">9,981.07</b></span>
      <span>Margin Level : <b class="text-xn-accent font-semibold">0.00%</b></span>
      <span class="flex-1"></span>
      <span>0.00</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({ height: { type: Number, default: 200 } })
defineEmits(['toggle-collapse'])

const active = ref('positions')
const positions = ref([])
const orders = ref([])
const history = ref([
  { id: 10230, closeTime: '07:45:12', symbol: 'GBPUSD', side: 'BUY',  lot: 0.10, entry: 1.31950, exit: 1.32010, pl: +6.00 },
  { id: 10224, closeTime: '06:12:03', symbol: 'XAUUSD', side: 'SELL', lot: 0.05, entry: 4145.20, exit: 4138.90, pl: +31.50 }
])
const tabs = computed(() => ([
  { id: 'positions', label: 'Positions', count: positions.value.length },
  { id: 'pending',   label: 'Pending',   count: orders.value.length },
  { id: 'history',   label: 'History 24H', count: history.value.length },
  { id: 'cancelled', label: 'Cancelled 24H', count: 0 }
]))
<\/script>
`, 'utf8');

// ═══════════════════════════════════════════════════════════════
// App.vue — 3-column layout with left rail, center, right watchlist
// ═══════════════════════════════════════════════════════════════
writeFileSync('src/App.vue', `<template>
  <div class="h-screen flex flex-col overflow-hidden bg-xn-bg">
    <TopToolbar
      :current-tf="timeframe"
      :current-type="chartType"
      :current-symbol="symbol"
      @update:tf="tf => timeframe = tf"
      @update:type="t => chartType = t"
      @update:symbol="selectSymbol"
    />

    <div class="flex-1 flex min-h-0 overflow-hidden">
      <!-- LEFT: watchlist -->
      <Watchlist
        :rows="watchlist"
        :current-symbol="symbol"
        :width="watchWidth"
        @select="selectSymbol"
      />

      <div class="resizer-v" @mousedown="startDragLeft"></div>

      <!-- CENTER: left tool rail + chart + bottom panel -->
      <div class="flex-1 flex min-w-0 min-h-0">
        <LeftToolbar />

        <div class="flex-1 flex flex-col min-w-0 min-h-0">
          <SymbolHeader :summary="summary" :current-tf="timeframe" />
          <div class="flex-1 relative min-h-0 bg-xn-bg">
            <ChartPanel :bars="bars" :chart-type="chartType" />
          </div>
          <div class="resizer-h" @mousedown="startDragBottom"></div>
          <BottomPanel :height="bottomHeight" @toggle-collapse="toggleBottom" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import TopToolbar from './components/TopToolbar.vue'
import SymbolHeader from './components/SymbolHeader.vue'
import LeftToolbar from './components/LeftToolbar.vue'
import ChartPanel from './components/ChartPanel.vue'
import Watchlist from './components/Watchlist.vue'
import BottomPanel from './components/BottomPanel.vue'
import { generateBars, getSymbolSummary, WATCHLIST } from './data/marketData.js'

const symbol = ref('AUDCAD')
const timeframe = ref('15')
const chartType = ref('candles')
const bottomHeight = ref(200)
const bottomCollapsed = ref(false)
const prevBottomHeight = ref(200)
const watchWidth = ref(260)

const bars = ref(generateBars(symbol.value, timeframe.value))
const summary = computed(() => getSymbolSummary(symbol.value, timeframe.value))
const watchlist = ref(WATCHLIST.map(r => ({ ...r })))

watch([symbol, timeframe], () => {
  bars.value = generateBars(symbol.value, timeframe.value)
})

watch(summary, (s) => {
  const row = watchlist.value.find(r => r.symbol === s.symbol)
  if (row) row.last = s.close
}, { immediate: true })

function selectSymbol(sym) {
  if (sym && sym !== symbol.value) symbol.value = sym
}

function toggleBottom() {
  bottomCollapsed.value = !bottomCollapsed.value
  if (bottomCollapsed.value) {
    prevBottomHeight.value = bottomHeight.value
    bottomHeight.value = 40
  } else {
    bottomHeight.value = prevBottomHeight.value || 200
  }
}

function startDragBottom(e) {
  e.preventDefault()
  const startY = e.clientY
  const startH = bottomHeight.value
  const onMove = (ev) => {
    const delta = startY - ev.clientY
    bottomHeight.value = Math.min(Math.max(startH + delta, 80), window.innerHeight - 250)
  }
  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.body.style.cursor = ''
  }
  document.body.style.cursor = 'row-resize'
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function startDragLeft(e) {
  e.preventDefault()
  const startX = e.clientX
  const startW = watchWidth.value
  const onMove = (ev) => {
    const delta = ev.clientX - startX
    watchWidth.value = Math.min(Math.max(startW + delta, 200), 420)
  }
  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.body.style.cursor = ''
  }
  document.body.style.cursor = 'col-resize'
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
<\/script>
`, 'utf8');

console.log('  ✓ BottomPanel.vue');
console.log('  ✓ App.vue');
console.log('theme4.mjs complete.');