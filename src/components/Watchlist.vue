<template>
  <div
    class="flex flex-col bg-white dark:bg-[#0d111a] border-r border-[#e0e3eb] dark:border-[#1e2433] select-none relative font-sans transition-colors shrink-0 text-[#131722] dark:text-[#d6dae3] min-h-0 h-full overflow-hidden"
    :style="{ width: (width || 280) + 'px' }"
  >
    <!-- 1. Refined Header Bar -->
    <div class="h-[40px] min-h-[40px] px-2.5 border-b border-[#e0e3eb] dark:border-[#1e2433] flex items-center justify-between bg-white dark:bg-[#0d111a] shrink-0 gap-1.5 transition-colors">
      <!-- Title, Live Counter Pill, and Connection Status -->
      <div class="flex items-center space-x-1.5 min-w-0">
        <!-- Layers Icon in rounded box -->
        <div class="w-5 h-5 rounded-[4px] bg-[#2962ff]/10 text-[#2962ff] dark:bg-[#2962ff]/20 dark:text-[#5383ff] flex items-center justify-center font-bold shrink-0">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        
        <!-- Header Title: Watchlist with green star badge -->
        <span class="font-extrabold text-[12.5px] tracking-tight text-[#131722] dark:text-white shrink-0 flex items-center gap-1.5">
          Watchlist
          <span class="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[9px] leading-none font-bold">★</span>
        </span>

        <!-- Count Pill (e.g. 23) -->
        <span class="text-[9.5px] font-bold px-1.5 py-0.2 rounded-full bg-[#f0f3fa] dark:bg-[#1a2130] text-[#787b86] dark:text-[#929bad] tabular-nums shrink-0">
          {{ totalMatchingCount }}
        </span>

        <!-- Feed Connection Status Pill (Capsule with green pulsating dot matching screenshot) -->
        <div
          class="w-6 h-3.5 rounded-full bg-[#dcfce7] border border-[#86efac] dark:bg-[#052e16] dark:border-[#166534] flex items-center justify-center shrink-0 transition-colors"
          title="Market Data Feed: Connected & Live"
        >
          <span class="relative flex h-1.5 w-1.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
        </div>
      </div>

      <!-- Header Controls: Heatmap Toggle, Add Symbol (+), Collapse (>>) -->
      <div class="flex items-center space-x-0.5 text-[#787b86] dark:text-[#929bad] shrink-0">
        <!-- Heatmap Toggle Button -->
        <button
          type="button"
          @click="watchlistMode = watchlistMode === 'list' ? 'heatmap' : 'list'"
          class="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-[#f0f3fa] dark:hover:bg-[#1a2130] transition-colors cursor-pointer"
          :class="watchlistMode === 'heatmap' ? 'text-[#0072fd] dark:text-[#38bdf8] font-bold' : 'text-[#787b86] dark:text-[#929bad]'"
          :title="watchlistMode === 'list' ? 'Switch to Market Heatmap View' : 'Switch to Standard List View'"
        >
          <svg v-if="watchlistMode === 'list'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
          <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>

        <button
          type="button"
          @click="showAddModal = true"
          class="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-[#f0f3fa] dark:hover:bg-[#1a2130] hover:text-[#131722] dark:hover:text-white transition-colors cursor-pointer"
          title="Add symbol / Search catalog"
          aria-label="Add symbol"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <button
          type="button"
          @click="$emit('close')"
          class="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-[#f0f3fa] dark:hover:bg-[#1a2130] hover:text-[#f23645] transition-colors cursor-pointer"
          title="Collapse Market Watch panel"
          aria-label="Collapse panel"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 2. Multiple Watchlists Bar -->
    <div class="px-2 py-1 bg-[#f8f9fd] dark:bg-[#0d111a] border-b border-[#e0e3eb] dark:border-[#1a2232] flex items-center space-x-1 overflow-x-auto text-[11px] font-semibold shrink-0 no-scrollbar transition-colors">
      <button
        v-for="wl in watchlists"
        :key="wl.id"
        type="button"
        @click="selectWatchlist(wl)"
        class="px-2 py-0.5 rounded-[4px] transition-all cursor-pointer whitespace-nowrap text-[11px]"
        :class="activeWatchlistId === wl.id 
          ? 'bg-white dark:bg-[#141f32] text-[#0072fd] dark:text-[#38bdf8] font-bold shadow-2xs border border-[#d1d4dc] dark:border-[#2a3c5a]' 
          : 'text-[#606266] dark:text-[#8b95a5] hover:bg-[#eef2f8] dark:hover:bg-[#131823] hover:text-[#131722] dark:hover:text-white'"
      >
        {{ wl.name }}
      </button>

      <!-- Add Watchlist Input or Button -->
      <div v-if="isNewWatchlistInput" class="flex items-center space-x-1 shrink-0">
        <input 
          v-model="newWatchlistName"
          @keyup.enter="handleAddWatchlist"
          @keyup.esc="isNewWatchlistInput = false"
          @blur="handleAddWatchlist"
          placeholder="New list..."
          class="w-20 bg-white dark:bg-[#131823] border border-[#0072fd] text-[10.5px] px-1.5 py-0.5 rounded-[3px] focus:outline-none text-[#131722] dark:text-white"
          autofocus
        />
        <button type="button" @click="handleAddWatchlist" class="text-[#0072fd] text-[10.5px] font-bold cursor-pointer">✓</button>
      </div>
      <button
        v-else
        type="button"
        @click="isNewWatchlistInput = true"
        class="p-0.5 rounded text-[#787b86] dark:text-[#8b95a5] hover:bg-[#e0e3eb] dark:hover:bg-[#131823] hover:text-[#131722] dark:hover:text-white transition-colors cursor-pointer"
        title="Create new watchlist"
        aria-label="Create new watchlist"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>

    <!-- 3. Integrated Fast Search Bar -->
    <div class="px-2 py-1.5 border-b border-[#e0e3eb] dark:border-[#1a2232] bg-white dark:bg-[#0d111a] flex items-center shrink-0 transition-colors">
      <div class="relative flex-1 flex items-center">
        <svg class="w-3.5 h-3.5 text-[#787b86] dark:text-[#5a6578] absolute left-2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter symbols or name..."
          class="w-full bg-[#f4f5f8] dark:bg-[#131823] text-[#131722] dark:text-white placeholder-[#787b86] dark:placeholder-[#5a6578] text-[11px] rounded-[4px] pl-7 pr-5 py-1 focus:outline-none focus:ring-1 focus:ring-[#0072fd] transition-all border border-[#e0e3eb] dark:border-[#1a2232] focus:bg-white dark:focus:bg-[#131823]"
        />
        <button
          v-if="searchQuery"
          type="button"
          @click="searchQuery = ''"
          class="absolute right-1.5 text-[#787b86] hover:text-[#131722] dark:text-[#a0a5b0] dark:hover:text-white cursor-pointer"
          title="Clear search"
          aria-label="Clear search"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 4. Category Filter Chips (With Left and Right Scroll Arrows) -->
    <div class="relative border-b border-[#e0e3eb] dark:border-[#1e2433] bg-white dark:bg-[#0d111a] overflow-hidden shrink-0 transition-colors">
      <!-- Left Arrow Indicator -->
      <div
        v-show="canScrollLeft"
        class="absolute left-0 top-0 bottom-0 flex items-center pl-0.5 pr-2 bg-gradient-to-r from-white via-white/95 to-transparent dark:from-[#0d111a] dark:via-[#0d111a]/95 dark:to-transparent z-10 pointer-events-none transition-opacity duration-200"
      >
        <button
          type="button"
          @click="scrollCategoriesLeft"
          class="h-4 w-4 rounded-full bg-white dark:bg-[#1a2130] border border-[#d1d4dc] dark:border-[#2e374d] flex items-center justify-center text-[#131722] dark:text-white hover:text-[#0072fd] dark:hover:text-[#38bdf8] shadow-xs cursor-pointer pointer-events-auto"
          aria-label="Scroll categories left"
          title="Previous categories"
        >
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      </div>

      <!-- Categories Container -->
      <div
        ref="categoryContainerRef"
        class="px-2 py-1 flex items-center space-x-1 overflow-x-auto text-[10px] font-semibold text-[#787b86] dark:text-[#929bad] shrink-0 no-scrollbar scroll-smooth"
      >
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="selectCategory(cat, $event)"
          class="px-2 py-0.5 rounded-[3px] transition-colors shrink-0 cursor-pointer flex items-center space-x-1 text-[10px]"
          :class="
            selectedCategory === cat
              ? 'bg-[#0072fd] text-white shadow-2xs font-bold'
              : 'bg-[#f0f3fa] dark:bg-[#161d2b] hover:bg-[#e0e3eb] dark:hover:bg-[#20293d] text-[#4a4d56] dark:text-[#d6dae3]'
          "
        >
          <svg v-if="cat === 'FAVORITES'" class="w-2.5 h-2.5 fill-current text-amber-400" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>{{ cat === 'FAVORITES' ? 'Starred' : cat }}</span>
        </button>
      </div>

      <!-- Right Arrow Indicator -->
      <div
        v-show="canScrollRight"
        class="absolute right-0 top-0 bottom-0 flex items-center pr-0.5 pl-2 bg-gradient-to-l from-white via-white/95 to-transparent dark:from-[#0d111a] dark:via-[#0d111a]/95 dark:to-transparent z-10 pointer-events-none transition-opacity duration-200"
      >
        <button
          type="button"
          @click="scrollCategoriesRight"
          class="h-4 w-4 rounded-full bg-white dark:bg-[#1a2130] border border-[#d1d4dc] dark:border-[#2e374d] flex items-center justify-center text-[#131722] dark:text-white hover:text-[#0072fd] dark:hover:text-[#38bdf8] shadow-xs cursor-pointer pointer-events-auto"
          aria-label="Scroll categories right"
          title="More categories"
        >
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </div>

    <!-- 5. Watchlist Items List OR Heatmap View -->
    <WatchlistHeatmap
      v-if="watchlistMode === 'heatmap'"
      :rows="flatHeatmapRows"
      :current-symbol="currentSymbol"
      @select="s => selectSymbol(s)"
    />
    <div
      v-else
      class="flex-1 overflow-y-auto overflow-x-hidden divide-y divide-[#f0f3fa] dark:divide-[#161d2b] bg-white dark:bg-[#0d111a] min-h-0"
    >
      <div
        v-for="group in filteredWatchlistGroups"
        :key="group.id"
        class="pb-0.5"
      >
        <!-- Group Section Title Header (e.g. FOREX & COMMODITIES (10)) -->
        <div
          @click="toggleGroup(group.id)"
          class="flex items-center space-x-1 px-3 py-1.5 text-[9.5px] font-black uppercase text-[#787b86] dark:text-[#5a6578] hover:text-[#131722] dark:hover:text-white cursor-pointer tracking-wider bg-[#fafbfd] dark:bg-[#0d111a] border-y border-[#f0f3fa] dark:border-[#1a2232] transition-colors"
        >
          <svg
            class="w-3 h-3 transition-transform duration-150 shrink-0"
            :class="{ 'rotate-0': !isCollapsedGroups[group.id], '-rotate-90': isCollapsedGroups[group.id] }"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span class="truncate">{{ group.name }}</span>
          <span class="text-[9px] font-normal opacity-75 shrink-0">({{ group.items.length }})</span>
        </div>

        <!-- Symbol Cards -->
        <div v-if="!isCollapsedGroups[group.id]" class="flex flex-col py-1">
          <div
            v-for="item in group.items"
            :key="item.symbol"
            @click="selectSymbol(item)"
            @mouseenter="hoveredSymbol = item.symbol"
            @mouseleave="hoveredSymbol = null"
            tabindex="0"
            @keydown.enter="selectSymbol(item)"
            class="symbol-card group relative mx-2 my-1 px-2.5 py-2 cursor-pointer transition-all rounded-lg border focus:outline-none"
            :class="[
              activeSymbolId === item.symbol
                ? 'bg-blue-50/80 dark:bg-[#141f32] border-[#0072fd] border-l-4 shadow-sm'
                : 'bg-white dark:bg-[#131823] border-[#e2e5ec] dark:border-[#1a2232] hover:border-[#0072fd]/40 dark:hover:border-[#2a354c] hover:bg-gray-50/70 dark:hover:bg-[#182030]',
              priceFlashes[item.symbol] === 'up' ? 'xn-flash-up' : priceFlashes[item.symbol] === 'down' ? 'xn-flash-down' : '',
              confirmDeleteSymbol === item.symbol ? 'ring-1 ring-rose-400 bg-rose-50/50 dark:bg-rose-950/20' : ''
            ]"
          >
            <!-- Main Content Row -->
            <div class="flex items-center justify-between gap-2.5">
              <!-- Left: Asset Icon + Symbol Name + Description -->
              <div class="flex items-center space-x-2.5 min-w-0">
                <!-- Asset Emblem (26x26px) -->
                <div class="w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-2xs font-black text-[10px] select-none">
                  <!-- Bitcoin -->
                  <div v-if="item.symbol.startsWith('BTC')" class="w-full h-full bg-[#f7931a] text-white flex items-center justify-center font-bold text-[13px] leading-none">
                    ₿
                  </div>
                  <!-- Ethereum -->
                  <div v-else-if="item.symbol.startsWith('ETH')" class="w-full h-full bg-[#627eea] text-white flex items-center justify-center font-bold text-[12px] leading-none">
                    Ξ
                  </div>
                  <!-- Binance BNB -->
                  <div v-else-if="item.symbol.startsWith('BNB')" class="w-full h-full bg-[#f3ba2f] text-black flex items-center justify-center font-black text-[8px] tracking-tight leading-none">
                    BNB
                  </div>
                  <!-- US30 -->
                  <div v-else-if="item.symbol === 'US30'" class="w-full h-full bg-[#002f6c] text-white flex items-center justify-center font-black text-[9px] leading-none">
                    US
                  </div>
                  <!-- NAS100 -->
                  <div v-else-if="item.symbol === 'NAS100'" class="w-full h-full bg-[#0052cc] text-white flex items-center justify-center font-black text-[8.5px] leading-none">
                    NQ
                  </div>
                  <!-- SPX500 -->
                  <div v-else-if="item.symbol === 'SPX500'" class="w-full h-full bg-[#8b0000] text-white flex items-center justify-center font-black text-[8.5px] leading-none">
                    SP
                  </div>
                  <!-- Gold (XAUUSD) -->
                  <div v-else-if="item.symbol === 'XAUUSD'" class="w-full h-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 text-black flex items-center justify-center font-black text-[9.5px] leading-none shadow-xs">
                    Au
                  </div>
                  <!-- Silver (XAGUSD) -->
                  <div v-else-if="item.symbol === 'XAGUSD'" class="w-full h-full bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 flex items-center justify-center font-black text-[9.5px] leading-none">
                    Ag
                  </div>
                  <!-- Oil (USOIL) -->
                  <div v-else-if="item.symbol === 'USOIL'" class="w-full h-full bg-[#1e293b] text-amber-400 flex items-center justify-center font-bold text-[11px] leading-none">
                    🛢
                  </div>
                  <!-- EURUSD Flag -->
                  <svg v-else-if="item.symbol === 'EURUSD'" class="w-full h-full" viewBox="0 0 32 32">
                    <rect width="32" height="32" rx="16" fill="#003399" />
                    <circle cx="16" cy="6" r="1.3" fill="#ffcc00" />
                    <circle cx="23.1" cy="8.9" r="1.3" fill="#ffcc00" />
                    <circle cx="26" cy="16" r="1.3" fill="#ffcc00" />
                    <circle cx="23.1" cy="23.1" r="1.3" fill="#ffcc00" />
                    <circle cx="16" cy="26" r="1.3" fill="#ffcc00" />
                    <circle cx="8.9" cy="23.1" r="1.3" fill="#ffcc00" />
                    <circle cx="6" cy="16" r="1.3" fill="#ffcc00" />
                    <circle cx="8.9" cy="8.9" r="1.3" fill="#ffcc00" />
                  </svg>
                  <!-- GBPUSD Flag -->
                  <svg v-else-if="item.symbol === 'GBPUSD'" class="w-full h-full" viewBox="0 0 32 32">
                    <defs>
                      <clipPath :id="'uk-circle-' + item.symbol"><circle cx="16" cy="16" r="16"/></clipPath>
                    </defs>
                    <g :clip-path="'url(#uk-circle-' + item.symbol + ')'">
                      <rect width="32" height="32" fill="#012169" />
                      <path d="M0 0 L32 32 M32 0 L0 32" stroke="#fff" stroke-width="4.5" />
                      <path d="M0 0 L32 32 M32 0 L0 32" stroke="#C8102E" stroke-width="2" />
                      <path d="M16 0 V32 M0 16 H32" stroke="#fff" stroke-width="7" />
                      <path d="M16 0 V32 M0 16 H32" stroke="#C8102E" stroke-width="4.2" />
                    </g>
                  </svg>
                  <!-- Fallback: Category-styled avatar -->
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center font-bold text-[9.5px] text-white"
                    :class="[
                      item.category === 'Crypto' ? 'bg-gradient-to-tr from-purple-600 to-indigo-500' :
                      item.category === 'Indices' ? 'bg-gradient-to-tr from-cyan-700 to-blue-600' :
                      item.category === 'Stocks' ? 'bg-gradient-to-tr from-emerald-700 to-teal-600' :
                      item.category === 'Commodity' ? 'bg-gradient-to-tr from-amber-700 to-orange-500' :
                      'bg-gradient-to-tr from-blue-700 to-indigo-600'
                    ]"
                  >
                    {{ (item.tag || item.symbol.slice(0, 2)).toUpperCase() }}
                  </div>
                </div>

                <!-- Symbol Name & Full Description -->
                <div class="min-w-0 flex flex-col justify-center">
                  <div class="flex items-center space-x-1.5">
                    <!-- FULL SYMBOL NAME: bold, white, whitespace-nowrap, never truncated! -->
                    <span class="font-bold text-[13px] text-[#131722] dark:text-white tracking-wide whitespace-nowrap leading-tight">
                      {{ item.symbol }}
                    </span>
                    <!-- Star (★) Button directly next to symbol ticker on the left (XAUUSD ★ CMD) -->
                    <button
                      type="button"
                      @click.stop="toggleFavorite(item.symbol)"
                      class="transition-transform hover:scale-115 active:scale-95 cursor-pointer p-0.5 shrink-0"
                      :class="favorites.includes(item.symbol) 
                        ? 'text-amber-400' 
                        : 'text-gray-300 dark:text-[#3d485e] hover:text-amber-400 dark:hover:text-amber-400 opacity-60 hover:opacity-100'"
                      :title="favorites.includes(item.symbol) ? 'Remove from favorites' : 'Add to favorites'"
                    >
                      <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                    <!-- Category badge pill -->
                    <span class="text-[8px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-[#f0f3fa] dark:bg-[#1a2130] text-[#787b86] dark:text-[#8895ab] border border-[#e0e3eb] dark:border-[#26334a] leading-none shrink-0">
                      {{ item.badge || getCategoryBadge(item) }}
                    </span>
                  </div>
                  <!-- Human-readable asset description (e.g. "Bitcoin / U.S. Dollar") -->
                  <span class="text-[10px] text-[#787b86] dark:text-[#7f8b9e] truncate font-normal leading-tight mt-0.5 max-w-[130px]">
                    {{ item.name }}
                  </span>
                </div>
              </div>

              <!-- Right: Price Quotes & Percentage Change (100% unobstructed, crystal-clear) -->
              <div class="text-right shrink-0 flex flex-col items-end justify-center">
                <!-- Clean Live Price: Pop-Up Flash Pill (Classic Premium) -->
                <div
                  class="font-mono font-bold text-[12px] tabular-nums tracking-tight leading-tight px-1.5 py-0.5 rounded-[4px] border transition-all duration-300 inline-block select-none"
                  :class="[
                    priceFlashes[item.symbol] === 'up'
                      ? 'bg-emerald-500/20 text-[#089981] dark:text-[#34d399] border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.35)] scale-[1.03]'
                      : priceFlashes[item.symbol] === 'down'
                        ? 'bg-rose-500/20 text-[#f23645] dark:text-[#f87171] border-rose-500/40 shadow-[0_0_12px_rgba(248,113,113,0.35)] scale-[1.03]'
                        : 'text-[#131722] dark:text-white bg-transparent border-transparent'
                  ]"
                >
                  {{ formatPrice(item.last, item.digits) }}
                </div>

                <!-- Percentage Pill: Clean, elegant, no harsh borders -->
                <div
                  class="inline-flex items-center text-[9.5px] font-mono font-semibold px-1.5 py-0.5 rounded mt-0.5 leading-none tabular-nums"
                  :class="(item.changePercent ?? 0) >= 0 
                    ? 'text-[#089981] dark:text-[#26e7a6] bg-[#089981]/10 dark:bg-[#089981]/15' 
                    : 'text-[#f23645] dark:text-[#ff5c6c] bg-[#f23645]/10 dark:bg-[#f23645]/15'"
                >
                  {{ (item.changePercent ?? 0) >= 0 ? '+' : '' }}{{ formatPercent(item.changePercent) }}
                </div>
              </div>
            </div>

            <!-- Clean, User-Friendly In-Card Quick BUY / SELL Bar (Only for Selected Active Symbol) -->
            <div
              v-if="activeSymbolId === item.symbol"
              @click.stop
              class="flex items-center justify-between pt-2 mt-1.5 border-t border-[#e2e5ec]/60 dark:border-[#1a2333] gap-1.5 animate-in fade-in duration-150 select-none"
            >
              <!-- Left side: [ ✕ ] and [- 0.01 +] lot size selector -->
              <div class="flex items-center space-x-1.5 shrink-0">
                <!-- Clean Remove '✕' Button on the Left of Trade Bar -->
                <button
                  type="button"
                  @click.stop="promptDeleteSymbol(item.symbol)"
                  class="w-[23px] h-[23px] rounded flex items-center justify-center text-[#787b86] dark:text-[#8895ab] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer border border-transparent hover:border-rose-500/30"
                  title="Remove symbol from watchlist"
                >
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <!-- Lot Size Selector: [-] 0.01 [+] -->
                <div class="flex items-center bg-[#f0f3fa] dark:bg-[#0c111a] rounded px-1.5 h-[23px] border border-[#d1d4dc] dark:border-[#202b3d] text-[10.5px] font-mono tabular-nums">
                  <button
                    type="button"
                    @click.stop="decrementQuickLot(item.symbol)"
                    class="text-[#787b86] dark:text-[#8895ab] hover:text-[#0072fd] dark:hover:text-[#38bdf8] font-bold px-1 cursor-pointer select-none"
                    title="Decrease lot"
                  >−</button>
                  <span class="px-1.5 font-bold text-[#131722] dark:text-white">{{ getLot(item.symbol).toFixed(2) }}</span>
                  <button
                    type="button"
                    @click.stop="incrementQuickLot(item.symbol)"
                    class="text-[#787b86] dark:text-[#8895ab] hover:text-[#0072fd] dark:hover:text-[#38bdf8] font-bold px-1 cursor-pointer select-none"
                    title="Increase lot"
                  >+</button>
                </div>
              </div>

              <!-- SELL and BUY Buttons -->
              <div class="flex items-center space-x-1.5 flex-1 justify-end">
                <!-- SELL Button (Crimson) -->
                <button
                  type="button"
                  @click.stop="handleOpenSell(item.symbol)"
                  class="flex-1 h-[23px] px-2 rounded bg-[#f23645] hover:bg-[#d92231] active:scale-95 text-white font-black text-[10px] uppercase tracking-wider flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-xs"
                  title="Instant Market SELL"
                >
                  <span>SELL</span>
                </button>

                <!-- BUY Button (Blue #0072fd) -->
                <button
                  type="button"
                  @click.stop="handleOpenBuy(item.symbol)"
                  class="flex-1 h-[23px] px-2 rounded bg-[#0072fd] hover:bg-[#005fcf] active:scale-95 text-white font-black text-[10px] uppercase tracking-wider flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-xs"
                  title="Instant Market BUY"
                >
                  <span>BUY</span>
                </button>
              </div>
            </div>

            <!-- Inline Delete Confirmation State -->
            <div
              v-if="confirmDeleteSymbol === item.symbol"
              @click.stop
              class="absolute inset-0 z-30 bg-white/95 dark:bg-[#0d111a]/95 backdrop-blur-xs flex items-center justify-between px-2.5 text-[11px] font-bold shadow-md rounded-lg border border-rose-300 dark:border-rose-900"
            >
              <span class="text-rose-700 dark:text-rose-400 truncate pr-1">
                Remove {{ item.symbol }}?
              </span>
              <div class="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  @click.stop="cancelDelete"
                  class="px-2 py-0.5 rounded bg-[#f0f3fa] dark:bg-[#161d2b] hover:bg-[#e0e3eb] dark:hover:bg-[#20293d] text-[#131722] dark:text-white text-[10px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click.stop="executeDeleteSymbol(item.symbol)"
                  class="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredWatchlistGroups.length === 0"
        class="p-6 text-center text-[#787b86] dark:text-[#929bad] space-y-2"
      >
        <div class="text-[12px] font-bold text-gray-800 dark:text-gray-200">No symbols found</div>
        <p class="text-[10px] opacity-80">Try selecting "ALL" or searching for another asset ticker.</p>
        <button
          type="button"
          @click="showAddModal = true"
          class="mt-1 px-2.5 py-1 rounded-[4px] bg-[#0072fd] text-white text-[10.5px] font-bold cursor-pointer hover:bg-blue-600"
        >
          Add Instruments
        </button>
      </div>
    </div>

    <!-- Analytical Details Modal -->
    <SymbolDetailsModal
      :open="detailsModalOpen"
      :item="selectedDetailsItem"
      @close="detailsModalOpen = false"
      @buy="sym => handleOpenBuy(sym)"
      @sell="sym => handleOpenSell(sym)"
    />

    <!-- Add Symbol Catalog Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 font-sans"
      @click.self="showAddModal = false"
    >
      <div
        class="bg-white dark:bg-[#0d111a] border border-[#e3e6eb] dark:border-[#222b3d] rounded-xl shadow-2xl w-full max-w-xs overflow-hidden text-xs transition-colors"
        @click.stop
      >
        <div class="px-3.5 py-2.5 border-b border-[#f0f2f5] dark:border-[#1e2433] flex items-center justify-between bg-gray-50/50 dark:bg-[#111622]">
          <h3 class="font-bold text-xs tracking-tight text-[#131722] dark:text-white">Add Instruments</h3>
          <button type="button" class="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer" @click="showAddModal = false">✕</button>
        </div>

        <div class="p-2.5 border-b border-[#f0f2f5] dark:border-[#1e2433]">
          <input
            v-model="addCatalogSearch"
            type="text"
            placeholder="Search catalog (Gold, BTC, Apple)..."
            class="w-full bg-[#f4f6f9] dark:bg-[#161d2b] rounded-md px-2.5 py-1 text-xs outline-none text-[#131722] dark:text-white border border-transparent focus:border-[#0072fd]"
          />
          <div class="flex items-center gap-1 mt-1.5 overflow-x-auto no-scrollbar text-[9.5px]">
            <button
              v-for="c in ['ALL', 'Forex', 'Crypto', 'Commodity', 'Indices', 'Stocks']"
              :key="c"
              type="button"
              class="px-1.5 py-0.5 rounded cursor-pointer transition-colors"
              :class="addCatalogCategory === c ? 'bg-[#0072fd] text-white font-bold' : 'bg-gray-100 dark:bg-[#1a2130] text-gray-600 dark:text-gray-300'"
              @click="addCatalogCategory = c"
            >
              {{ c }}
            </button>
          </div>
        </div>

        <div class="max-h-[240px] overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#161d2b] p-1">
          <div
            v-for="s in filteredCatalog"
            :key="s.symbol"
            class="p-1.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#161d2b] rounded cursor-pointer transition-colors"
          >
            <div class="min-w-0 pr-1">
              <div class="font-bold text-[#131722] dark:text-white text-[11px] truncate">{{ s.symbol }}</div>
              <div class="text-[9.5px] text-gray-500 dark:text-[#888888] truncate">{{ s.name }}</div>
            </div>
            <button
              type="button"
              class="px-2 py-0.5 bg-[#0072fd] text-white text-[10px] font-bold rounded hover:bg-blue-600 cursor-pointer transition-colors shrink-0"
              @click="addSymbolToActiveWatchlist(s)"
            >
              + Add
            </button>
          </div>
          <div v-if="filteredCatalog.length === 0" class="py-4 text-center text-gray-400 text-[11px]">
            No instruments found
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { SYMBOLS, WATCHLIST } from '../data/marketData.js';
import { onMarketTick, livePrices } from '../stores/marketFeed.js';
import { usePositions } from '../stores/positions.js';
import { useNotifications } from '../stores/notifications.js';
import SymbolDetailsModal from './watchlist/SymbolDetailsModal.vue';
import WatchlistHeatmap from './watchlist/WatchlistHeatmap.vue';

const watchlistMode = ref('list');

const props = defineProps({
  rows:          { type: Array,   default: () => [] },
  currentSymbol: { type: String,  default: 'XAUUSD' },
  width:         { type: Number,  default: 280 }
});

const emit = defineEmits([
  'select',
  'remove-symbol',
  'add-symbol',
  'buy',
  'sell',
  'close'
]);

const { openPosition, updateLtp } = usePositions();
const { notify } = useNotifications();

// ── 1. Multiple Watchlists State ───────────────────────────────────────────
const allCatalogSymbols = [
  'XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'AUDCAD', 'USDCAD', 'USDCHF',
  'XAGUSD', 'USOIL', 'BTCUSD', 'ETHUSD', 'BNBUSD', 'US30', 'NAS100', 'SPX500',
  'BKNG.OQ', 'BLK.N', 'BMWG.DE', 'BNPP.PA', 'BRKb.N', 'C.N', 'CAPP.PA', 'AAL.OQ'
];

const defaultWatchlists = [
  {
    id: 'wl-1',
    name: 'Watchlist 1',
    symbols: allCatalogSymbols
  },
  {
    id: 'wl-2',
    name: 'Watchlist 2',
    symbols: ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'AUDCAD', 'USDCAD', 'USDCHF', 'XAGUSD', 'USOIL']
  },
  {
    id: 'wl-3',
    name: 'Watchlist 3',
    symbols: ['BTCUSD', 'ETHUSD', 'BNBUSD', 'US30', 'NAS100', 'SPX500', 'BKNG.OQ', 'BLK.N', 'BMWG.DE', 'BNPP.PA']
  }
];

