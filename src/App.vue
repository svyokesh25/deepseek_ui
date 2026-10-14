<template>
  <div class="h-screen flex overflow-hidden bg-white dark:bg-[#0c1017] text-[#000000] dark:text-[#ffffff] select-none transition-colors">
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
      :chart-engine="chartEngine"
      @update:engine="e => chartEngine = e"
      @close="profileMenuOpen = false"
    />

    <!-- Navigation Modals -->
    <FundsModal
      v-if="fundsModalOpen"
      @close="fundsModalOpen = false"
    />
    <CopyTradingModal
      v-if="copyModalOpen"
      @close="copyModalOpen = false"
    />
    <ApiAccessModal
      v-if="apiModalOpen"
      @close="apiModalOpen = false"
    />
    <CommandPaletteModal
      :open="commandPaletteOpen"
      @close="commandPaletteOpen = false"
      @select-symbol="sym => { selectSymbol(sym); commandPaletteOpen = false }"
      @action="handleCommandAction"
    />
    <AchievementsModal
      v-if="achievementsModalOpen"
      @close="achievementsModalOpen = false"
    />
    <PriceAlertsModal
      v-if="priceAlertsModalOpen"
      :current-symbol="symbol"
      @close="priceAlertsModalOpen = false"
    />
    <TradeJournalDrawer
      v-if="journalDrawerOpen"
      :current-symbol="symbol"
      @close="journalDrawerOpen = false"
    />
    <EconomicCalendarModal
      v-if="calendarModalOpen"
      @close="calendarModalOpen = false"
    />
    <ThemeStudioModal
      v-if="themeStudioModalOpen"
      @close="themeStudioModalOpen = false"
      @apply="onThemeApplied"
    />
    <SymbolSentimentModal
      v-if="sentimentModalOpen"
      @close="sentimentModalOpen = false"
    />
    <TraderAcademyModal
      v-if="academyModalOpen"
      @load-symbol="sym => selectSymbol(sym)"
      @close="academyModalOpen = false"
    />
    <TradingChallengesModal
      v-if="challengesModalOpen"
      @close="challengesModalOpen = false"
    />

    <!-- Viral P/L Flex Card Modal -->
    <PnlFlexCardModal />

    <!-- AI Smart Vision 1-Click Chart Scanner Modal -->
    <ChartAiScannerModal />

    <!-- 2. Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative">
      <!-- Mini PnL & Quick Launch Ticker Bar (Always visible at top across all tabs) -->
      <MiniPnlTicker
        @open-calendar="calendarModalOpen = true"
        @open-alerts="priceAlertsModalOpen = true"
        @open-journal="journalDrawerOpen = true"
        @open-achievements="achievementsModalOpen = true"
        @open-theme-studio="themeStudioModalOpen = true"
        @open-challenges="challengesModalOpen = true"
        @open-academy="academyModalOpen = true"
        @open-sentiment="sentimentModalOpen = true"
      />

      <!-- Live News Ticker Bar (Toggleable / Closable) -->
      <NewsTicker
        v-if="newsTickerOpen"
        @close="newsTickerOpen = false"
      />
      <!-- Top toolbar (only on Chart view) -->
      <TopToolbar
        v-if="currentNav === 'chart'"
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
        @toggle:menu="profileMenuOpen = !profileMenuOpen"
        @toggle:trade="toggleBottom"
      />

      <!-- Main body: watchlist | drawing rail | chart or full pages -->
      <div class="flex-1 flex min-h-0 overflow-hidden relative">
        <!-- LEFT: Watchlist (toggleable via LeftNavRail) -->
        <Watchlist
          v-if="watchlistOpen"
          :rows="watchlist"
          :current-symbol="symbol"
          :width="watchWidth"
          @select="selectSymbol"
          @remove-symbol="onRemoveSymbol"
          @add-symbol="onAddSymbol"
          @close="watchlistOpen = false"
        />

        <div v-if="watchlistOpen" class="resizer-v" @mousedown="startDragLeft"></div>

        <!-- 1) CHART VIEW -->
        <div v-if="currentNav === 'chart'" class="flex-1 flex min-w-0 min-h-0">
          <!-- Left drawing rail: only for XtremeNext (BlackTrader has its own built-in) -->
          <LeftToolbar v-if="chartEngine === 'xtremenext'" />

          <!-- Right side of center: Chart Canvas → BottomPanel -->
          <div class="flex-1 flex flex-col min-w-0 min-h-0">
            <div class="flex-1 relative min-h-0 bg-white dark:bg-[#090d15]">
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
                @switch-engine="e => chartEngine = e"
              />

              <!-- Toast Notifications (anchored near bottom left of chart matching reference) -->
              <ToastNotifications />
            </div>

            <!-- BottomPanel and resizer: hidden when BlackTrader is active -->
            <template v-if="chartEngine === 'xtremenext'">
              <div v-show="!bottomCollapsed" class="resizer-h" @mousedown="startDragBottom"></div>
              <BottomPanel
                :height="bottomHeight"
                :copilot-open="copilotOpen"
                @toggle-collapse="toggleBottom"
                @toggle-copilot="copilotOpen = !copilotOpen"
              />
            </template>
          </div>
        </div>

        <!-- 2) FULL-SCREEN POSITIONS VIEW (matching stage reference) -->
        <PositionsPage v-else-if="currentNav === 'position'" />

        <!-- 3) FULL-SCREEN HISTORY VIEW -->
        <HistoryPage v-else-if="currentNav === 'history'" />

        <!-- Fallback to PositionsPage if other page -->
        <PositionsPage v-else />

        <!-- Toast Notifications (for non-chart views: positions / history) -->
        <ToastNotifications v-if="currentNav !== 'chart'" />

        <!-- Floating Trade Copilot Card (overlaps cleanly above bottom panel at bottom-right, closes on close button) -->
        <div
          v-if="copilotOpen && currentNav === 'chart'"
          class="fixed bottom-10 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] h-[440px] max-h-[calc(100vh-100px)] rounded-2xl shadow-2xl overflow-hidden border border-blue-500/30 dark:border-blue-500/20 bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-xl flex flex-col transition-all duration-200"
        >
          <TradeCopilot
            :symbol="symbol"
            :summary="summary"
            @close="copilotOpen = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import LeftNavRail from './components/LeftNavRail.vue'
