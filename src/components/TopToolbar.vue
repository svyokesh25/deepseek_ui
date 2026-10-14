<template>
  <header class="h-[38px] bg-white dark:bg-[#0d111a] border-b border-[#eef0f4] dark:border-[#1a2232] flex items-center shrink-0 z-50 select-none font-sans text-xs transition-colors overflow-visible relative">
    <!-- 1. Left Watchlist Tickers Header (if watchlist open) -->
    <div
      v-if="watchlistOpen"
      class="flex border-r border-[#eef0f4] dark:border-[#1a2232] shrink-0 h-full"
      :style="{ width: watchWidth + 'px' }"
    >
      <div
        v-for="(t, idx) in liveTopTickers"
        :key="t.symbol"
        class="flex-1 px-2.5 py-0.5 cursor-pointer flex flex-col justify-center hover:bg-gray-50 dark:hover:bg-[#131823] transition-colors overflow-hidden"
        :class="{ 'border-r border-[#eef0f4] dark:border-[#1a2232]': idx === 0 }"
        @click="$emit('update:symbol', t.symbol)"
      >
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-[#000000] dark:text-[#ffffff] leading-tight block truncate">{{ t.symbol }}</span>
          <span
            class="text-[8.5px] font-bold font-mono px-0.5 rounded leading-none transition-colors duration-200"
            :class="(t.changePct && t.changePct.startsWith('-')) ? 'text-[#f23645] dark:text-[#f87171]' : 'text-[#089981] dark:text-[#34d399]'"
          >
            {{ t.changePct }}%
          </span>
        </div>
        <span
          class="text-[11px] font-bold font-mono leading-tight block tabular-nums transition-all duration-300"
          :class="[
            t.flash === 'up'
              ? 'text-[#089981] dark:text-[#34d399] scale-105'
              : t.flash === 'down'
                ? 'text-[#f23645] dark:text-[#f87171] scale-105'
                : 'text-[#0072fd] dark:text-[#38bdf8]'
          ]"
        >
          $ {{ t.price }}
        </span>
      </div>
    </div>

    <!-- 2. Main TradingView Top Toolbar -->
    <div class="flex items-center gap-0.5 px-1.5 h-full flex-1 min-w-0 overflow-visible relative">
      <!-- 2.1 Hamburger Menu Button with Red Notification Badge -->
      <div class="relative shrink-0">
        <button
          type="button"
          data-qa-id="main-menu-button"
          class="w-[32px] h-[30px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#000000] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer relative"
          title="Main Menu"
          @click.stop="$emit('toggle:menu')"
        >
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="5" y1="8" x2="23" y2="8" />
            <line x1="5" y1="14" x2="23" y2="14" />
            <line x1="5" y1="20" x2="23" y2="20" />
          </svg>
          <span class="absolute top-1 right-1 w-3.5 h-3.5 bg-[#f23645] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">1</span>
        </button>
      </div>

      <div class="w-px h-4 bg-[#e3e6eb] dark:bg-[#1a1a1a] mx-0.5 shrink-0"></div>

      <!-- 2.2 Symbol Search Button -->
      <div class="relative shrink-0 flex items-center">
        <button
          id="header-toolbar-symbol-search"
          type="button"
          class="h-[28px] px-2.5 text-[12px] font-bold text-[#000000] dark:text-[#ffffff] flex items-center gap-1.5 border border-[#e3e6eb] dark:border-[#222222] rounded-[4px] bg-white dark:bg-black hover:bg-[#f6f8fb] dark:hover:bg-[#151515] transition-colors cursor-pointer shadow-2xs"
          title="Symbol search (XAUUSD, EURUSD...)"
          @click.stop="toggleSymbolSearch"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" class="text-[#8a94a6]">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <span>{{ currentSymbol || 'XAUUSD' }}</span>
        </button>

        <!-- Symbol Search Dropdown Popup -->
        <div
          v-if="showSymbolSearch"
          class="absolute left-0 top-full mt-1 bg-white dark:bg-[#0d111a] border border-[#e3e6eb] dark:border-[#1a2232] rounded-lg shadow-2xl ring-1 ring-black/5 dark:ring-white/5 w-[280px] p-2 z-[70] text-xs"
          @click.stop
        >
          <div class="flex items-center gap-2 bg-[#f4f6f9] dark:bg-[#141824] rounded-md px-2.5 py-1.5 border border-transparent focus-within:border-[#0072fd] focus-within:bg-white dark:focus-within:bg-[#141824] transition-all mb-1.5">
            <svg class="w-3.5 h-3.5 text-[#9aa3b0] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref="symbolInputRef"
              v-model="symbolQuery"
              type="text"
              class="bg-transparent outline-none text-xs w-full text-[#000000] dark:text-[#ffffff] placeholder:text-[#9aa3b0] dark:placeholder:text-[#737373]"
              placeholder="Search symbol (XAUUSD, EURUSD...)"
              autocomplete="off"
            />
          </div>

          <div class="max-h-[250px] overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#1a2232]">
            <div
              v-for="s in filteredSymbols"
              :key="s.symbol"
              class="flex items-center justify-between px-2.5 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#151c28] cursor-pointer rounded transition-colors"
              :class="{ 'bg-[#f0f6ff] dark:bg-[#1a2232] text-[#0072fd] dark:text-[#38bdf8] font-medium': s.symbol === currentSymbol }"
              @click="onSelectSymbol(s.symbol)"
            >
              <div class="flex flex-col">
                <span class="font-semibold text-[#000000] dark:text-[#ffffff]">{{ s.symbol }}</span>
                <span class="text-[#8a94a6] text-[10px]">{{ s.desc || s.exchange }}</span>
              </div>
              <span class="text-[#0072fd] dark:text-[#38bdf8] font-medium text-[11px] tabular-nums">${{ s.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.3 Compare Symbols Button (+) -->
      <div class="relative shrink-0">
        <button
          id="header-toolbar-compare"
          type="button"
          class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#000000] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Compare symbols"
          @click.stop="showCompareModal = !showCompareModal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20">
            <path fill="currentColor" d="M13.5 6a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM4 14.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"></path>
            <path fill="currentColor" d="M9 14h4v-4h1v4h4v1h-4v4h-1v-4H9v-1z"></path>
          </svg>
        </button>

        <div
          v-if="showCompareModal"
          class="absolute left-0 top-full mt-1 bg-white dark:bg-[#0d111a] border border-[#e3e6eb] dark:border-[#1a2232] rounded-lg shadow-2xl ring-1 ring-black/5 dark:ring-white/5 w-[240px] p-2.5 z-[70] text-xs"
          @click.stop
        >
          <div class="font-semibold text-[#000000] dark:text-white mb-1.5">Compare Symbol</div>
          <div class="flex gap-1.5">
            <input
              v-model="compareQuery"
              type="text"
              class="flex-1 bg-[#f4f6f9] dark:bg-[#141824] border border-[#e3e6eb] dark:border-[#1a2232] text-[#000000] dark:text-[#ffffff] rounded px-2 py-1 text-xs outline-none focus:border-[#0072fd]"
              placeholder="e.g. BTCUSD, XAUUSD"
            />
            <button
              type="button"
              class="px-2.5 py-1 bg-[#0072fd] text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors cursor-pointer"
              @click="addCompareSymbol"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div class="w-px h-4 bg-[#e3e6eb] dark:bg-[#1a1a1a] mx-0.5 shrink-0"></div>

      <!-- 2.4 DEDICATED CHART PLATFORM SELECTOR (XtremeNext vs BlackTrader) -->
      <div class="flex items-center bg-[#f0f3fa] dark:bg-[#151515] p-0.5 rounded-[5px] border border-[#e3e6eb] dark:border-[#262626] shrink-0">
        <button
          id="btn-engine-xtremenext"
          type="button"
          class="h-[25px] px-2.5 text-[11.5px] font-bold rounded-[4px] transition-all cursor-pointer flex items-center gap-1.5"
          :class="chartEngine === 'xtremenext'
            ? 'bg-white dark:bg-black text-[#0072fd] dark:text-[#38bdf8] shadow-xs'
            : 'text-[#5d6673] dark:text-[#888888] hover:text-[#000000] dark:hover:text-white'"
          title="Switch to Native XtremeNext Chart"
          @click="selectEngine('xtremenext')"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          <span>XtremeNext</span>
        </button>
        <button
          id="btn-engine-blacktrader"
          type="button"
          class="h-[25px] px-2.5 text-[11.5px] font-bold rounded-[4px] transition-all cursor-pointer flex items-center gap-1.5"
          :class="chartEngine === 'blacktrader'
            ? 'bg-[#0072fd] text-white shadow-xs font-black'
            : 'text-[#5d6673] dark:text-[#888888] hover:text-[#000000] dark:hover:text-white'"
          title="Switch to BlackTrader Live Chart (#chart_MiD2b)"
          @click="selectEngine('blacktrader')"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="9"/>
          </svg>
          <span>BlackTrader</span>
        </button>
      </div>

      <div class="w-px h-4 bg-[#e3e6eb] dark:bg-[#1a1a1a] mx-0.5 shrink-0"></div>

      <!-- 2.4 Timeframe / Intervals Controls -->
      <div class="flex items-center gap-0.5 shrink-0">
        <!-- Quick favorite timeframes (1m, 5m, 15m, 1h, 4h, 1D) -->
        <div class="hidden xl:flex items-center gap-0.5">
          <button
            v-for="q in quickTimeframes"
            :key="q.code"
            type="button"
            class="h-[28px] px-1.5 rounded-[4px] text-[11.5px] font-semibold transition-colors cursor-pointer"
            :class="String(currentTf) === q.code
              ? 'text-[#0072fd] dark:text-[#38bdf8] font-bold bg-[#f0f6ff] dark:bg-[#1a2232]'
              : 'text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#000000] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515]'"
            :title="`Switch to ${q.short} timeframe`"
            @click="selectTf(q.code)"
          >
            {{ q.short }}
          </button>
        </div>

        <!-- Full Timeframe Dropdown Trigger (displays current active and chevron ⌵) -->
        <div id="header-toolbar-intervals" class="relative shrink-0">
          <button
            type="button"
            class="h-[28px] px-2 rounded-[4px] flex items-center gap-1 font-semibold text-[12px] text-[#131722] dark:text-[#d1d4dc] hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
            :class="{ 'bg-[#f0f3fa] dark:bg-[#151515] text-[#0072fd] dark:text-[#38bdf8]': tfMenuOpen }"
            title="Time Interval"
            @click.stop="toggleTfMenu"
          >
            <span>{{ currentTfDisplay }}</span>
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-[#8a94a6] transition-transform duration-150" :class="{ 'rotate-180': tfMenuOpen }">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          <!-- Timeframe Dropdown Menu (Z-[70], never clipped, 100% visible) -->
          <div
            v-if="tfMenuOpen"
            class="absolute left-0 top-full mt-1.5 bg-white dark:bg-[#0d111a] border border-[#e3e6eb] dark:border-[#1a2232] rounded-lg shadow-2xl ring-1 ring-black/5 dark:ring-white/5 w-[205px] py-1 z-[70] text-xs select-none max-h-[480px] overflow-y-auto"
            @click.stop
          >
            <div v-for="cat in tfCategories" :key="cat.name" class="py-1 border-b border-[#f0f2f5] dark:border-[#1a2232] last:border-b-0">
              <div class="px-3.5 py-1 text-[10px] font-bold text-[#88909b] dark:text-[#787b86] tracking-wider uppercase flex items-center justify-between">
                <span>{{ cat.name }}</span>
              </div>
              <div
                v-for="item in cat.items"
                :key="item.code"
                class="px-3 py-1.5 mx-1 rounded-md text-[12px] flex items-center justify-between cursor-pointer transition-colors"
                :class="String(currentTf) === item.code
                  ? 'bg-[#0072fd] text-white font-medium shadow-xs'
                  : 'text-[#212529] dark:text-[#d1d4dc] hover:bg-[#f0f3f6] dark:hover:bg-[#1a2232] font-normal'"
                @click="selectTf(item.code)"
              >
                <div class="flex items-center gap-1.5">
                  <svg v-if="String(currentTf) === item.code" class="w-3.5 h-3.5 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{{ item.label }}</span>
                </div>
                <span
                  class="text-[10px] font-mono px-1 rounded leading-none"
                  :class="String(currentTf) === item.code ? 'text-white/90 bg-white/20' : 'text-[#88909b] dark:text-[#787b86]'"
                >
                  {{ item.short }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-px h-4 bg-[#e3e6eb] dark:bg-[#1a1a1a] mx-0.5 shrink-0"></div>

      <!-- 2.5 Chart Styles Button (Candles Icon ⌵) -->
      <div id="header-toolbar-chart-styles" class="relative shrink-0">
        <button
          type="button"
          class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Chart Styles (Candles, Bars, Line...)"
          @click.stop="showChartTypeMenu = !showChartTypeMenu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="currentColor">
            <path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"></path>
            <path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"></path>
            <path d="M9 8v12h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5z"></path>
            <path d="M10 4h1v3.5h-1zm0 16.5h1V24h-1z"></path>
          </svg>
        </button>

        <div
          v-if="showChartTypeMenu"
          class="absolute left-0 top-full mt-1 bg-white dark:bg-[#0d111a] border border-[#e3e6eb] dark:border-[#1a2232] rounded-lg shadow-2xl ring-1 ring-black/5 dark:ring-white/5 w-[160px] py-1 z-[70] text-xs"
          @click.stop
        >
          <button
            v-for="ct in chartTypes"
            :key="ct.id"
            type="button"
            class="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#f6f8fb] dark:hover:bg-[#151c28] cursor-pointer transition-colors"
            :class="currentType === ct.id ? 'text-[#0072fd] dark:text-[#38bdf8] font-medium bg-[#f0f6ff] dark:bg-[#1a2232]' : 'text-[#212529] dark:text-[#d1d4dc]'"
            @click="selectChartType(ct.id)"
          >
            <span>{{ ct.label }}</span>
            <svg v-if="currentType === ct.id" class="w-3.5 h-3.5 text-[#0072fd]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
      </div>

      <div class="w-px h-4 bg-[#e3e6eb] dark:bg-[#1a1a1a] mx-0.5 shrink-0"></div>

      <!-- 2.6 Indicators Button (Indicators Icon + Text) -->
      <div id="header-toolbar-indicators" class="relative shrink-0">
        <button
          type="button"
          class="h-[28px] px-2 rounded-[4px] flex items-center gap-1.5 text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Indicators, metrics, and strategies (/)"
          @click.stop="showIndicatorsModal = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="18" height="18" fill="none">
            <path stroke="currentColor" stroke-width="1.6" d="M6 12l4.8-4.8a1 1 0 0 1 1.4 0l2.7 2.7a1 1 0 0 0 1.3.1L23 5"></path>
            <path fill="currentColor" fill-rule="evenodd" d="M19 12a1 1 0 0 0-1 1v4h-3v-1a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v2H7a1 1 0 0 0-1 1v4h17V13a1 1 0 0 0-1-1h-3zm0 10h3v-9h-3v9zm-1 0v-4h-3v4h3zm-4-4.5V22h-3v-6h3v1.5zM10 22v-3H7v3h3z"></path>
          </svg>
          <span class="font-medium text-[12px] hidden sm:inline">Indicators</span>
          <span v-if="activeIndicatorsCount > 0" class="w-4 h-4 bg-[#0072fd] text-white rounded-full text-[9px] flex items-center justify-center font-bold">
            {{ activeIndicatorsCount }}
          </span>
        </button>
      </div>

      <!-- 2.7 Indicator Templates Button -->
      <div id="header-toolbar-study-templates" class="relative shrink-0">
        <button
          type="button"
          class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Indicator templates"
          @click.stop="showTemplatesMenu = !showTemplatesMenu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="18" height="18">
            <path fill="currentColor" fill-rule="evenodd" d="M8 7h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM6 8c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8zm11-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm-2 1c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V8zm-4 8H8a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zm-3-1a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H8zm9 1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1zm-2 1c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3z"></path>
          </svg>
        </button>

        <div
          v-if="showTemplatesMenu"
          class="absolute left-0 top-full mt-1 bg-white dark:bg-[#0d111a] border border-[#e3e6eb] dark:border-[#1a2232] rounded-lg shadow-2xl ring-1 ring-black/5 dark:ring-white/5 w-[180px] py-1 z-[70] text-xs"
          @click.stop
        >
          <div class="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase">Templates</div>
          <button
            v-for="tpl in templatesList"
            :key="tpl"
            type="button"
            class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#151c28] cursor-pointer text-[#212529] dark:text-[#d1d4dc] transition-colors"
            @click="applyTemplate(tpl)"
          >
            {{ tpl }}
          </button>
        </div>
      </div>

      <div class="w-px h-4 bg-[#e3e6eb] dark:bg-[#1a1a1a] mx-0.5 shrink-0"></div>

      <!-- 2.75 AI Smart Vision 1-Click Scanner Button -->
      <div id="header-toolbar-ai-scanner" class="relative shrink-0">
        <button
          type="button"
          class="h-[28px] px-2.5 rounded-[5px] flex items-center gap-1.5 bg-gradient-to-r from-blue-600/15 via-indigo-600/20 to-purple-600/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-500/60 transition-all cursor-pointer shadow-xs active:scale-95"
          title="1-Click AI Smart Vision Chart Scanner"
          @click.stop="triggerAiScan"
        >
          <span class="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          <span class="font-bold text-[11.5px] tracking-tight">⚡ AI Vision</span>
        </button>
      </div>

      <div class="w-px h-4 bg-[#e3e6eb] dark:bg-[#1a1a1a] mx-0.5 shrink-0"></div>

      <!-- 2.8 Alert Button (Alert Icon + Text) -->
      <div id="header-toolbar-alerts" class="relative shrink-0">
        <button
          type="button"
          class="h-[28px] px-2 rounded-[4px] flex items-center gap-1.5 text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Create alert (Alt + A)"
          @click.stop="showAlertModal = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="18" height="18">
            <path fill="currentColor" d="m19.54 4.5 3.96 4.32-.74.68-3.96-4.32.74-.68ZM7.46 4.5 3.5 8.82l.74.68L8.2 5.18l-.74-.68ZM19.74 10.33A7.5 7.5 0 0 1 21 14.5v.5h1v-.5a8.5 8.5 0 1 0-8.5 8.5h.5v-1h-.5a7.5 7.5 0 1 1 6.24-11.67Z"></path>
            <path fill="currentColor" d="M13 9v5h-3v1h4V9h-1ZM19 20v-4h1v4h4v1h-4v4h-1v-4h-4v-1h4Z"></path>
          </svg>
          <span class="font-medium text-[12px] hidden md:inline">Alert</span>
        </button>
      </div>

      <!-- 2.9 Replay Button (Replay Icon + Text) -->
      <div id="header-toolbar-replay" class="relative shrink-0">
        <button
          type="button"
          class="h-[28px] px-2 rounded-[4px] flex items-center gap-1.5 text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          :class="{ 'text-[#0072fd] dark:text-[#38bdf8] bg-blue-50 dark:bg-[#1f1f1f]': replayActive }"
          title="Bar replay"
          @click="toggleReplay"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="18" height="18">
            <path fill="none" stroke="currentColor" stroke-width="1.8" d="M13.5 20V9l-6 5.5 6 5.5zM21.5 20V9l-6 5.5 6 5.5z"></path>
          </svg>
          <span class="font-medium text-[12px] hidden md:inline">Replay</span>
        </button>
      </div>

      <div class="w-px h-4 bg-[#e3e6eb] dark:bg-[#1a1a1a] mx-0.5 shrink-0"></div>

      <!-- 2.10 Undo & Redo (header-toolbar-undo-redo) -->
      <div id="header-toolbar-undo-redo" class="hidden lg:flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Undo (Ctrl + Z)"
          @click="triggerUndo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="18" height="18">
            <path fill="currentColor" d="M8.707 13l2.647 2.646-.707.708L6.792 12.5l3.853-3.854.708.708L8.707 12H14.5a5.5 5.5 0 0 1 5.5 5.5V19h-1v-1.5a4.5 4.5 0 0 0-4.5-4.5H8.707z"></path>
          </svg>
        </button>

        <button
          type="button"
          class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Redo (Ctrl + Y)"
          @click="triggerRedo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="18" height="18">
            <path fill="currentColor" d="M18.293 13l-2.647 2.646.707.708 3.854-3.854-3.854-3.854-.707.708L18.293 12H12.5A5.5 5.5 0 0 0 7 17.5V19h1v-1.5a4.5 4.5 0 0 1 4.5-4.5h5.793z"></path>
          </svg>
        </button>
      </div>

      <!-- 2.11 Flexible Spacer -->
      <div class="flex-1 min-w-[8px]"></div>

      <!-- 2.12 Layout Setup (header-toolbar-layouts) -->
      <div class="relative shrink-0 hidden xl:block">
        <button
          id="header-toolbar-layouts"
          type="button"
          class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Layout setup"
          @click.stop="showLayoutMenu = !showLayoutMenu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 21 19" width="17" height="16">
            <path fill="currentColor" d="M2.5 1C1.67 1 1 1.67 1 2.5v12c0 .83.67 1.5 1.5 1.5h14c.83 0 1.5-.67 1.5-1.5v-12c0-.83-.67-1.5-1.5-1.5h-14ZM0 2.5A2.5 2.5 0 0 1 2.5 0h14A2.5 2.5 0 0 1 19 2.5v12a2.5 2.5 0 0 1-2.5 2.5h-14A2.5 2.5 0 0 1 0 14.5v-12Z"></path>
          </svg>
        </button>

        <div
          v-if="showLayoutMenu"
          class="absolute right-0 top-full mt-1.5 bg-white dark:bg-[#0d111a] border border-[#e3e6eb] dark:border-[#1a2232] rounded-lg shadow-2xl ring-1 ring-black/5 dark:ring-white/5 w-[160px] py-1 z-[70] text-xs"
          @click.stop
        >
          <button type="button" class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#151c28] text-[#212529] dark:text-[#d1d4dc] cursor-pointer transition-colors" @click="selectLayout('1-single')">1 Chart</button>
          <button type="button" class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#151c28] text-[#212529] dark:text-[#d1d4dc] cursor-pointer transition-colors" @click="selectLayout('2-vert')">2 Charts (Vertical)</button>
          <button type="button" class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#151c28] text-[#212529] dark:text-[#d1d4dc] cursor-pointer transition-colors" @click="selectLayout('2-horiz')">2 Charts (Horizontal)</button>
          <button type="button" class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#151c28] text-[#212529] dark:text-[#d1d4dc] cursor-pointer transition-colors" @click="selectLayout('4-grid')">4 Charts (Quad Grid)</button>
        </div>
      </div>

      <!-- 2.13 Save Layout (header-toolbar-save-load) -->
      <div id="header-toolbar-save-load" class="relative hidden md:flex items-center shrink-0">
        <button
          type="button"
          class="h-[28px] px-2.5 rounded-l-[4px] border border-r-0 border-[#e3e6eb] dark:border-[#1a1a1a] bg-white dark:bg-[#000000] text-[12px] font-semibold text-[#131722] dark:text-[#d1d4dc] hover:bg-[#f6f8fb] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Save layout (Ctrl + S)"
          @click="saveChartLayout"
        >
          Save
        </button>
        <button
          type="button"
          class="h-[28px] px-1.5 rounded-r-[4px] border border-[#e3e6eb] dark:border-[#1a1a1a] bg-white dark:bg-[#000000] text-[#8a94a6] hover:text-[#131722] dark:hover:text-white hover:bg-[#f6f8fb] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Manage layouts"
          @click.stop="showSaveMenu = !showSaveMenu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="10" height="6">
            <path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"></path>
          </svg>
        </button>

        <div
          v-if="showSaveMenu"
          class="absolute right-0 top-full mt-1.5 bg-white dark:bg-[#0d111a] border border-[#e3e6eb] dark:border-[#1a2232] rounded-lg shadow-2xl ring-1 ring-black/5 dark:ring-white/5 w-[170px] py-1 z-[70] text-xs"
          @click.stop
        >
          <button type="button" class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#151c28] text-[#212529] dark:text-[#d1d4dc] cursor-pointer transition-colors" @click="saveChartLayout">Save Now</button>
          <button type="button" class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#151c28] text-[#212529] dark:text-[#d1d4dc] cursor-pointer transition-colors" @click="saveAsCopy">Make a Copy...</button>
          <button type="button" class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#151c28] text-[#212529] dark:text-[#d1d4dc] cursor-pointer transition-colors" @click="renameLayout">Rename Layout...</button>
        </div>
      </div>

      <div class="w-px h-4 bg-[#e3e6eb] dark:bg-[#1a1a1a] mx-0.5 shrink-0 hidden md:block"></div>

      <!-- 2.14 Quick Search Button (header-toolbar-quick-search) -->
      <div class="relative shrink-0 hidden xl:block">
        <button
          id="header-toolbar-quick-search"
          type="button"
          class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Quick search (Ctrl + K)"
          @click.stop="showCommandPalette = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="18" height="18" fill="currentColor">
            <path d="M17 4v4h2a1 1 0 0 1 .83 1.55l-4 6A1 1 0 0 1 14 15v-4h-2a1 1 0 0 1-.83-1.55l4-6A1 1 0 0 1 17 4m-2 11 4-6h-3V4l-4 6h3z"></path>
            <path d="M5 13.5a7.5 7.5 0 0 1 6-7.35v1.02A6.5 6.5 0 1 0 18.98 13h1l.02.5a7.47 7.47 0 0 1-1.85 4.94L23 23.29l-.71.7-4.85-4.84A7.5 7.5 0 0 1 5 13.5"></path>
          </svg>
        </button>
      </div>

      <!-- 2.15 Settings Button (header-toolbar-properties) -->
      <div class="relative shrink-0">
        <button
          id="header-toolbar-properties"
          type="button"
          class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Chart properties"
          @click.stop="showSettingsModal = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="18" height="18" fill="currentColor">
            <path fill-rule="evenodd" d="M18 14a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-1 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
            <path fill-rule="evenodd" d="M8.5 5h11l5 9-5 9h-11l-5-9 5-9Zm-3.86 9L9.1 6h9.82l4.45 8-4.45 8H9.1l-4.45-8Z"></path>
          </svg>
        </button>
      </div>

      <!-- 2.16 Fullscreen Button (header-toolbar-fullscreen) -->
      <div class="relative shrink-0">
        <button
          id="header-toolbar-fullscreen"
          type="button"
          class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Fullscreen mode (Shift + F)"
          @click="toggleFullscreen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="18" height="18" fill="none">
            <path fill="currentColor" d="M7 18.5A2.5 2.5 0 0 0 9.5 21H12v1H9.5A3.5 3.5 0 0 1 6 18.5V16h1zm15 0a3.5 3.5 0 0 1-3.5 3.5H16v-1h2.5a2.5 2.5 0 0 0 2.5-2.5V16h1zM12 7H9.5A2.5 2.5 0 0 0 7 9.5V12H6V9.5A3.5 3.5 0 0 1 9.5 6H12zm6.5-1A3.5 3.5 0 0 1 22 9.5V12h-1V9.5A2.5 2.5 0 0 0 18.5 7H16V6z"></path>
          </svg>
        </button>
      </div>

      <!-- 2.17 Take Snapshot Button (header-toolbar-screenshot) -->
      <div class="relative shrink-0">
        <button
          id="header-toolbar-screenshot"
          type="button"
          class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#151515] transition-colors cursor-pointer"
          title="Take a snapshot"
          @click.stop="takeSnapshot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.118 6a.5.5 0 0 0-.447.276L9.809 8H5.5A1.5 1.5 0 0 0 4 9.5v10A1.5 1.5 0 0 0 5.5 21h16a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 21.5 8h-4.309l-.862-1.724A.5.5 0 0 0 15.882 6h-4.764zm-1.342-.17A1.5 1.5 0 0 1 11.118 5h4.764a1.5 1.5 0 0 1 1.342.83L17.809 7H21.5A2.5 2.5 0 0 1 24 9.5v10a2.5 2.5 0 0 1-2.5 2.5h-16A2.5 2.5 0 0 1 3 19.5v-10A2.5 2.5 0 0 1 5.5 7h3.691l.585-1.17z"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"></path>
          </svg>
        </button>
      </div>

    </div>

    <!-- 3. Fixed Right Action Dock (Always visible, cannot be scrolled off) -->
    <div class="flex items-center gap-1 px-2 shrink-0 h-full ml-auto bg-white dark:bg-[#0d111a] border-l border-[#eef0f4] dark:border-[#1a2232] z-10 transition-colors">
      <!-- 3.1 Theme Toggle (Sun / Moon) -->
      <button
        id="top-toolbar-theme-toggle"
        type="button"
        class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#8b95a5] hover:text-[#000000] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#131823] transition-colors cursor-pointer border border-[#e3e6eb] dark:border-[#1a2232]"
        :title="isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'"
        @click.stop="handleThemeToggle"
      >
        <!-- In Dark mode: show Sun icon with warm yellow to switch to light -->
        <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-amber-400">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
        <!-- In Light mode: show Moon icon to switch to dark -->
        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-800">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <div class="w-px h-4 bg-[#e3e6eb] dark:bg-[#1a2232] mx-0.5 shrink-0"></div>

      <!-- 3.2 Trade Button (Royal Blue button with glowing dot matching screenshot) -->
      <div id="header-toolbar-trade-desktop" class="shrink-0">
        <button
          type="button"
          data-qa-id="trade-button"
          class="h-[26px] px-3 rounded-full bg-[#0072fd] hover:bg-[#005cd0] text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs border border-blue-400/40"
          title="Toggle Instant Trading Dock"
          @click="$emit('toggle:trade')"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          <span>Trade</span>
        </button>
      </div>

      <!-- 3.3 Publish Button -->
      <div id="header-toolbar-publish-desktop" class="shrink-0">
        <button
          type="button"
          class="h-[26px] px-2.5 rounded-[4px] border border-[#e3e6eb] dark:border-[#222222] hover:bg-[#f6f8fb] dark:hover:bg-[#161616] text-[#131722] dark:text-[#d1d4dc] font-medium text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Share your idea with the community"
          @click="publishIdea"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="16" height="16" fill="none">
            <path fill="currentColor" d="M13.502 3c4.683 0 8.5 3.704 8.5 8.3 0 2.595-1.088 4.93-3.002 6.459V21h-2v3h-7v-3H8v-3.186c-1.824-1.555-3-4-3-6.514C5 6.704 8.819 3 13.502 3M11 23h5v-2h-5zm-2-3h9v-2H9zm4.502-16C9.347 4 6 7.28 6 11.3c0 2.194 1.024 4.333 2.593 5.7h9.75c1.684-1.33 2.66-3.379 2.66-5.7 0-4.02-3.346-7.3-7.501-7.3M14 10.5h3.5v1H14V15h-1v-3.5H9.5v-1H13V7h1z"></path>
          </svg>
          <span class="hidden xl:inline">Publish</span>
        </button>
      </div>

      <!-- 3.4 Upgrade Pill Button -->
      <div class="desktopUpgrade shrink-0 pr-1">
        <button
          type="button"
          data-qa-id="upgrade-button"
          class="h-[26px] px-3 rounded-full bg-gradient-to-r from-[#2962ff] to-[#7c3aed] text-white font-bold text-[11px] flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all shadow-xs cursor-pointer"
          title="Upgrade Trading Plan"
          @click="triggerUpgrade"
        >
          <span>Upgrade</span>
        </button>
      </div>
    </div>

    <!-- Modals -->
    <AlertModal :open="showAlertModal" :symbol="currentSymbol" @close="showAlertModal = false" />
    <CommandPaletteModal
      :open="showCommandPalette"
      @close="showCommandPalette = false"
      @select-symbol="sym => $emit('update:symbol', sym)"
      @select-tool="tool => setActiveTool(tool)"
      @open-settings="showSettingsModal = true"
    />
    <SettingsModal :open="showSettingsModal" @close="showSettingsModal = false" />

    <!-- Indicators Modal -->
    <div
      v-if="showIndicatorsModal"
      class="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4"
      @click.self="showIndicatorsModal = false"
    >
      <div class="bg-white dark:bg-[#0a0a0a] rounded-xl shadow-2xl border border-[#e3e6eb] dark:border-[#1a1a1a] w-full max-w-[440px] overflow-hidden transition-colors">
        <div class="px-5 py-3.5 border-b border-[#f0f2f5] dark:border-[#1a1a1a] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-serif italic font-bold text-[#0072fd] dark:text-[#38bdf8] text-base">fx</span>
            <span class="font-bold text-gray-900 dark:text-white text-sm">Indicators & Strategies</span>
          </div>
          <button
            type="button"
            class="w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-[#1f1f1f] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer transition-colors"
            @click="showIndicatorsModal = false"
          >
            ✕
          </button>
        </div>

        <div class="p-3.5 border-b border-[#f0f2f5] dark:border-[#1a1a1a]">
          <input
            v-model="indicatorSearch"
            type="text"
            class="w-full bg-[#f4f6f9] dark:bg-[#121212] border border-[#e3e6eb] dark:border-[#1a1a1a] text-[#212529] dark:text-[#d1d4dc] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0072fd] focus:bg-white dark:focus:bg-[#121212]"
            placeholder="Search indicator (e.g. SMA, RSI, EMA, Bollinger)..."
          />
        </div>

        <div class="max-h-[320px] overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#1a1a1a] px-2 py-1">
          <div
            v-for="ind in filteredIndicators"
            :key="ind.id"
            class="flex items-center justify-between px-3 py-2.5 hover:bg-[#f6f8fb] dark:hover:bg-[#151515] rounded-lg cursor-pointer transition-colors"
            @click="toggleIndicator(ind.id)"
          >
            <div>
              <div class="font-medium text-[#1a1d24] dark:text-[#d1d4dc] text-xs">{{ ind.name }}</div>
              <div class="text-[10px] text-[#8a94a6] dark:text-[#787b86]">{{ ind.desc }}</div>
            </div>
            <div
              class="w-8 h-4 rounded-full transition-colors relative"
              :class="activeIndicators[ind.id] ? 'bg-[#0072fd]' : 'bg-gray-300 dark:bg-[#1a1a1a]'"
            >
              <div
                class="w-3.5 h-3.5 rounded-full bg-white absolute top-[1px] transition-transform shadow-xs"
                :class="activeIndicators[ind.id] ? 'left-[17px]' : 'left-[1px]'"
              ></div>
            </div>
          </div>
        </div>

        <div class="px-5 py-3 bg-[#f8fafc] dark:bg-[#000000] border-t border-[#f0f2f5] dark:border-[#1a1a1a] flex justify-end">
          <button
            type="button"
            class="px-4 py-1.5 bg-[#0072fd] text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            @click="showIndicatorsModal = false"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, reactive, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { SYMBOLS } from '../data/marketData.js';
import { topTickers as liveTopTickers } from '../stores/marketFeed.js';
import { useNotifications } from '../stores/notifications.js';
import { useTheme } from '../composables/useTheme.js';
import { setActiveTool, replayActive } from '../stores/drawings.js';
import AlertModal from './modals/AlertModal.vue';
import CommandPaletteModal from './modals/CommandPaletteModal.vue';
import SettingsModal from './SettingsModal.vue';
import { openScanner } from '../stores/aiScanner.js';

function triggerAiScan() {
  openScanner(props.currentSymbol, props.currentTf);
}

const props = defineProps({
  currentTf:      { type: String, default: '15' },
  currentType:    { type: String, default: 'candles' },
  currentSymbol:  { type: String, default: 'XAUUSD' },
  chartEngine:    { type: String, default: 'xtremenext' },
  watchlistOpen:  { type: Boolean, default: true },
  watchWidth:     { type: Number, default: 280 }
});

const emit = defineEmits([
  'update:tf',
  'update:type',
  'update:symbol',
  'update:engine',
  'toggle:legend',
  'toggle:menu',
  'toggle:trade'
]);

const { isDark, toggleTheme, toggle } = useTheme();
const { notify } = useNotifications();

function showToast(msg) {
  notify({ message: msg, type: 'info', duration: 3000 });
}

function handleThemeToggle() {
  if (typeof toggleTheme === 'function') {
    toggleTheme();
  } else if (typeof toggle === 'function') {
    toggle();
  }
  showToast(`Switched to ${isDark.value ? 'Dark' : 'Light'} Theme`);
}

// 1. Symbol Search State
const showSymbolSearch = ref(false);
const symbolQuery = ref('');
const symbolInputRef = ref(null);

function toggleSymbolSearch() {
  showSymbolSearch.value = !showSymbolSearch.value;
  closeAllDropdowns();
  if (showSymbolSearch.value) {
    nextTick(() => {
      symbolInputRef.value?.focus();
    });
  }
}

const filteredSymbols = computed(() => {
  const q = symbolQuery.value.trim().toUpperCase();
  return Object.keys(SYMBOLS)
    .filter(s => !q || s.includes(q))
    .map(s => ({
      symbol: s,
      exchange: SYMBOLS[s].exchange || 'FX',
      desc: SYMBOLS[s].name || '',
      price: SYMBOLS[s].base || '1.00'
    }))
    .slice(0, 14);
});

function onSelectSymbol(sym) {
  emit('update:symbol', sym);
  showSymbolSearch.value = false;
  symbolQuery.value = '';
  showToast(`Switched to ${sym}`);
}

// 2. Compare Symbols
const showCompareModal = ref(false);
const compareQuery = ref('');

function addCompareSymbol() {
  if (compareQuery.value.trim()) {
    showToast(`Compared ${compareQuery.value.trim().toUpperCase()} on chart`);
    compareQuery.value = '';
    showCompareModal.value = false;
  }
}

// 3. Engine Menu
const showChartMenu = ref(false);

function toggleChartMenu() {
  const cur = showChartMenu.value;
  closeAllDropdowns();
  showChartMenu.value = !cur;
}

function selectEngine(eng) {
  emit('update:engine', eng);
  showChartMenu.value = false;
  showToast(`Switched chart engine to ${eng === 'blacktrader' ? 'BlackTrader' : 'XtremeNext'}`);
}

// 4. Timeframe Menu
const tfMenuOpen = ref(false);

const quickTimeframes = [
  { code: '1', short: '1m' },
  { code: '5', short: '5m' },
  { code: '15', short: '15m' },
  { code: '60', short: '1h' },
  { code: '240', short: '4h' },
  { code: 'D', short: '1D' }
];

const tfCategories = [
  {
    name: 'MINUTES',
    items: [
      { code: '1',  label: '1 minute',   short: '1m' },
      { code: '3',  label: '3 minutes',  short: '3m' },
      { code: '5',  label: '5 minutes',  short: '5m' },
      { code: '15', label: '15 minutes', short: '15m' },
      { code: '30', label: '30 minutes', short: '30m' }
    ]
  },
  {
    name: 'HOURS',
    items: [
      { code: '60',  label: '1 hour',  short: '1h' },
      { code: '120', label: '2 hours', short: '2h' },
      { code: '240', label: '4 hours', short: '4h' }
    ]
  },
  {
    name: 'DAYS',
    items: [
      { code: 'D', label: '1 day',   short: '1D' },
      { code: 'W', label: '1 week',  short: '1W' },
      { code: 'M', label: '1 month', short: '1M' }
    ]
  }
];

const currentTfDisplay = computed(() => {
  const current = String(props.currentTf || '15');
  for (const cat of tfCategories) {
    const found = cat.items.find(it => it.code === current);
    if (found) return found.short;
  }
  return `${current}m`;
});

function toggleTfMenu() {
  const cur = tfMenuOpen.value;
  closeAllDropdowns();
  tfMenuOpen.value = !cur;
}

function selectTf(code) {
  emit('update:tf', code);
  tfMenuOpen.value = false;
  showToast(`Timeframe set to ${code}`);
}

// 5. Chart Styles
const showChartTypeMenu = ref(false);
const chartTypes = [
  { id: 'candles', label: 'Candles' },
  { id: 'bar',     label: 'Bars' },
  { id: 'line',    label: 'Line' },
  { id: 'area',    label: 'Area' }
];

function selectChartType(type) {
  emit('update:type', type);
  showChartTypeMenu.value = false;
  showToast(`Chart style changed to ${type}`);
}

// 6. Indicators
const showIndicatorsModal = ref(false);
const indicatorSearch = ref('');
const indicatorsList = [
  { id: 'sma', name: 'SMA (Simple Moving Average)', desc: '20-period simple moving average trendline' },
  { id: 'ema', name: 'EMA (Exponential Moving Average)', desc: '50-period exponential moving average' },
  { id: 'bb',  name: 'Bollinger Bands', desc: 'Volatility bands with 2.0 standard deviations' },
  { id: 'rsi', name: 'RSI (Relative Strength Index)', desc: 'Momentum oscillator (14 period, 30/70 levels)' },
  { id: 'macd', name: 'MACD (Moving Average Convergence)', desc: '12, 26, 9 MACD histogram and signal line' },
  { id: 'vol', name: 'Volume', desc: 'Volume bars below chart' }
];

const activeIndicators = reactive({
  vol: true,
  sma: false,
  ema: false,
  bb: false,
  rsi: false,
  macd: false
});

const activeIndicatorsCount = computed(() => {
  return Object.values(activeIndicators).filter(Boolean).length;
});

const filteredIndicators = computed(() => {
  const q = indicatorSearch.value.trim().toLowerCase();
  return indicatorsList.filter(i => !q || i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
});

function toggleIndicator(id) {
  activeIndicators[id] = !activeIndicators[id];
  if (id === 'ema' || id === 'sma') {
    window.dispatchEvent(new CustomEvent('xn:toggle-indicators', {
      detail: { visible: activeIndicators.ema || activeIndicators.sma }
    }));
  }
  showToast(`${indicatorsList.find(i => i.id === id)?.name}: ${activeIndicators[id] ? 'Enabled' : 'Disabled'}`);
}

// 7. Templates
const showTemplatesMenu = ref(false);
const templatesList = ['Default', 'Trend Following', 'Oscillators & Momentum', 'Price Action Only', 'Volume Profile'];

function applyTemplate(tpl) {
  showTemplatesMenu.value = false;
  showToast(`Applied indicator template: ${tpl}`);
}

// 8. Alert & Replay
const showAlertModal = ref(false);

function toggleReplay() {
  replayActive.value = !replayActive.value;
  showToast(replayActive.value ? 'Bar replay mode activated' : 'Bar replay mode closed');
}

// 9. Undo & Redo
function triggerUndo() {
  showToast('Undo chart action');
}

function triggerRedo() {
  showToast('Redo chart action');
}

// 10. Layouts
const showLayoutMenu = ref(false);

function selectLayout(layout) {
  showLayoutMenu.value = false;
  showToast(`Multi-chart layout set to ${layout}`);
}

// 11. Save
const showSaveMenu = ref(false);

function saveChartLayout() {
  try {
    localStorage.setItem('xn_chart_layout', JSON.stringify({
      symbol: props.currentSymbol,
      tf: props.currentTf,
      type: props.currentType,
      savedAt: new Date().toISOString()
    }));
  } catch (e) {}
  showSaveMenu.value = false;
  showToast('Chart layout saved successfully');
}

function saveAsCopy() {
  showSaveMenu.value = false;
  showToast('Saved layout copy as "My Analysis (1)"');
}

function renameLayout() {
  showSaveMenu.value = false;
  showToast('Renamed layout');
}

// 12. Quick Search & Settings Modals
const showCommandPalette = ref(false);
const showSettingsModal = ref(false);

// 13. Fullscreen & Snapshot
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.().catch(() => {});
  }
}

function takeSnapshot() {
  showToast('Snapshot copied to clipboard! (Link: https://tradingview.com/x/XAUUSD)');
}

function publishIdea() {
  showToast('Publish idea dialogue opened');
}

function triggerUpgrade() {
  showToast('Opening Pro Plan Upgrade Options');
}

function closeAllDropdowns() {
  showSymbolSearch.value = false;
  showCompareModal.value = false;
  showChartMenu.value = false;
  tfMenuOpen.value = false;
  showChartTypeMenu.value = false;
  showTemplatesMenu.value = false;
  showLayoutMenu.value = false;
  showSaveMenu.value = false;
}

// Global click outside & keydown listener
function handleGlobalClick() {
  closeAllDropdowns();
}

function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    showCommandPalette.value = true;
  } else if (e.altKey && e.key.toLowerCase() === 'a') {
    e.preventDefault();
    showAlertModal.value = true;
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick);
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick);
  window.removeEventListener('keydown', handleKeydown);
});

</script>