const savedWatchlists = (() => {
  try {
    const raw = localStorage.getItem('xn_watchlists');
    if (!raw) return defaultWatchlists;
    const parsed = JSON.parse(raw);
    return parsed.map(w => ({
      ...w,
      symbols: Array.isArray(w.symbols) && w.symbols.length > 0 ? w.symbols : allCatalogSymbols
    }));
  } catch (e) {
    return defaultWatchlists;
  }
})();

const watchlists = ref(savedWatchlists);
const activeWatchlistId = ref(localStorage.getItem('xn_active_wl_id') || 'wl-1');

function selectWatchlist(wl) {
  activeWatchlistId.value = wl.id;
  notify({ message: `Switched to "${wl.name}" watchlist`, type: 'info' });
}

watch(activeWatchlistId, (newId) => {
  try { localStorage.setItem('xn_active_wl_id', newId); } catch (e) {}
});

watch(watchlists, (newList) => {
  try { localStorage.setItem('xn_watchlists', JSON.stringify(newList)); } catch (e) {}
}, { deep: true });

const isNewWatchlistInput = ref(false);
const newWatchlistName = ref('');

function handleAddWatchlist() {
  const name = newWatchlistName.value.trim();
  if (name) {
    const newId = 'wl-' + Date.now();
    watchlists.value.push({
      id: newId,
      name,
      symbols: ['XAUUSD', 'EURUSD', 'BTCUSD']
    });
    activeWatchlistId.value = newId;
    newWatchlistName.value = '';
    notify({ message: `Created new watchlist: "${name}"`, type: 'success' });
  }
  isNewWatchlistInput.value = false;
}