import ProfileMenu from './components/ProfileMenu.vue'
import TopToolbar from './components/TopToolbar.vue'
import LeftToolbar from './components/LeftToolbar.vue'
import ChartPanel from './components/ChartPanel.vue'
import ToastNotifications from './components/ToastNotifications.vue'
import Watchlist from './components/Watchlist.vue'
import BottomPanel from './components/BottomPanel.vue'
import PositionsPage from './components/positions/PositionsPage.vue'
import HistoryPage from './components/positions/HistoryPage.vue'
import FundsModal from './components/modals/FundsModal.vue'
import CopyTradingModal from './components/modals/CopyTradingModal.vue'
import ApiAccessModal from './components/modals/ApiAccessModal.vue'
import CommandPaletteModal from './components/modals/CommandPaletteModal.vue'
import AchievementsModal from './components/modals/AchievementsModal.vue'
import PriceAlertsModal from './components/modals/PriceAlertsModal.vue'
import TradeJournalDrawer from './components/modals/TradeJournalDrawer.vue'
import EconomicCalendarModal from './components/modals/EconomicCalendarModal.vue'
import ThemeStudioModal from './components/modals/ThemeStudioModal.vue'
import PnlFlexCardModal from './components/modals/PnlFlexCardModal.vue'
import ChartAiScannerModal from './components/modals/ChartAiScannerModal.vue'
import SymbolSentimentModal from './components/modals/SymbolSentimentModal.vue'
import TraderAcademyModal from './components/modals/TraderAcademyModal.vue'
import TradingChallengesModal from './components/modals/TradingChallengesModal.vue'
import MiniPnlTicker from './components/common/MiniPnlTicker.vue'
import NewsTicker from './components/common/NewsTicker.vue'
import TradeCopilot from './components/common/TradeCopilot.vue'
import { generateBars, getSymbolSummary, WATCHLIST, SYMBOLS } from './data/marketData.js'
import { startMarketStream, stopMarketStream, setActiveChartSymbol, onMarketTick } from './stores/marketFeed.js'
import {
  connectXtremeNextWs,
  disconnectXtremeNextWs,
  subscribeSymbol,
  subscribeActiveSymbol,
  setActiveSymbol,
  setActiveTimeframe,
  onWsTick,
  calculateOHLCForSymbol,
  getBarsForSymbol,
  allSymbolOHLC,
  lastWsTick
} from './services/xtremeNextWs.js'
import { usePositions } from './stores/positions.js'
import { loadWorkspace, useWorkspacePersistence } from './composables/useWorkspace.js'

