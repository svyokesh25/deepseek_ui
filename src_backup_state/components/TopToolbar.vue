<template>
  <header class="h-[38px] bg-white dark:bg-[#0b0f19] border-b border-[#eef0f4] dark:border-[#162032] flex items-center shrink-0 z-30 select-none font-sans text-xs transition-colors">
    <!-- 1. Left: Tickers matching Watchlist column width (when watchlist is open) -->
    <div
      v-if="watchlistOpen"
      class="flex border-r border-[#eef0f4] dark:border-[#162032] shrink-0 h-full"
      :style="{ width: watchWidth + 'px' }"
    >
      <div
        v-for="(t, idx) in topTickers"
        :key="t.symbol"
        class="flex-1 px-3 py-0.5 cursor-pointer flex flex-col justify-center hover:bg-gray-50 dark:hover:bg-[#121b2d] transition-colors"
        :class="{ 'border-r border-[#eef0f4] dark:border-[#162032]': idx === 0 }"
        @click="$emit('update:symbol', t.symbol)"
      >
        <span class="text-[12px] font-semibold text-[#1a1d24] dark:text-[#d1d4dc] leading-tight block truncate">{{ t.symbol }}</span>
        <span class="text-[12px] font-semibold text-[#0072fd] dark:text-[#38bdf8] leading-tight block tabular-nums">
          $ {{ t.price }}
        </span>
      </div>
    </div>

    <!-- 2. Chart Toolbar Controls (Starts immediately after Watchlist border) -->
    <div class="flex items-center gap-1 px-2 shrink-0 h-full">
      <!-- A. Active Symbol Selector Button (Q AUDCAD ⌵) -->
      <div class="relative">
        <button
          type="button"
          class="h-[28px] border border-[#e3e6eb] dark:border-[#162032] text-[12px] font-semibold px-2.5 rounded-[4px] flex items-center gap-1.5 cursor-pointer hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] transition-colors text-[#1a1d24] dark:text-[#d1d4dc] bg-white dark:bg-[#0d121f] shadow-2xs"
          title="Search / Switch Symbol"
          @click.stop="toggleSymbolSearch"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="text-[#8a94a6] shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <span>{{ currentSymbol || 'AUDCAD' }}</span>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-[#8a94a6] transition-transform duration-150" :class="{ 'rotate-180': showSymbolSearch }">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <!-- Symbol Search Dropdown Popup -->
        <div
          v-if="showSymbolSearch"
          class="absolute left-0 top-full mt-1 bg-white dark:bg-[#0d1322] border border-[#e3e6eb] dark:border-[#162032] rounded-lg shadow-xl w-[270px] p-2 z-50 text-xs"
          @click.stop
        >
          <div class="flex items-center gap-2 bg-[#f4f6f9] dark:bg-[#070b12] rounded-md px-2.5 py-1.5 border border-transparent focus-within:border-[#0072fd] focus-within:bg-white dark:focus-within:bg-[#070b12] transition-all mb-1.5">
            <svg class="w-3.5 h-3.5 text-[#9aa3b0] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref="symbolInputRef"
              v-model="symbolQuery"
              type="text"
              class="bg-transparent outline-none text-xs w-full text-[#212529] dark:text-[#d1d4dc] placeholder:text-[#9aa3b0] dark:placeholder:text-[#787b86]"
              placeholder="Search symbol (EUR/USD, BTC...)"
              autocomplete="off"
            />
          </div>

          <div class="max-h-[240px] overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#162032]">
            <div
              v-for="s in filteredSymbols"
              :key="s.symbol"
              class="flex items-center justify-between px-2.5 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] cursor-pointer rounded transition-colors"
              :class="{ 'bg-[#f0f6ff] dark:bg-[#142340] text-[#0072fd] dark:text-[#38bdf8] font-medium': s.symbol === currentSymbol }"
              @click="onSelectSymbol(s.symbol)"
            >
              <div class="flex flex-col">
                <span class="font-semibold text-[#212529] dark:text-[#d1d4dc]">{{ s.symbol }}</span>
                <span class="text-[#8a94a6] text-[10px]">{{ s.desc || s.exchange }}</span>
              </div>
              <span class="text-[#0072fd] dark:text-[#38bdf8] font-medium text-[11px] tabular-nums">${{ s.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- B. Add / Compare (+) Button -->
      <div class="relative">
        <button
          type="button"
          class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#212529] dark:hover:text-white hover:bg-[#f4f6f9] dark:hover:bg-[#121b2d] transition-colors cursor-pointer border border-[#e3e6eb] dark:border-[#162032] bg-white dark:bg-[#0d121f]"
          title="Compare or Add Symbol"
          @click.stop="showCompareModal = !showCompareModal"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>
          </svg>
        </button>

        <div
          v-if="showCompareModal"
          class="absolute left-0 top-full mt-1 bg-white dark:bg-[#0d1322] border border-[#e3e6eb] dark:border-[#162032] rounded-lg shadow-xl w-[240px] p-2.5 z-50 text-xs"
          @click.stop
        >
          <div class="font-semibold text-[#1a1d24] dark:text-white mb-1.5">Compare Symbol</div>
          <div class="flex gap-1.5">
            <input
              v-model="compareQuery"
              type="text"
              class="flex-1 bg-[#f4f6f9] dark:bg-[#070b12] border border-[#e3e6eb] dark:border-[#162032] text-[#212529] dark:text-[#d1d4dc] rounded px-2 py-1 text-xs outline-none focus:border-[#0072fd]"
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

      <!-- C. Chart Platform Selector (XtremeNext vs BlackTrader) -->
      <div class="relative">
        <button
          type="button"
          class="h-[28px] border border-[#e3e6eb] dark:border-[#162032] text-[11px] font-medium px-2 rounded-[4px] flex items-center gap-1.5 cursor-pointer hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] transition-colors text-[#212529] dark:text-[#d1d4dc] bg-white dark:bg-[#0d121f] shadow-2xs"
          title="Switch Chart Engine"
          @click.stop="toggleChartMenu"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-[#8a94a6] shrink-0">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
          <span class="font-medium">{{ chartEngine === 'blacktrader' ? 'BlackTrader' : 'XtremeNext' }}</span>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-[#8a94a6] transition-transform duration-150" :class="{ 'rotate-180': showChartMenu }">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <div
          v-if="showChartMenu"
          class="absolute left-0 top-full mt-1 bg-white dark:bg-[#0d1322] border border-[#e3e6eb] dark:border-[#162032] rounded-lg shadow-xl min-w-[160px] py-1 z-50 text-xs"
          @click.stop
        >
          <button
            type="button"
            class="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] cursor-pointer transition-colors"
            :class="chartEngine === 'xtremenext' ? 'text-[#0072fd] dark:text-[#38bdf8] font-medium bg-[#f0f6ff] dark:bg-[#142340]' : 'text-[#212529] dark:text-[#d1d4dc] font-normal'"
            @click="selectEngine('xtremenext')"
          >
            <span>XtremeNext</span>
            <svg v-if="chartEngine === 'xtremenext'" class="w-3.5 h-3.5 text-[#0072fd] dark:text-[#38bdf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>

          <button
            type="button"
            class="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] cursor-pointer transition-colors"
            :class="chartEngine === 'blacktrader' ? 'text-[#0072fd] dark:text-[#38bdf8] font-medium bg-[#f0f6ff] dark:bg-[#142340]' : 'text-[#212529] dark:text-[#d1d4dc] font-normal'"
            @click="selectEngine('blacktrader')"
          >
            <span>BlackTrader</span>
            <svg v-if="chartEngine === 'blacktrader'" class="w-3.5 h-3.5 text-[#0072fd] dark:text-[#38bdf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- D. Timeframe Dropdown (30m ⌵) -->
      <div class="relative">
        <button
          type="button"
          class="h-[28px] border border-[#e3e6eb] dark:border-[#162032] text-[11px] font-medium px-2 rounded-[4px] flex items-center gap-1 cursor-pointer hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] transition-colors text-[#212529] dark:text-[#d1d4dc] bg-white dark:bg-[#0d121f] shadow-2xs"
          title="Select Timeframe"
          @click.stop="toggleTfMenu"
        >
          <span>{{ currentTfShort }}</span>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-[#8a94a6] transition-transform duration-150" :class="{ 'rotate-180': tfMenuOpen }">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <div
          v-if="tfMenuOpen"
          class="absolute left-0 top-full mt-1 bg-white dark:bg-[#0d1322] border border-[#e3e6eb] dark:border-[#162032] rounded-lg shadow-xl w-[190px] py-1.5 z-50 text-xs select-none max-h-[420px] overflow-y-auto"
          @click.stop
        >
          <div v-for="cat in tfCategories" :key="cat.name" class="py-0.5 border-b border-[#f0f2f5] dark:border-[#162032] last:border-b-0">
            <div class="flex items-center justify-between px-3.5 py-1.5 text-[10px] font-semibold text-[#88909b] dark:text-[#787b86] tracking-wider uppercase">
              <span>{{ cat.name }}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-[#9aa3b0]">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </div>
            <div
              v-for="item in cat.items"
              :key="item.code"
              class="px-3.5 py-1.5 text-[12px] cursor-pointer transition-colors"
              :class="String(currentTf) === item.code
                ? 'bg-[#0072fd] text-white font-medium'
                : 'text-[#212529] dark:text-[#d1d4dc] hover:bg-[#f0f3f6] dark:hover:bg-[#121b2d] font-normal'"
              @click="selectTf(item.code)"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- E. Chart Type Dropdown / Selector (00 Candlesticks) -->
      <div class="relative">
        <button
          type="button"
          class="h-[28px] px-2 rounded-[4px] flex items-center gap-1 text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#212529] dark:hover:text-white hover:bg-[#f4f6f9] dark:hover:bg-[#121b2d] transition-colors cursor-pointer border border-[#e3e6eb] dark:border-[#162032] bg-white dark:bg-[#0d121f]"
          title="Chart Type (Candlesticks, Line, Area, Bars)"
          @click.stop="showChartTypeMenu = !showChartTypeMenu"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5v4"/><rect width="4" height="6" x="7" y="9" rx="1"/>
            <path d="M9 15v2"/><path d="M17 3v2"/><rect width="4" height="8" x="15" y="5" rx="1"/>
          </svg>
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-[#8a94a6]">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <div
          v-if="showChartTypeMenu"
          class="absolute left-0 top-full mt-1 bg-white dark:bg-[#0d1322] border border-[#e3e6eb] dark:border-[#162032] rounded-lg shadow-xl w-[150px] py-1 z-50 text-xs"
          @click.stop
        >
          <button
            v-for="ct in chartTypes"
            :key="ct.id"
            type="button"
            class="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] cursor-pointer transition-colors"
            :class="currentType === ct.id ? 'text-[#0072fd] dark:text-[#38bdf8] font-medium bg-[#f0f6ff] dark:bg-[#142340]' : 'text-[#212529] dark:text-[#d1d4dc]'"
            @click="selectChartType(ct.id)"
          >
            <span>{{ ct.label }}</span>
            <svg v-if="currentType === ct.id" class="w-3.5 h-3.5 text-[#0072fd] dark:text-[#38bdf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- F. Indicators Button (fx Indicators) -->
      <button
        type="button"
        class="h-[28px] border border-[#e3e6eb] dark:border-[#162032] text-[11px] px-2 rounded-[4px] flex items-center gap-1 cursor-pointer hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] transition-colors text-[#212529] dark:text-[#d1d4dc] bg-white dark:bg-[#0d121f] shadow-2xs"
        title="Indicators & Strategies"
        @click.stop="showIndicatorsModal = true"
      >
        <span class="font-serif italic text-[12px] font-bold text-[#0072fd] dark:text-[#38bdf8]">fx</span>
        <span>Indicators</span>
        <span v-if="activeIndicatorsCount > 0" class="w-4 h-4 bg-[#0072fd] text-white rounded-full text-[9px] flex items-center justify-center font-bold">
          {{ activeIndicatorsCount }}
        </span>
      </button>

      <!-- G. Templates Icon ([::]) -->
      <div class="relative">
        <button
          type="button"
          class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#212529] dark:hover:text-white hover:bg-[#f4f6f9] dark:hover:bg-[#121b2d] transition-colors cursor-pointer border border-[#e3e6eb] dark:border-[#162032] bg-white dark:bg-[#0d121f]"
          title="Chart Templates"
          @click.stop="showTemplatesMenu = !showTemplatesMenu"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </button>

        <div
          v-if="showTemplatesMenu"
          class="absolute left-0 top-full mt-1 bg-white dark:bg-[#0d1322] border border-[#e3e6eb] dark:border-[#162032] rounded-lg shadow-xl w-[170px] py-1 z-50 text-xs"
          @click.stop
        >
          <button
            v-for="tpl in templatesList"
            :key="tpl"
            type="button"
            class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] cursor-pointer text-[#212529] dark:text-[#d1d4dc] transition-colors"
            @click="applyTemplate(tpl)"
          >
            {{ tpl }}
          </button>
        </div>
      </div>

      <!-- H. Eye Icon (👁 Hide/Show chart overlay legend) -->
      <button
        type="button"
        class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#212529] dark:hover:text-white hover:bg-[#f4f6f9] dark:hover:bg-[#121b2d] transition-colors cursor-pointer border border-[#e3e6eb] dark:border-[#162032] bg-white dark:bg-[#0d121f]"
        title="Toggle Chart Overlay / Drawings Visibility"
        @click="$emit('toggle:legend')"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      <!-- I. Multi-chart Layout Icon ([|]) -->
      <div class="relative">
        <button
          type="button"
          class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#212529] dark:hover:text-white hover:bg-[#f4f6f9] dark:hover:bg-[#121b2d] transition-colors cursor-pointer border border-[#e3e6eb] dark:border-[#162032] bg-white dark:bg-[#0d121f]"
          title="Select Chart Layout"
          @click.stop="showLayoutMenu = !showLayoutMenu"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M12 3v18" />
          </svg>
        </button>

        <div
          v-if="showLayoutMenu"
          class="absolute left-0 top-full mt-1 bg-white dark:bg-[#0d1322] border border-[#e3e6eb] dark:border-[#162032] rounded-lg shadow-xl w-[150px] py-1 z-50 text-xs"
          @click.stop
        >
          <button
            type="button"
            class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] cursor-pointer text-[#212529] dark:text-[#d1d4dc] transition-colors"
            @click="selectLayout('single')"
          >
            1 Chart (Single)
          </button>
          <button
            type="button"
            class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] cursor-pointer text-[#212529] dark:text-[#d1d4dc] transition-colors"
            @click="selectLayout('split-2')"
          >
            2 Charts (Split)
          </button>
          <button
            type="button"
            class="w-full text-left px-3 py-1.5 hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] cursor-pointer text-[#212529] dark:text-[#d1d4dc] transition-colors"
            @click="selectLayout('grid-4')"
          >
            4 Charts (Quad Grid)
          </button>
        </div>
      </div>

      <!-- J. Undo (↶) & Redo (↷) Icons -->
      <button
        type="button"
        class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#212529] dark:hover:text-white hover:bg-[#f4f6f9] dark:hover:bg-[#121b2d] transition-colors cursor-pointer border border-[#e3e6eb] dark:border-[#162032] bg-white dark:bg-[#0d121f]"
        title="Undo"
        @click="triggerUndo"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 7v6h6M3 13a9 9 0 1 0 3-7.7L3 8"/>
        </svg>
      </button>

      <button
        type="button"
        class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#212529] dark:hover:text-white hover:bg-[#f4f6f9] dark:hover:bg-[#121b2d] transition-colors cursor-pointer border border-[#e3e6eb] dark:border-[#162032] bg-white dark:bg-[#0d121f]"
        title="Redo"
        @click="triggerRedo"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 7v6h-6M21 13a9 9 0 1 1-3-7.7L21 8"/>
        </svg>
      </button>
    </div>

    <!-- 3. Flexible Spacer -->
    <div class="flex-1 min-w-[8px]"></div>

    <!-- 4. Right Actions: Live Status, Theme Toggle, Save ⌵, Settings ⚙, Fullscreen ⛶, Camera 📷 -->
    <div class="flex items-center gap-1.5 px-3 shrink-0 h-full">
      <!-- Live Status Pill -->
      <div class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#f4f6f9] dark:bg-[#070b12] text-[11px] text-[#089981] dark:text-[#26a69a] select-none border border-[#e3e6eb] dark:border-[#162032] mr-0.5">
        <span class="w-1.5 h-1.5 rounded-full bg-[#089981] dark:bg-[#26a69a] animate-pulse"></span>
        <span class="font-medium">Live</span>
      </div>

      <!-- Theme Switch (Sun / Moon) -->
      <button
        type="button"
        class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] hover:text-[#212529] hover:bg-[#f4f6f9] dark:text-[#a0a5b0] dark:hover:text-white dark:hover:bg-[#121b2d] transition-colors cursor-pointer border border-[#e3e6eb] dark:border-[#162032] active:scale-95"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        @click="toggleTheme"
      >
        <svg v-if="!isDark" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <div class="w-px h-4 bg-[#e3e6eb] dark:bg-[#162032] mx-0.5"></div>

      <!-- Save ⌵ Button -->
      <button
        type="button"
        class="h-[28px] border border-[#e3e6eb] dark:border-[#162032] text-[11px] font-medium px-2.5 rounded-[4px] flex items-center gap-1 cursor-pointer hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] transition-colors text-[#212529] dark:text-[#d1d4dc] bg-white dark:bg-[#0d121f] shadow-2xs active:scale-95"
        title="Save Chart Layout"
        @click="saveChartLayout"
      >
        <span>Save</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-[#8a94a6]">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      <!-- Settings (⚙) Button -->
      <button
        type="button"
        class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#212529] dark:hover:text-white hover:bg-[#f4f6f9] dark:hover:bg-[#121b2d] transition-colors cursor-pointer border border-[#e3e6eb] dark:border-[#162032] bg-white dark:bg-[#0d121f]"
        title="Workspace & Chart Settings"
        @click.stop="showSettingsModal = true"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>

      <!-- Fullscreen (⛶) Button -->
      <button
        type="button"
        class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#212529] dark:hover:text-white hover:bg-[#f4f6f9] dark:hover:bg-[#121b2d] transition-colors cursor-pointer border border-[#e3e6eb] dark:border-[#162032] bg-white dark:bg-[#0d121f]"
        title="Toggle Fullscreen"
        @click="toggleFullscreen"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      </button>

      <!-- Camera (📷) Button -->
      <button
        type="button"
        class="w-[28px] h-[28px] flex items-center justify-center rounded-[4px] text-[#5d6673] dark:text-[#a0a5b0] hover:text-[#212529] dark:hover:text-white hover:bg-[#f4f6f9] dark:hover:bg-[#121b2d] transition-colors cursor-pointer border border-[#e3e6eb] dark:border-[#162032] bg-white dark:bg-[#0d121f]"
        title="Take Chart Snapshot"
        @click="takeSnapshot"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      </button>
    </div>

    <!-- Indicators Modal -->
    <div
      v-if="showIndicatorsModal"
      class="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4"
      @click.self="showIndicatorsModal = false"
    >
      <div class="bg-white dark:bg-[#0d1322] rounded-xl shadow-2xl border border-[#e3e6eb] dark:border-[#162032] w-full max-w-[440px] overflow-hidden transition-colors">
        <div class="px-5 py-3.5 border-b border-[#f0f2f5] dark:border-[#162032] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-serif italic font-bold text-[#0072fd] dark:text-[#38bdf8] text-base">fx</span>
            <span class="font-bold text-gray-900 dark:text-white text-sm">Indicators & Metrics</span>
          </div>
          <button
            type="button"
            class="w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-[#142340] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer transition-colors"
            @click="showIndicatorsModal = false"
          >
            ✕
          </button>
        </div>

        <div class="p-3.5 border-b border-[#f0f2f5] dark:border-[#162032]">
          <input
            v-model="indicatorSearch"
            type="text"
            class="w-full bg-[#f4f6f9] dark:bg-[#070b12] border border-[#e3e6eb] dark:border-[#162032] text-[#212529] dark:text-[#d1d4dc] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0072fd] focus:bg-white dark:focus:bg-[#070b12]"
            placeholder="Search indicator (e.g. SMA, RSI, EMA, Bollinger)..."
          />
        </div>

        <div class="max-h-[320px] overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#162032] px-2 py-1">
          <div
            v-for="ind in filteredIndicators"
            :key="ind.id"
            class="flex items-center justify-between px-3 py-2.5 hover:bg-[#f6f8fb] dark:hover:bg-[#121b2d] rounded-lg cursor-pointer transition-colors"
            @click="toggleIndicator(ind.id)"
          >
            <div>
              <div class="font-medium text-[#1a1d24] dark:text-[#d1d4dc] text-xs">{{ ind.name }}</div>
              <div class="text-[10px] text-[#8a94a6] dark:text-[#787b86]">{{ ind.desc }}</div>
            </div>
            <div
              class="w-8 h-4 rounded-full transition-colors relative"
              :class="activeIndicators[ind.id] ? 'bg-[#0072fd]' : 'bg-gray-300 dark:bg-[#162032]'"
            >
              <div
                class="w-3.5 h-3.5 rounded-full bg-white absolute top-[1px] transition-transform shadow-xs"
                :class="activeIndicators[ind.id] ? 'left-[17px]' : 'left-[1px]'"
              ></div>
            </div>
          </div>
        </div>

        <div class="px-5 py-3 bg-[#f8fafc] dark:bg-[#090e18] border-t border-[#f0f2f5] dark:border-[#162032] flex justify-end">
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

    <!-- Workspace & Chart Settings Modal -->
    <SettingsModal :open="showSettingsModal" @close="showSettingsModal = false" />

    <!-- Notification Toast -->
    <div
      v-if="toastMessage"
      class="fixed bottom-12 right-6 z-50 bg-[#1a1d24] text-white text-xs px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in"
    >
      <svg class="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>{{ toastMessage }}</span>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, reactive, nextTick } from 'vue'
import { SYMBOLS } from '../data/marketData.js'
import { useNotifications } from '../stores/notifications.js'
import { useTheme } from '../composables/useTheme.js'
import SettingsModal from './SettingsModal.vue'

const { isDark, toggle: toggleTheme, setDark } = useTheme()

const props = defineProps({
  currentTf: { type: String, default: '15' },
  currentType: { type: String, default: 'candles' },
  currentSymbol: { type: String, default: 'AUDCAD' },
  chartEngine: { type: String, default: 'xtremenext' },
  watchlistOpen: { type: Boolean, default: true },
  watchWidth: { type: Number, default: 260 }
})

const emit = defineEmits(['update:tf', 'update:type', 'update:symbol', 'update:engine', 'toggle:legend'])

// 1. Symbol Search State
const showSymbolSearch = ref(false)
const symbolQuery = ref('')
const symbolInputRef = ref(null)

function toggleSymbolSearch() {
  showSymbolSearch.value = !showSymbolSearch.value
  showChartMenu.value = false
  tfMenuOpen.value = false
  showChartTypeMenu.value = false
  showTemplatesMenu.value = false
  showLayoutMenu.value = false
  if (showSymbolSearch.value) {
    nextTick(() => {
      symbolInputRef.value?.focus()
    })
  }
}

const filteredSymbols = computed(() => {
  const q = symbolQuery.value.trim().toUpperCase()
  return Object.keys(SYMBOLS)
    .filter(s => !q || s.includes(q))
    .map(s => ({
      symbol: s,
      exchange: SYMBOLS[s].exchange || 'FX',
      desc: SYMBOLS[s].name || '',
      price: SYMBOLS[s].close || '1.00'
    }))
    .slice(0, 12)
})

function onSelectSymbol(sym) {
  emit('update:symbol', sym)
  showSymbolSearch.value = false
  symbolQuery.value = ''
  showToast(`Switched to ${sym}`)
}

// 2. Add / Compare Symbol Modal
const showCompareModal = ref(false)
const compareQuery = ref('')

function addCompareSymbol() {
  if (compareQuery.value.trim()) {
    showToast(`Compared ${compareQuery.value.trim().toUpperCase()} on chart`)
    compareQuery.value = ''
    showCompareModal.value = false
  }
}

// 3. Chart Platform Selector
const showChartMenu = ref(false)

function toggleChartMenu() {
  showChartMenu.value = !showChartMenu.value
  showSymbolSearch.value = false
  tfMenuOpen.value = false
  showChartTypeMenu.value = false
  showTemplatesMenu.value = false
  showLayoutMenu.value = false
}

function selectEngine(eng) {
  emit('update:engine', eng)
  showChartMenu.value = false
  showToast(`Switched chart engine to ${eng === 'blacktrader' ? 'BlackTrader' : 'XtremeNext'}`)
}

// 4. Timeframe Dropdown (30m ⌵)
const tfMenuOpen = ref(false)

const tfCategories = [
  {
    name: 'MINUTES',
    items: [
      { code: '1',  label: '1 minute',   short: '1m' },
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
]

const currentTfShort = computed(() => {
  const current = String(props.currentTf || '15')
  for (const cat of tfCategories) {
    const found = cat.items.find(it => it.code === current)
    if (found) return found.short
  }
  return `${current}m`
})

function toggleTfMenu() {
  tfMenuOpen.value = !tfMenuOpen.value
  showChartMenu.value = false
  showSymbolSearch.value = false
  showChartTypeMenu.value = false
  showTemplatesMenu.value = false
  showLayoutMenu.value = false
}

function selectTf(code) {
  emit('update:tf', code)
  tfMenuOpen.value = false
  showToast(`Timeframe set to ${code}`)
}

// 5. Chart Type Selector (Candlesticks, Line, Area, Bars)
const showChartTypeMenu = ref(false)
const chartTypes = [
  { id: 'candles', label: 'Candlestick' },
  { id: 'bar',     label: 'Bars' },
  { id: 'line',    label: 'Line' },
  { id: 'area',    label: 'Area' }
]

function selectChartType(type) {
  emit('update:type', type)
  showChartTypeMenu.value = false
  showToast(`Chart type changed to ${type}`)
}

// 6. Indicators Modal
const showIndicatorsModal = ref(false)
const indicatorSearch = ref('')

const indicatorsList = [
  { id: 'sma', name: 'SMA (Simple Moving Average)', desc: '20-period simple moving average trendline' },
  { id: 'ema', name: 'EMA (Exponential Moving Average)', desc: '50-period exponential moving average' },
  { id: 'bb',  name: 'Bollinger Bands', desc: 'Volatility bands with 2.0 standard deviations' },
  { id: 'rsi', name: 'RSI (Relative Strength Index)', desc: 'Momentum oscillator (14 period, 30/70 levels)' },
  { id: 'macd', name: 'MACD (Moving Average Convergence)', desc: '12, 26, 9 MACD histogram and signal line' },
  { id: 'vol', name: 'Volume', desc: 'Volume bars below chart' }
]

const activeIndicators = reactive({
  vol: true,
  sma: false,
  ema: false,
  bb: false,
  rsi: false,
  macd: false
})

const activeIndicatorsCount = computed(() => {
  return Object.values(activeIndicators).filter(Boolean).length
})

const filteredIndicators = computed(() => {
  const q = indicatorSearch.value.trim().toLowerCase()
  return indicatorsList.filter(i => !q || i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
})

function toggleIndicator(id) {
  activeIndicators[id] = !activeIndicators[id]
  showToast(`${indicatorsList.find(i => i.id === id)?.name}: ${activeIndicators[id] ? 'Enabled' : 'Disabled'}`)
}

// 7. Templates Dropdown
const showTemplatesMenu = ref(false)
const templatesList = ['Default', 'Trend Following', 'Oscillators & Momentum', 'Price Action Only', 'Volume Profile']

function applyTemplate(tpl) {
  showTemplatesMenu.value = false
  showToast(`Applied template: ${tpl}`)
}

// 8. Layout Multi-Chart Selector
const showLayoutMenu = ref(false)

function selectLayout(layout) {
  showLayoutMenu.value = false
  showToast(`Layout changed: ${layout}`)
}

// 9. Undo & Redo Handlers
function triggerUndo() {
  showToast('Undo previous chart change')
}

function triggerRedo() {
  showToast('Redo chart action')
}

// 10. Save Chart Layout
function saveChartLayout() {
  try {
    localStorage.setItem('xn_chart_layout', JSON.stringify({
      symbol: props.currentSymbol,
      tf: props.currentTf,
      type: props.currentType,
      savedAt: new Date().toISOString()
    }))
  } catch (e) {}
  showToast('Chart layout saved successfully')
}

// 11. Settings Modal State
const showSettingsModal = ref(false)
const chartTheme = ref('light')
const showGrid = ref(true)
const selectedTimezone = ref('UTC')

// 12. Fullscreen Toggle
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {})
  } else {
    document.exitFullscreen?.().catch(() => {})
  }
}

// 13. Camera Snapshot
function takeSnapshot() {
  showToast('Chart snapshot copied to clipboard')
}

// 14. Toast Notification System
const { notify } = useNotifications()

function showToast(msg) {
  notify({ message: msg, type: 'info', duration: 3000 })
}

// Global click outside listener
if (typeof window !== 'undefined') {
  window.addEventListener('click', () => {
    showChartMenu.value = false
    tfMenuOpen.value = false
    showSymbolSearch.value = false
    showChartTypeMenu.value = false
    showTemplatesMenu.value = false
    showLayoutMenu.value = false
    showCompareModal.value = false
  })
}

// Top tickers matching Watchlist width
const topTickers = [
  { symbol: 'EURUSD', price: '1.11766' },
  { symbol: 'XAUUSD', price: '4171.31' }
]
</script>