// ── 2. Favorites List (Persistent) ─────────────────────────────────────────
const favorites = ref((() => {
  try {
    const raw = localStorage.getItem('xn_favorites');
    return raw ? JSON.parse(raw) : ['XAUUSD', 'EURUSD', 'GBPUSD'];
  } catch (e) {
    return ['XAUUSD', 'EURUSD', 'GBPUSD'];
  }
})());

function toggleFavorite(sym) {
  if (favorites.value.includes(sym)) {
    favorites.value = favorites.value.filter(s => s !== sym);
  } else {
    favorites.value.push(sym);
  }
  try { localStorage.setItem('xn_favorites', JSON.stringify(favorites.value)); } catch (e) {}
}

// ── 3. Search & Category Filters ───────────────────────────────────────────
const searchQuery = ref('');
const categories = ['ALL', 'Forex', 'Crypto', 'Indices', 'Stocks', 'Commodity', 'FAVORITES'];
const selectedCategory = ref('ALL');

const categoryContainerRef = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
let resizeObserver = null;

function checkCategoryOverflow() {
  const el = categoryContainerRef.value;
  if (!el) {
    canScrollLeft.value = false;
    canScrollRight.value = false;
    return;
  }
  const scrollLeft = el.scrollLeft;
  const maxScrollLeft = el.scrollWidth - el.clientWidth;
  canScrollLeft.value = scrollLeft > 2;
  canScrollRight.value = maxScrollLeft > 2 && scrollLeft < maxScrollLeft - 2;
}

