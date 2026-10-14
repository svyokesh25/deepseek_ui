<template>
  <div class="h-screen flex overflow-hidden bg-white dark:bg-[#080b11] text-[#131722] dark:text-[#d1d4dc] select-none transition-colors">
    <!-- 1. Outermost Left Navigation Rail (matching original .leftbar) -->
    <LeftNavRail
      :active-nav="currentNav"
      :watchlist-open="watchlistOpen"
      :profile-open="profileMenuOpen"
      @toggle-profile="profileMenuOpen = !profileMenuOpen"
      @toggle-watchlist="watchlistOpen = !watchlistOpen"
      @select-nav="onSelectNav"
    />

    <!-- Profile Flyout (#targetmenu) -->
    <ProfileMenu
      v-if="profileMenuOpen"
      @close="profileMenuOpen = false"
    />

    <!-- 2. Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative">
      <!-- Top toolbar -->
      <TopToolbar
        :current-tf="timeframe"
        :current-type="chartType"
        :current-symbol="symbol"
        :chart-engine="chartEngine"
        :watchlist-open="watchlistOpen"
        :watch-width="watchWidth"
        @update:tf="tf => timeframe = tf"
        @update:type="t => chartType = t"
        @update:symbol="selectSymbol"
        @update:engine="e => chartEngine = e"
        @toggle:legend="() => chartPanelRef?.toggleLegend()"
      />

      <!-- Main body: watchlist | drawing rail | chart -->
      <div class="flex-1 flex min-h-0 overflow-hidden">
        <!-- LEFT: Watchlist (toggleable via LeftNavRail) -->
        <Watchlist
          v-if="watchlistOpen"
          :rows="watchlist"
          :current-symbol="symbol"
          :width="watchWidth"
          @select="selectSymbol"
          @remove-symbol="onRemoveSymbol"
          @add-symbol="onAddSymbol"
        />

        <div v-if="watchlistOpen" class="resizer-v" @mousedown="startDragLeft"></div>

        <!-- CENTER: drawing rail + chart col -->
        <div class="flex-1 flex min-w-0 min-h-0">
          <!-- Left drawing rail: only for XtremeNext (BlackTrader has its own built-in) -->
          <LeftToolbar v-if="chartEngine === 'xtremenext'" />

          <!-- Right side of center: Chart Canvas → BottomPanel -->
          <div class="flex-1 flex flex-col min-w-0 min-h-0">
            <div class="flex-1 relative min-h-0 bg-white dark:bg-[#0a0e17]">
              <ChartPanel
                ref="chartPanelRef"
                :engine="chartEngine"
                :symbol="symbol"
                :timeframe="timeframe"
                :bars="bars"
                :chart-type="chartType"
                :summary="summary"
                @buy="lot => placeOrder('BUY', lot)"
                @sell="lot => placeOrder('SELL', lot)"
              />

              <!-- Toast Notifications (bottom-left stacked toasts matching reference) -->
              <ToastNotifications />
            </div>

            <!-- BottomPanel and resizer: hidden when BlackTrader is active -->
            <template v-if="chartEngine === 'xtremenext'">
              <div class="resizer-h" @mousedown="startDragBottom"></div>
              <BottomPanel :height="bottomHeight" @toggle-collapse="toggleBottom" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import LeftNavRail from './components/LeftNavRail.vue'
import ProfileMenu from './components/ProfileMenu.vue'
import TopToolbar from './components/TopToolbar.vue'
import LeftToolbar from './components/LeftToolbar.vue'
import ChartPanel from './components/ChartPanel.vue'
import ToastNotifications from './components/ToastNotifications.vue'
import Watchlist from './components/Watchlist.vue'
import BottomPanel from './components/BottomPanel.vue'
import { generateBars, getSymbolSummary, WATCHLIST, SYMBOLS } from './data/marketData.js'
import { usePositions } from './stores/positions.js'
import { loadWorkspace, useWorkspacePersistence } from './composables/useWorkspace.js'

const { openPosition, updateLtp } = usePositions()

const saved = loadWorkspace()
const currentNav = ref(saved.currentNav || 'chart')
const watchlistOpen = ref(saved.watchlistOpen !== undefined ? saved.watchlistOpen : true)
const profileMenuOpen = ref(false)

const symbol = ref(saved.symbol && SYMBOLS[saved.symbol] ? saved.symbol : 'AUDCAD')
const chartEngine = ref(saved.chartEngine || 'xtremenext')
const timeframe = ref(saved.timeframe || '15')
const chartType = ref(saved.chartType || 'candles')
const bottomHeight = ref(typeof saved.bottomHeight === 'number' ? saved.bottomHeight : 200)
const bottomCollapsed = ref(false)
const prevBottomHeight = ref(bottomHeight.value)
const watchWidth = ref(typeof saved.watchWidth === 'number' ? saved.watchWidth : 260)
const chartPanelRef = ref(null)

useWorkspacePersistence({
  symbol,
  chartEngine,
  timeframe,
  chartType,
  watchWidth,
  bottomHeight,
  watchlistOpen
})

const bars = ref(generateBars(symbol.value, timeframe.value))
const summary = computed(() => getSymbolSummary(symbol.value, timeframe.value))
const watchlist = ref(WATCHLIST.map(r => ({ ...r })))

watch([symbol, timeframe], () => {
  bars.value = generateBars(symbol.value, timeframe.value)
})

watch(summary, (s) => {
  const row = watchlist.value.find(r => r.symbol === s.symbol)
  if (row) row.last = s.close
  updateLtp(s.symbol, s.close)
}, { immediate: true })

function selectSymbol(sym) {
  if (sym && sym !== symbol.value) symbol.value = sym
}

function onRemoveSymbol(sym) {
  watchlist.value = watchlist.value.filter(r => r.symbol !== sym)
  if (symbol.value === sym && watchlist.value.length > 0) {
    selectSymbol(watchlist.value[0].symbol)
  }
}

function onAddSymbol(row) {
  const existing = watchlist.value.find(r => r.symbol === row.symbol)
  if (!existing) {
    watchlist.value.unshift(row)
  }
}

function onSelectNav(nav) {
  currentNav.value = nav
  if (nav === 'position' || nav === 'history') {
    if (bottomCollapsed.value) {
      toggleBottom()
    }
  }
}

function placeOrder(side, customLot) {
  const lot = typeof customLot === 'number' && !isNaN(customLot) ? customLot : 0.01
  const digits = SYMBOLS[symbol.value]?.digits ?? 5
  openPosition({
    symbol: symbol.value,
    side,
    lot,
    price: summary.value.close,
    digits
  })
}

function quickOrder(sym, side) {
  selectSymbol(sym)
  placeOrder(side)
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
    document.body.style.removeProperty('cursor')
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
    document.body.style.removeProperty('cursor')
  }
  document.body.style.cursor = 'col-resize'
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
</script>