const { openPosition, updateLtp } = usePositions()

const saved = loadWorkspace()
const currentNav = ref(saved.currentNav || 'chart')
const watchlistOpen = ref(saved.watchlistOpen !== undefined ? saved.watchlistOpen : true)
const profileMenuOpen = ref(false)
const fundsModalOpen = ref(false)
const copyModalOpen = ref(false)
const apiModalOpen = ref(false)
const achievementsModalOpen = ref(false)
const priceAlertsModalOpen = ref(false)
const journalDrawerOpen = ref(false)
const calendarModalOpen = ref(false)
const themeStudioModalOpen = ref(false)
const sentimentModalOpen = ref(false)
const academyModalOpen = ref(false)
const challengesModalOpen = ref(false)
const newsTickerOpen = ref(true)

const symbol = ref(saved.symbol && SYMBOLS[saved.symbol] ? saved.symbol : 'AUDCAD')
const chartEngine = ref(saved.chartEngine || 'xtremenext')
const timeframe = ref(saved.timeframe || '15')
const chartType = ref(saved.chartType || 'candles')
const bottomHeight = ref(typeof saved.bottomHeight === 'number' ? saved.bottomHeight : 200)
const bottomCollapsed = ref(false)
const prevBottomHeight = ref(200)
const watchWidth = ref(typeof saved.watchWidth === 'number' && saved.watchWidth >= 280 && saved.watchWidth <= 450 ? saved.watchWidth : 280)
const chartPanelRef = ref(null)
const commandPaletteOpen = ref(false)
const zenMode = ref(false)
const copilotOpen = ref(false)

function handleCommandAction(action) {
  if (action === 'challenges') challengesModalOpen.value = true;
  else if (action === 'academy') academyModalOpen.value = true;
  else if (action === 'sentiment') sentimentModalOpen.value = true;
  else if (action === 'journal') journalDrawerOpen.value = true;
  else if (action === 'calendar') calendarModalOpen.value = true;
  commandPaletteOpen.value = false;
}

useWorkspacePersistence({
  currentNav,
  symbol,
  chartEngine,
  timeframe,
  chartType,
  watchWidth,
  bottomHeight,
  watchlistOpen
})

const bars = ref(getBarsForSymbol(symbol.value, timeframe.value))
const liveSummary = ref(getSymbolSummary(symbol.value, timeframe.value))
const summary = computed(() => liveSummary.value)
const watchlist = ref(WATCHLIST.map(r => ({ ...r })))

watch(symbol, (newSym) => {
  setActiveChartSymbol(newSym)
  setActiveSymbol(newSym)
  subscribeActiveSymbol(newSym)
})

watch([symbol, timeframe], () => {
  setActiveTimeframe(timeframe.value)
  bars.value = getBarsForSymbol(symbol.value, timeframe.value)
  const ohlc = allSymbolOHLC[symbol.value]
  if (ohlc) {
    liveSummary.value = {
      ...getSymbolSummary(symbol.value, timeframe.value),
      ...ohlc
    }
  } else {
    liveSummary.value = getSymbolSummary(symbol.value, timeframe.value)
  }
})