function scrollCategoriesLeft() {
  const el = categoryContainerRef.value;
  if (!el) return;
  el.scrollBy({ left: -Math.max(el.clientWidth * 0.7, 100), behavior: 'smooth' });
  setTimeout(checkCategoryOverflow, 280);
}

function scrollCategoriesRight() {
  const el = categoryContainerRef.value;
  if (!el) return;
  el.scrollBy({ left: Math.max(el.clientWidth * 0.7, 100), behavior: 'smooth' });
  setTimeout(checkCategoryOverflow, 280);
}

function selectCategory(cat, event) {
  selectedCategory.value = cat;
  if (event?.currentTarget && categoryContainerRef.value) {
    event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    setTimeout(checkCategoryOverflow, 280);
  }
}

// ── 4. Rows & Groups Construction ─────────────────────────────────────────
const isCollapsedGroups = ref((() => {
  try {
    const raw = localStorage.getItem('xn_collapsed_groups');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
})());

function toggleGroup(id) {
  isCollapsedGroups.value[id] = !isCollapsedGroups.value[id];
  try { localStorage.setItem('xn_collapsed_groups', JSON.stringify(isCollapsedGroups.value)); } catch (e) {}
}

// Local reactive rows pool (initialized with props.rows or WATCHLIST)
const localRowsMap = ref({});

// ── Real-Time Micro-Candlestick Sparkline Engine ───────────────────────────
function generateInitialSparkline(basePrice) {
  const candles = [];
  let price = Number(basePrice) || 100;
  const spread = Math.max(0.0001, price * 0.0012);
  for (let i = 0; i < 6; i++) {
    const delta = (Math.random() - 0.49) * spread;
    const open = price;
    const close = price + delta;
    const high = Math.max(open, close) + Math.random() * (spread * 0.4);
    const low = Math.min(open, close) - Math.random() * (spread * 0.4);
    candles.push({ open, close, high, low, isUp: close >= open });
    price = close;
  }
  return candles;
}

function getSparklineCoords(candles) {
  if (!candles || !candles.length) return [];
  let min = Infinity;
  let max = -Infinity;
  candles.forEach(c => {
    if (c.low < min) min = c.low;
    if (c.high > max) max = c.high;
  });
  const range = (max - min) || 0.0001;
  const H = 16;
  const pad = 1.5;
  return candles.map((c, i) => {
    const x = i * 7;
    const yHigh = Math.round(H - pad - ((c.high - min) / range) * (H - pad * 2));
    const yLow = Math.round(H - pad - ((c.low - min) / range) * (H - pad * 2));
    const yOpen = Math.round(H - pad - ((c.open - min) / range) * (H - pad * 2));
    const yClose = Math.round(H - pad - ((c.close - min) / range) * (H - pad * 2));
    const bodyY = Math.min(yOpen, yClose);
    const bodyH = Math.max(2, Math.abs(yOpen - yClose));
    return {
      wickX: x + 2,
      yHigh,
      yLow,
      bodyX: x,
      bodyY,
      bodyW: 4,
      bodyH,
      color: c.isUp ? '#089981' : '#f23645'
    };
  });
}

function initLocalRows() {
  const initial = (props.rows && props.rows.length ? props.rows : WATCHLIST);
  initial.forEach(r => {
    const meta = SYMBOLS[r.symbol] || {};
    const feed = livePrices[r.symbol];
    const baseP = Number(feed?.price ?? r.last ?? meta.base ?? 100);
    localRowsMap.value[r.symbol] = {
      symbol: r.symbol,
      name: r.name || meta.name || r.symbol,
      category: r.category || meta.category || 'Forex',
      badge: r.badge || meta.badge || 'FX',
      tag: r.tag || meta.tag || (r.symbol || '').slice(0, 2),
      digits: r.digits != null ? r.digits : (meta.digits ?? 2),
      spread: r.spread || feed?.spread || '2',
      last: baseP,
      change: Number(feed?.change ?? r.change ?? 0.15),
      changePercent: Number(feed?.changePct ?? r.changePercent ?? 0.25),
      buyerRatio: feed?.buyerRatio ?? Math.floor(Math.random() * 20) + 42,
      sparkline: feed?.sparkline ? [...feed.sparkline] : generateInitialSparkline(baseP),
      tickCount: 0
    };
  });
}
initLocalRows();

// Sync props.rows updates if external components update
watch(() => props.rows, (newRows) => {
  if (newRows && newRows.length) {
    newRows.forEach(r => {
      const existing = localRowsMap.value[r.symbol];
      if (existing) {
        if (r.last != null) existing.last = Number(r.last);
        if (r.change != null) existing.change = Number(r.change);
        if (r.changePercent != null) existing.changePercent = Number(r.changePercent);
      }
    });
  }
}, { deep: true });

// Symbols currently in active watchlist
const activeWatchlistSymbols = computed(() => {
  const current = watchlists.value.find(w => w.id === activeWatchlistId.value);
  return current?.symbols || allCatalogSymbols;
});

// Category Group Definitions (Forex & Commodities, Crypto, Indices & Stocks)
const groupCategories = [
  { id: 'grp-forex-cmd', name: 'FOREX & COMMODITIES', match: (c) => c === 'Forex' || c === 'Commodity' },
  { id: 'grp-crypto',    name: 'CRYPTO ASSETS',       match: (c) => c === 'Crypto' },
  { id: 'grp-indices',   name: 'INDICES & STOCKS',    match: (c) => c === 'Indices' || c === 'Stocks' }
];

const filteredWatchlistGroups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const categoryFilter = selectedCategory.value;
  const allowed = activeWatchlistSymbols.value;

  // Build items list
  const list = [];
  for (const sym of allowed) {
    let item = localRowsMap.value[sym];
    if (!item) {
      const meta = SYMBOLS[sym] || {};
      item = {
        symbol: sym,
        name: meta.name || sym,
        category: meta.category || 'Forex',
        badge: meta.badge || 'FX',
        tag: meta.tag || sym.slice(0, 2),
        digits: meta.digits ?? 2,
        spread: '2',
        last: meta.base ?? 100,
        change: 0.15,
        changePercent: 0.25,
        buyerRatio: 52,
        sparkline: generateInitialSparkline(meta.base ?? 100),
        tickCount: 0
      };
      localRowsMap.value[sym] = item;
    }

    // 1. Category Filter
    if (categoryFilter === 'FAVORITES') {
      if (!favorites.value.includes(item.symbol)) continue;
    } else if (categoryFilter !== 'ALL') {
      const itemCat = (item.category || '').toLowerCase();
      const filterCat = categoryFilter.toLowerCase();
      if (!itemCat.includes(filterCat)) continue;
    }

    // 2. Search Text Query
    if (query) {
      const matchSym = item.symbol.toLowerCase().includes(query);
      const matchName = (item.name || '').toLowerCase().includes(query);
      const matchCat = (item.category || '').toLowerCase().includes(query);
      if (!matchSym && !matchName && !matchCat) continue;
    }

    list.push(item);
  }

  // Single category filter returns flat group
  if (categoryFilter !== 'ALL' && categoryFilter !== 'FAVORITES') {
    return [
      {
        id: 'grp-' + categoryFilter.toLowerCase(),
        name: categoryFilter.toUpperCase(),
        items: list
      }
    ].filter(g => g.items.length > 0);
  }

  // Group by sections
  return groupCategories.map(grp => {
    return {
      id: grp.id,
      name: grp.name,
      items: list.filter(item => grp.match(item.category))
    };
  }).filter(g => g.items.length > 0);
});

const totalMatchingCount = computed(() => {
  return filteredWatchlistGroups.value.reduce((acc, g) => acc + g.items.length, 0);
});

const flatHeatmapRows = computed(() => {
  return filteredWatchlistGroups.value.flatMap(g => (g.items || []).map(r => ({
    symbol: r.symbol,
    last: r.last,
    changePct: (r.changePercent >= 0 ? '+' : '') + Number(r.changePercent || 0).toFixed(2) + '%',
    sector: r.badge || r.category || 'FX',
    currentSymbol: props.currentSymbol
  })));
});

// ── 5. Real-Time Price Ticker & Flashlight Glowing Pop-up ───────────────────
const priceFlashes = ref({});
const priceFlashTimers = {};

function triggerFlash(sym, dir) {
  priceFlashes.value = { ...priceFlashes.value, [sym]: dir > 0 ? 'up' : 'down' };
  if (priceFlashTimers[sym]) clearTimeout(priceFlashTimers[sym]);
  priceFlashTimers[sym] = setTimeout(() => {
    const next = { ...priceFlashes.value };
    delete next[sym];
    priceFlashes.value = next;
  }, 750);
}

let unsubscribeMarketTick = null;
onMounted(() => {
  unsubscribeMarketTick = onMarketTick((sym, tickData, dir) => {
    const item = localRowsMap.value[sym];
    if (item) {
      item.last = tickData.price;
      item.change = tickData.change;
      item.changePercent = tickData.changePct;
      item.buyerRatio = tickData.buyerRatio;
      if (tickData.sparkline && tickData.sparkline.length) {
        item.sparkline = [...tickData.sparkline];
      }
      triggerFlash(sym, dir);
    }
  });
});