watch(summary, (s) => {
  if (!s || !s.symbol) return
  const row = watchlist.value.find(r => r.symbol === s.symbol)
  if (row) row.last = s.close
  const numPrice = Number(s.close)
  if (!isNaN(numPrice)) {
    updateLtp(s.symbol, numPrice)
  }
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
  if (nav === 'funds') {
    fundsModalOpen.value = true
  } else if (nav === 'copy' || nav === 'mam' || nav === 'pamm') {
    copyModalOpen.value = true
  } else if (nav === 'api') {
    apiModalOpen.value = true
  } else if (nav === 'calendar') {
    calendarModalOpen.value = true
  } else if (nav === 'alerts') {
    priceAlertsModalOpen.value = true
  } else if (nav === 'journal') {
    journalDrawerOpen.value = true
  } else if (nav === 'trophy') {
    achievementsModalOpen.value = true
  } else if (nav === 'theme-studio') {
    themeStudioModalOpen.value = true
  } else {
    currentNav.value = nav
  }
}

function onThemeApplied(theme) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('xn:theme-change', { detail: theme }));
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
    prevBottomHeight.value = bottomHeight.value > 45 ? bottomHeight.value : 200
    bottomHeight.value = 28
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
    watchWidth.value = Math.min(Math.max(startW + delta, 220), 450)
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

// Global Trading Keyboard Hotkeys
function onGlobalKeydown(e) {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
    return;
  }
  // Ctrl+K / Cmd+K — Command Palette
  if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault();
    commandPaletteOpen.value = !commandPaletteOpen.value;
    return;
  }
  // Z — Zen Focus Mode (collapse watchlist + bottom panel)
  if (e.key === 'z' || e.key === 'Z') {
    e.preventDefault();
    toggleZenMode();
    return;
  }
  if (e.shiftKey && (e.key === 'B' || e.key === 'b')) {
    e.preventDefault();
    placeOrder('BUY');
  } else if (e.shiftKey && (e.key === 'S' || e.key === 's')) {
    e.preventDefault();
    placeOrder('SELL');
  } else if (e.key === 'Escape') {
    profileMenuOpen.value = false;
    fundsModalOpen.value = false;
    copyModalOpen.value = false;
    apiModalOpen.value = false;
    commandPaletteOpen.value = false;
    achievementsModalOpen.value = false;
    priceAlertsModalOpen.value = false;
    journalDrawerOpen.value = false;
    calendarModalOpen.value = false;
    themeStudioModalOpen.value = false;
  }
}

function toggleZenMode() {
  zenMode.value = !zenMode.value;
  if (zenMode.value) {
    // Collapse watchlist + bottom panel for full-screen chart focus
    watchlistOpen.value = false;
    prevBottomHeight.value = bottomHeight.value;
    bottomHeight.value = 40;
    bottomCollapsed.value = true;
  } else {
    watchlistOpen.value = true;
    bottomHeight.value = prevBottomHeight.value || 200;
    bottomCollapsed.value = false;
  }
}