onBeforeUnmount(() => {
  if (unsubscribeMarketTick) unsubscribeMarketTick();
  Object.values(priceFlashTimers).forEach(t => clearTimeout(t));
});

// ── 6. Hover & Contextual Action Bar ────────────────────────────────────────
const hoveredSymbol = ref(null);
const activeMenuSymbol = ref(null);
const confirmDeleteSymbol = ref(null);
const quickLots = ref({});

function getLot(sym) {
  return Number(quickLots.value[sym] || 0.01);
}

function incrementQuickLot(sym) {
  const cur = Number(quickLots.value[sym] || 0.01);
  quickLots.value[sym] = +(cur + 0.01).toFixed(2);
}

function decrementQuickLot(sym) {
  const cur = Number(quickLots.value[sym] || 0.01);
  if (cur > 0.01) {
    quickLots.value[sym] = +(cur - 0.01).toFixed(2);
  }
}

function toggleRowMenu(sym) {
  activeMenuSymbol.value = activeMenuSymbol.value === sym ? null : sym;
}

function handleDocClick(e) {
  const target = e.target;
  if (target && !target.closest('.symbol-row')) {
    activeMenuSymbol.value = null;
  }
}

const selectedSymbol = ref(props.currentSymbol || 'XAUUSD');
watch(() => props.currentSymbol, (val) => {
  if (val) selectedSymbol.value = val;
});
const activeSymbolId = computed(() => selectedSymbol.value || props.currentSymbol || 'XAUUSD');

function selectSymbol(item) {
  const sym = typeof item === 'string' ? item : item.symbol;
  selectedSymbol.value = sym;
  emit('select', sym);
}

function handleOpenChart(sym) {
  emit('select', sym);
  notify({ message: `Active chart switched to ${sym}`, type: 'info' });
}

function handleOpenBuy(sym) {
  const targetSym = sym || props.currentSymbol;
  emit('select', targetSym);
  const item = localRowsMap.value[targetSym];
  const digits = item?.digits ?? 2;
  const price = item?.last || 1.0;
  const lot = getLot(targetSym);
  openPosition({
    symbol: targetSym,
    side: 'BUY',
    lot,
    price,
    digits
  });
}

function handleOpenSell(sym) {
  const targetSym = sym || props.currentSymbol;
  emit('select', targetSym);
  const item = localRowsMap.value[targetSym];
  const digits = item?.digits ?? 2;
  const price = item?.last || 1.0;
  const lot = getLot(targetSym);
  openPosition({
    symbol: targetSym,
    side: 'SELL',
    lot,
    price,
    digits
  });
}

function promptDeleteSymbol(sym) {
  confirmDeleteSymbol.value = sym;
}

function cancelDelete() {
  confirmDeleteSymbol.value = null;
}

function executeDeleteSymbol(sym) {
  const currentWl = watchlists.value.find(w => w.id === activeWatchlistId.value);
  if (currentWl) {
    currentWl.symbols = currentWl.symbols.filter(s => s !== sym);
  }
  emit('remove-symbol', sym);
  confirmDeleteSymbol.value = null;
  notify({ message: `Removed ${sym} from watchlist`, type: 'info' });
}