let unsubscribeMarketTick = null;
let unsubscribeWsTick = null;

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown);

  // 1. Connect to live XtremeNext WebSocket server: wss://cloud1.xtremenext.com/server3/
  setActiveSymbol(symbol.value);
  setActiveTimeframe(timeframe.value);
  connectXtremeNextWs();
  subscribeActiveSymbol(symbol.value);
  subscribeSymbol(['XAUUSD', 'EURUSD', 'GBPUSD', 'BTCUSD', 'USDJPY', 'AUDCAD', 'AUDUSD']);

  // 2. Consume live WebSocket ticks and calculate OHLC for ALL symbols
  unsubscribeWsTick = onWsTick((sym, tickPayload) => {
    const dg = SYMBOLS[sym]?.digits ?? 2;
    // Calculate live OHLC for this symbol across active timeframe
    const ohlc = calculateOHLCForSymbol(sym, tickPayload.price, timeframe.value);

    // If this symbol is currently displayed on the chart, update Lightweight Charts series & header legend!
    const currentSymUpper = symbol.value.toUpperCase();
    if (sym === currentSymUpper && ohlc) {
      const curBars = bars.value;
      if (curBars && curBars.length > 0) {
        const lastBar = curBars[curBars.length - 1];
        chartPanelRef.value?.updateLiveBar(lastBar);
      }

      liveSummary.value = {
        symbol: symbol.value,
        name: SYMBOLS[symbol.value]?.name || symbol.value,
        exchange: SYMBOLS[symbol.value]?.exchange || 'OANDA',
        digits: dg,
        category: SYMBOLS[symbol.value]?.category || 'Forex',
        badge: SYMBOLS[symbol.value]?.badge || 'FX',
        tag: SYMBOLS[symbol.value]?.tag || symbol.value.slice(0, 2),
        open: ohlc.open,
        high: ohlc.high,
        low: ohlc.low,
        close: ohlc.close,
        change: ohlc.change,
        changePct: ohlc.changePct
      };

      if (typeof document !== 'undefined') {
        const sign = ohlc.change >= 0 ? '▲ +' : '▼ −';
        document.title = `${symbol.value} ${ohlc.close} ${sign}${Math.abs(ohlc.changePct).toFixed(2)}%`;
      }
    }

    // Sync watchlist with incoming live WebSocket tick price & calculated OHLC change for ALL symbols
    const row = watchlist.value.find(r => r.symbol.toUpperCase() === sym);
    if (row && ohlc) {
      row.last = Number(ohlc.close);
      row.change = ohlc.change;
      row.changePercent = ohlc.changePct;
    }
    updateLtp(sym, tickPayload.price);
  });

  // 3. Fallback heartbeat for symbols without active WS feed
  startMarketStream();
  setActiveChartSymbol(symbol.value);

  unsubscribeMarketTick = onMarketTick((sym, tickData, dir) => {
    const recentWs = lastWsTick[sym];
    const isRecentlyWsActive = recentWs && (Date.now() - recentWs.time < 5000);

    // If live WebSocket is actively sending ticks for this symbol, let WebSocket manage it
    if (isRecentlyWsActive) return;

    // Calculate live OHLC for this symbol across active timeframe
    const ohlc = calculateOHLCForSymbol(sym, tickData.price, timeframe.value);

    // If currently displayed on chart, push live candle update
    const currentSymUpper = symbol.value.toUpperCase();
    if (sym.toUpperCase() === currentSymUpper && ohlc) {
      const curBars = bars.value;
      if (curBars && curBars.length > 0) {
        const lastBar = curBars[curBars.length - 1];
        chartPanelRef.value?.updateLiveBar(lastBar);
      }

      liveSummary.value = {
        symbol: symbol.value,
        name: SYMBOLS[symbol.value]?.name || symbol.value,
        exchange: SYMBOLS[symbol.value]?.exchange || 'OANDA',
        digits: tickData.digits,
        category: SYMBOLS[symbol.value]?.category || 'Forex',
        badge: SYMBOLS[symbol.value]?.badge || 'FX',
        tag: SYMBOLS[symbol.value]?.tag || symbol.value.slice(0, 2),
        open: ohlc.open,
        high: ohlc.high,
        low: ohlc.low,
        close: ohlc.close,
        change: ohlc.change,
        changePct: ohlc.changePct
      };

      if (typeof document !== 'undefined') {
        const sign = ohlc.change >= 0 ? '▲ +' : '▼ −';
        const pct = Math.abs(ohlc.changePct || 0).toFixed(2);
        document.title = `${symbol.value} ${ohlc.close} ${sign}${pct}%`;
      }
    }

    const row = watchlist.value.find(r => r.symbol.toUpperCase() === sym.toUpperCase());
    if (row && ohlc) {
      row.last = Number(ohlc.close);
      row.change = ohlc.change;
      row.changePercent = ohlc.changePct;
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown);
  if (unsubscribeWsTick) unsubscribeWsTick();
  if (unsubscribeMarketTick) unsubscribeMarketTick();
  disconnectXtremeNextWs();
  stopMarketStream();
});
</script>