// ── 7. Analytical Details Modal ────────────────────────────────────────────
const detailsModalOpen = ref(false);
const selectedDetailsItem = ref(null);

function handleOpenDetails(item) {
  selectedDetailsItem.value = item;
  detailsModalOpen.value = true;
}

// ── 8. Add Symbol Catalog Modal ────────────────────────────────────────────
const showAddModal = ref(false);
const addCatalogSearch = ref('');
const addCatalogCategory = ref('ALL');

const catalogItems = computed(() => {
  return Object.keys(SYMBOLS).map(sym => {
    const meta = SYMBOLS[sym];
    return {
      symbol: sym,
      name: meta.name || sym,
      category: meta.category || 'Forex',
      badge: meta.badge || 'FX',
      tag: meta.tag || sym.slice(0, 2),
      last: meta.base,
      digits: meta.digits ?? 2
    };
  });
});

const filteredCatalog = computed(() => {
  const q = addCatalogSearch.value.trim().toLowerCase();
  const cat = addCatalogCategory.value;
  return catalogItems.value.filter(item => {
    if (cat !== 'ALL' && item.category.toLowerCase() !== cat.toLowerCase()) return false;
    if (q) {
      return item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
    }
    return true;
  });
});

function addSymbolToActiveWatchlist(item) {
  const currentWl = watchlists.value.find(w => w.id === activeWatchlistId.value);
  if (currentWl && !currentWl.symbols.includes(item.symbol)) {
    currentWl.symbols.unshift(item.symbol);
  }
  localRowsMap.value[item.symbol] = {
    symbol: item.symbol,
    name: item.name,
    category: item.category,
    badge: item.badge,
    tag: item.tag,
    digits: item.digits,
    spread: '2',
    last: Number(item.last),
    change: 0.15,
    changePercent: 0.25
  };
  emit('add-symbol', localRowsMap.value[item.symbol]);
  notify({ message: `Added ${item.symbol} to ${currentWl?.name || 'watchlist'}`, type: 'success' });
  showAddModal.value = false;
}

// ── 9. Formatting Helpers ──────────────────────────────────────────────────
function getCategoryBadge(item) {
  if (item?.badge) return item.badge;
  if (item?.category === 'Crypto') return 'CRYPTO';
  if (item?.category === 'Indices') return 'IND';
  if (item?.category === 'Stocks') return 'STK';
  if (item?.category === 'Commodity') return 'CMD';
  return 'FX';
}

function formatPrice(val, digits = 2) {
  if (val === undefined || val === null || isNaN(val)) return '-';
  return Number(val).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function formatPercent(val) {
  if (val === undefined || val === null || isNaN(val)) return '-';
  const sign = val > 0 ? '+' : '';
  return sign + Number(val).toFixed(2) + '%';
}

function getCategoryBadgeColor(category) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('forex')) return 'bg-[#6366f1]'; // Indigo (distinct from BUY blue)
  if (cat.includes('crypto')) return 'bg-[#f59e0b]'; // Amber/Orange
  if (cat.includes('commodity')) return 'bg-[#d97706]'; // Bronze/Gold (matching XAU CMD)
  if (cat.includes('stock')) return 'bg-[#10b981]'; // Emerald Green
  if (cat.includes('indices') || cat.includes('index')) return 'bg-[#0284c7]'; // Cyan/Teal
  return 'bg-[#6366f1]';
}

// ── 10. Lifecycle Listeners ────────────────────────────────────────────────
onMounted(() => {
  requestAnimationFrame(checkCategoryOverflow);
  const el = categoryContainerRef.value;
  if (el) {
    el.addEventListener('scroll', checkCategoryOverflow, { passive: true });
    resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(checkCategoryOverflow);
    });
    resizeObserver.observe(el);
  }
  window.addEventListener('resize', checkCategoryOverflow);
  document.addEventListener('click', handleDocClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocClick);
  const el = categoryContainerRef.value;
  if (el) {
    el.removeEventListener('scroll', checkCategoryOverflow);
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  window.removeEventListener('resize', checkCategoryOverflow);
});

watch(selectedCategory, () => {
  nextTick(() => {
    requestAnimationFrame(checkCategoryOverflow);
  });
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.action-dock {
  animation: fadeInDock 140ms ease-out;
}

@keyframes fadeInDock {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Glowing Flashlight Tick Animations on Row ────────── */
.xn-flash-up {
  animation: xn-flash-up-glow 0.5s ease-out;
}

.xn-flash-down {
  animation: xn-flash-down-glow 0.5s ease-out;
}

@keyframes xn-flash-up-glow {
  0% {
    background-color: rgba(8, 153, 129, 0.18);
  }
  100% {
    background-color: transparent;
  }
}

@keyframes xn-flash-down-glow {
  0% {
    background-color: rgba(242, 54, 69, 0.18);
  }
  100% {
    background-color: transparent;
  }
}
</style>
