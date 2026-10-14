<template>
  <div
    class="w-full h-full relative overflow-hidden bg-white dark:bg-[#090d15] select-none transition-colors"
    :style="{ cursor: chartCursorStyle }"
  >
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
      <span class="text-[48px] font-black tracking-tight text-[#1a1d24] dark:text-white opacity-[0.03] uppercase font-sans">
        {{ symbol }}
      </span>
    </div>



    <!-- 2. Interactive SVG Drawing Layer Overlay -->
    <svg
      v-if="engine === 'xtremenext' && !drawingsHidden"
      ref="svgOverlayRef"
      class="absolute inset-0 w-full h-full z-15"
      :class="isDrawingToolActive ? 'pointer-events-auto' : 'pointer-events-none'"
      @mousedown="handleDrawingMouseDown"
      @mousemove="handleDrawingMouseMove"
      @mouseup="handleDrawingMouseUp"
    >
      <defs>
        <!-- Marker for arrows -->
        <marker id="arrowhead" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <polygon points="0 0, 7 3.5, 0 7" fill="#0072fd" />
        </marker>
      </defs>

      <!-- Committed Drawings -->
      <g v-for="d in symbolDrawings" :key="d.id" class="drawing-group group/draw cursor-pointer pointer-events-auto">
        <!-- A. Trendline -->
        <g v-if="d.type === 'trend'">
          <line
            :x1="d.x1" :y1="d.y1" :x2="d.x2" :y2="d.y2"
            :stroke="d.color || '#0072fd'"
            stroke-width="2"
            stroke-linecap="round"
          />
          <circle :cx="d.x1" :cy="d.y1" r="3.5" :fill="d.color || '#0072fd'" stroke="#ffffff" stroke-width="1.5" />
          <circle :cx="d.x2" :cy="d.y2" r="3.5" :fill="d.color || '#0072fd'" stroke="#ffffff" stroke-width="1.5" />
        </g>

        <!-- B. Horizontal Line -->
        <g v-else-if="d.type === 'h-line'">
          <line
            x1="0" :y1="d.y1" x2="100%" :y2="d.y1"
            :stroke="d.color || '#0072fd'"
            stroke-width="1.5"
            stroke-dasharray="4 3"
          />
          <rect :x="'calc(100% - 68px)'" :y="d.y1 - 9" width="62" height="18" rx="3" fill="#0072fd" />
          <text :x="'calc(100% - 37px)'" :y="d.y1 + 3.5" fill="#ffffff" font-size="10" font-family="monospace" text-anchor="middle">
            {{ formatPriceAtY(d.y1) }}
          </text>
        </g>

        <!-- C. Ray -->
        <g v-else-if="d.type === 'ray'">
          <line
            :x1="d.x1" :y1="d.y1" :x2="d.x2 * 3 - d.x1 * 2" :y2="d.y2 * 3 - d.y1 * 2"
            :stroke="d.color || '#0072fd'"
            stroke-width="2"
          />
          <circle :cx="d.x1" :cy="d.y1" r="3.5" fill="#0072fd" stroke="#fff" stroke-width="1.5" />
        </g>

        <!-- D. Rectangle -->
        <g v-else-if="d.type === 'rectangle'">
          <rect
            :x="Math.min(d.x1, d.x2)"
            :y="Math.min(d.y1, d.y2)"
            :width="Math.abs(d.x2 - d.x1)"
            :height="Math.abs(d.y2 - d.y1)"
            :fill="d.fill || 'rgba(8, 153, 129, 0.12)'"
            :stroke="d.color || '#089981'"
            stroke-width="1.5"
            rx="2"
          />
        </g>

        <!-- E. Circle -->
        <g v-else-if="d.type === 'circle'">
          <circle
            :cx="d.x1"
            :cy="d.y1"
            :r="Math.hypot(d.x2 - d.x1, d.y2 - d.y1)"
            fill="rgba(0, 114, 253, 0.08)"
            :stroke="d.color || '#0072fd'"
            stroke-width="1.5"
          />
        </g>

        <!-- F. Fibonacci Retracement -->
        <g v-else-if="d.type === 'fib-retracement'">
          <g v-for="level in [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]" :key="level">
            <line
              :x1="Math.min(d.x1, d.x2)"
              :y1="d.y1 + (d.y2 - d.y1) * level"
              :x2="Math.max(d.x1, d.x2) + 200"
              :y2="d.y1 + (d.y2 - d.y1) * level"
              :stroke="getFibColor(level)"
              stroke-width="1.2"
              stroke-dasharray="2 2"
            />
            <text
              :x="Math.min(d.x1, d.x2) + 4"
              :y="d.y1 + (d.y2 - d.y1) * level - 3"
              :fill="getFibColor(level)"
              font-size="9.5"
              font-family="monospace"
              font-weight="bold"
            >
              {{ level }} ({{ (level * 100).toFixed(1) }}%)
            </text>
          </g>
        </g>

        <!-- G. Long Position Tool (TradingView Risk:Reward Box) -->
        <g v-else-if="d.type === 'long-pos'">
          <!-- Target Zone (Green) -->
          <rect
            :x="Math.min(d.x1, d.x2)"
            :y="Math.min(d.y1, d.y2)"
            :width="Math.abs(d.x2 - d.x1)"
            :height="Math.abs(d.y1 - Math.min(d.y1, d.y2))"
            fill="rgba(8, 153, 129, 0.25)"
            stroke="#089981"
            stroke-width="1"
          />
          <!-- Stop Zone (Red) -->
          <rect
            :x="Math.min(d.x1, d.x2)"
            :y="d.y1"
            :width="Math.abs(d.x2 - d.x1)"
            :height="Math.abs(d.y2 - d.y1)"
            fill="rgba(242, 54, 69, 0.25)"
            stroke="#f23645"
            stroke-width="1"
          />
          <!-- Center Entry Line -->
          <line
            :x1="Math.min(d.x1, d.x2)"
            :y1="d.y1"
            :x2="Math.max(d.x1, d.x2)"
            :y2="d.y1"
            stroke="#5d6673"
            stroke-width="1.5"
          />
          <text :x="Math.min(d.x1, d.x2) + 6" :y="d.y1 - 4" fill="#089981" font-size="10" font-weight="bold">
            Target: +2.50R
          </text>
          <text :x="Math.min(d.x1, d.x2) + 6" :y="d.y1 + 12" fill="#f23645" font-size="10" font-weight="bold">
            Stop: -1.00R (RR: 2.5)
          </text>
        </g>

        <!-- H. Short Position Tool -->
        <g v-else-if="d.type === 'short-pos'">
          <!-- Stop Zone (Red on top) -->
          <rect
            :x="Math.min(d.x1, d.x2)"
            :y="Math.min(d.y1, d.y2)"
            :width="Math.abs(d.x2 - d.x1)"
            :height="Math.abs(d.y1 - Math.min(d.y1, d.y2))"
            fill="rgba(242, 54, 69, 0.25)"
            stroke="#f23645"
            stroke-width="1"
          />
          <!-- Target Zone (Green on bottom) -->
          <rect
            :x="Math.min(d.x1, d.x2)"
            :y="d.y1"
            :width="Math.abs(d.x2 - d.x1)"
            :height="Math.abs(d.y2 - d.y1)"
            fill="rgba(8, 153, 129, 0.25)"
            stroke="#089981"
            stroke-width="1"
          />
          <line
            :x1="Math.min(d.x1, d.x2)"
            :y1="d.y1"
            :x2="Math.max(d.x1, d.x2)"
            :y2="d.y1"
            stroke="#5d6673"
            stroke-width="1.5"
          />
          <text :x="Math.min(d.x1, d.x2) + 6" :y="d.y1 + 14" fill="#089981" font-size="10" font-weight="bold">
            Target: +2.00R (RR: 2.0)
          </text>
        </g>

        <!-- I. Freehand Brush -->
        <path
          v-else-if="d.type === 'brush' && d.path"
          :d="d.path"
          fill="none"
          :stroke="d.color || '#0072fd'"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- J. Text Annotation -->
        <g v-else-if="d.type === 'text'">
          <text
            :x="d.x1" :y="d.y1"
            fill="#0072fd"
            font-size="13"
            font-weight="bold"
            font-family="sans-serif"
          >
            {{ d.text || 'Analysis Note' }}
          </text>
        </g>
      </g>

      <!-- Active Drawing In-Progress Preview -->
      <g v-if="currentDrawing" class="pointer-events-none">
        <line
          v-if="currentDrawing.type === 'trend' || currentDrawing.type === 'ray'"
          :x1="currentDrawing.x1" :y1="currentDrawing.y1" :x2="currentDrawing.x2" :y2="currentDrawing.y2"
          stroke="#0072fd" stroke-width="2" stroke-dasharray="3 3"
        />
        <line
          v-else-if="currentDrawing.type === 'h-line'"
          x1="0" :y1="currentDrawing.y1" x2="100%" :y2="currentDrawing.y1"
          stroke="#0072fd" stroke-width="1.5" stroke-dasharray="4 2"
        />
        <rect
          v-else-if="currentDrawing.type === 'rectangle'"
          :x="Math.min(currentDrawing.x1, currentDrawing.x2)"
          :y="Math.min(currentDrawing.y1, currentDrawing.y2)"
          :width="Math.abs(currentDrawing.x2 - currentDrawing.x1)"
          :height="Math.abs(currentDrawing.y2 - currentDrawing.y1)"
          fill="rgba(8, 153, 129, 0.15)" stroke="#089981" stroke-width="1.5" stroke-dasharray="2 2"
        />
        <path
          v-else-if="currentDrawing.type === 'brush'"
          :d="currentDrawing.path"
          fill="none" stroke="#0072fd" stroke-width="2" stroke-linecap="round"
        />
      </g>
    </svg>

    <!-- 3. Floating Favorite Drawing Tools Bar (TradingView Starred Tools Bar) -->
    <div
      v-if="showFavoritesBar"
      class="absolute top-12 left-16 z-30 flex items-center gap-1 bg-white/95 dark:bg-[#000000]/95 backdrop-blur-md px-2 py-1 rounded-lg border border-[#e3e6eb] dark:border-[#222222] shadow-xl text-xs select-none"
    >
      <span class="text-gray-400 cursor-move pr-1 text-xs">⋮⋮</span>
      <button
        v-for="fav in favoriteTools"
        :key="fav"
        type="button"
        class="w-7 h-7 flex items-center justify-center rounded hover:bg-[#f0f3fa] dark:hover:bg-[#161616] transition-colors cursor-pointer"
        :class="{ 'bg-blue-100 dark:bg-[#1f1f1f] text-[#0072fd] dark:text-[#38bdf8] font-bold': activeTool === fav }"
        :title="fav"
        @click="setActiveTool(fav)"
      >
        <span class="text-[11px] font-mono">{{ getFavLabel(fav) }}</span>
      </button>
      <button
        type="button"
        class="w-5 h-5 ml-1 text-gray-400 hover:text-gray-700 dark:hover:text-white flex items-center justify-center text-xs cursor-pointer"
        title="Hide Favorites Bar"
        @click="showFavoritesBar = false"
      >
        ✕
      </button>
    </div>

    <!-- 4. Floating Bar Replay Control Dock -->
    <div
      v-if="replayActive"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/95 dark:bg-[#000000]/95 backdrop-blur-md px-4 py-2 rounded-xl border border-[#e3e6eb] dark:border-[#222222] shadow-2xl text-xs select-none"
    >
      <div class="flex items-center gap-1.5 font-bold text-[#0072fd] dark:text-[#38bdf8] pr-2 border-r border-gray-200 dark:border-gray-800">
        <span class="w-2 h-2 rounded-full bg-[#0072fd] animate-ping"></span>
        <span>REPLAY</span>
      </div>
      <button
        type="button"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 cursor-pointer"
        title="Step Backward"
        @click="stepReplay(-1)"
      >
        ⏮
      </button>
      <button
        type="button"
        class="px-3 py-1 bg-[#0072fd] text-white font-bold rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
        @click="togglePlayReplay"
      >
        {{ replayPlaying ? '⏸ Pause' : '▶ Play' }}
      </button>
      <button
        type="button"
        class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 cursor-pointer"
        title="Step Forward"
        @click="stepReplay(1)"
      >
        ⏭
      </button>
      <button
        type="button"
        class="ml-2 text-gray-400 hover:text-red-500 font-bold cursor-pointer"
        title="Exit Replay Mode"
        @click="replayActive = false"
      >
        ✕ Close
      </button>
    </div>

    <!-- 5. Floating Top-Left Overlay: Symbol Legend + Compact Buy/Sell Widget -->
    <div
      v-if="engine === 'xtremenext' && showLegend"
      class="absolute top-2 left-3 z-10 flex flex-col gap-1.5 pointer-events-none select-none font-sans"
    >
      <!-- Row 1: Symbol Legend Pill -->
      <div class="flex items-center gap-2 text-xs bg-white/90 dark:bg-[#131823]/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs border border-[#e3e6eb] dark:border-[#1a2232] pointer-events-auto transition-colors">
        <div class="flex items-center gap-1 font-semibold text-[#1a1d24] dark:text-white">
          <span>{{ symbol }}</span>
          <span class="text-[#9aa3b0] dark:text-[#5d6673]">·</span>
          <span class="text-[#5d6673] dark:text-[#a0a5b0]">{{ timeframeLabel }}</span>
          <!-- Real-Time WebSocket Feed Status Badge -->
          <span
            class="text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1 ml-1 leading-none select-none transition-colors"
            :class="wsStatus === 'connected'
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60'
              : wsStatus === 'connecting'
                ? 'bg-amber-50 text-amber-600 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60'
                : 'bg-gray-100 text-gray-500 border border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'"
            :title="'Feed: wss://cloud1.xtremenext.com/server3/ (' + wsStatus + ')'"
          >
            <span
              class="w-1.5 h-1.5 rounded-full inline-block"
              :class="wsStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : wsStatus === 'connecting' ? 'bg-amber-500 animate-ping' : 'bg-gray-400'"
            ></span>
            <span>{{ wsStatus === 'connected' ? 'LIVE WS' : wsStatus.toUpperCase() }}</span>
          </span>
          <button
            type="button"
            class="p-0.5 hover:text-[#1a1d24] dark:hover:text-white cursor-pointer ml-0.5 transition-colors"
            :class="indicatorsVisible ? 'text-[#0072fd] dark:text-[#38bdf8]' : 'text-[#8a94a6] opacity-60'"
            :title="indicatorsVisible ? 'Hide Indicators (EMA Ribbon)' : 'Show Indicators (EMA Ribbon)'"
            @click="toggleIndicators"
          >
            <!-- Open eye when active, slashed eye when hidden -->
            <svg v-if="indicatorsVisible" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24m-7.07-7.07C4.66 8.87 2 12 2 12s3 7 10 7a9.7 9.7 0 0 0 5.05-1.42M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          </button>
        </div>

        <div class="flex items-center gap-2 text-[11px] tabular-nums font-mono text-[#5d6673] dark:text-[#a0a5b0]">
          <span>O <b class="font-normal text-[#1a1d24] dark:text-[#e2e8f0]">{{ activeBar.open }}</b></span>
          <span>H <b class="font-normal text-[#1a1d24] dark:text-[#e2e8f0]">{{ activeBar.high }}</b></span>
          <span>L <b class="font-normal text-[#1a1d24] dark:text-[#e2e8f0]">{{ activeBar.low }}</b></span>
          <span>C <b class="font-normal text-[#1a1d24] dark:text-[#e2e8f0]">{{ activeBar.close }}</b></span>
          <span :class="activeBarChange >= 0 ? 'text-[#089981] dark:text-[#26a69a]' : 'text-[#f23645] dark:text-[#ef5350]'">
            {{ (activeBarChange >= 0 ? '+' : '') + activeBarChange.toFixed(digits) }}
            ({{ (activeBarChangePct >= 0 ? '+' : '') + activeBarChangePct.toFixed(2) }}%)
          </span>
        </div>
      </div>

      <!-- Row 2: Floating Compact BUY | Lot | SELL Widget -->
      <div class="flex items-center shadow-xs rounded-md border border-[#d2d6dc] dark:border-[#1a2232] bg-white dark:bg-[#131823] overflow-hidden pointer-events-auto h-[26px] w-fit transition-colors">
        <!-- BUY Button (Royal Blue #0072fd) -->
        <button
          type="button"
          class="bg-[#0072fd] hover:bg-[#005cd0] active:scale-95 text-white text-[11px] font-bold px-3 h-full flex items-center justify-center transition-all cursor-pointer select-none"
          title="Place Instant BUY Order"
          @click.stop.prevent="$emit('buy', lot)"
        >
          BUY
        </button>

        <!-- Lot input & stepper -->
        <div class="flex items-center bg-white dark:bg-[#131823] px-1 h-full border-x border-[#e3e6eb] dark:border-[#1a2232]">
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

        <!-- SELL Button (Orange/Red #ff5722) -->
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

    <!-- Active Symbol Orders floating on chart canvas -->
    <div
      v-if="engine === 'xtremenext' && symbolPositions.length > 0"
      class="absolute top-2 right-14 z-20 flex flex-col gap-1.5 pointer-events-auto select-none"
    >
      <div
        v-for="pos in symbolPositions"
        :key="pos.id"
        class="flex items-center gap-2 px-2.5 py-1 rounded shadow-md border text-[11px] font-sans backdrop-blur-xs transition-all"
        :class="pos.side === 'BUY'
          ? 'bg-blue-50/95 dark:bg-[#0c1a30]/95 border-blue-300 dark:border-blue-900/60 text-blue-900 dark:text-blue-200'
          : 'bg-orange-50/95 dark:bg-[#2a1309]/95 border-orange-300 dark:border-orange-900/60 text-orange-900 dark:text-orange-200'"
      >
        <span
          class="px-1.5 py-0.2 rounded font-bold text-[9.5px] text-white"
          :class="pos.side === 'BUY' ? 'bg-[#0072fd]' : 'bg-[#ff5722]'"
        >
          {{ pos.side }} {{ pos.lot }}
        </span>
        <span class="tabular-nums font-semibold">@ {{ pos.entry }}</span>
        <span
          class="font-bold tabular-nums"
          :class="(pos.pl || 0) >= 0 ? 'text-[#089981] dark:text-[#34d399]' : 'text-[#f23645] dark:text-[#f87171]'"
        >
          {{ (pos.pl >= 0 ? '+' : '') + (pos.pl || 0).toFixed(2) }} USD
        </span>
        <button
          type="button"
          class="w-4 h-4 rounded-full bg-red-100 hover:bg-red-500 hover:text-white dark:bg-red-950 dark:hover:bg-red-600 text-red-600 flex items-center justify-center text-[10px] cursor-pointer transition-colors"
          title="Close this order"
          @click.stop="closePosition(pos.id)"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Live Interactive Chart Order Lines with Break-Even Snap -->
    <ChartOrderOverlays
      v-if="engine === 'xtremenext'"
      :symbol="symbol"
      :container-height="containerRef?.clientHeight || 450"
    />

    <!-- Modern Floating Scalper HUD -->
    <ScalperHud
      v-if="engine === 'xtremenext'"
      :symbol="symbol"
      :summary="summary"
      @buy="lot => $emit('buy', lot)"
      @sell="lot => $emit('sell', lot)"
    />

    <!-- AI Candlestick & S/R Pattern Overlay -->
    <ChartPatternOverlay
      v-if="engine === 'xtremenext'"
      :bars="bars"
    />

    <!-- 6. BlackTrader Chart (iframe option) -->
    <div
      v-if="engine === 'blacktrader'"
      class="w-full h-full relative bg-white dark:bg-black overflow-hidden"
    >
      <!-- Zero-flash Dark Skeleton Loader -->
      <div
        v-if="btLoading"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white dark:bg-[#000000] select-none transition-opacity duration-300"
      >
        <div class="flex items-center space-x-1.5 mb-3">
          <span class="w-1.5 h-6 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="w-1.5 h-9 rounded-full bg-rose-500 animate-pulse delay-100"></span>
          <span class="w-1.5 h-5 rounded-full bg-emerald-500 animate-pulse delay-200"></span>
          <span class="w-1.5 h-8 rounded-full bg-rose-500 animate-pulse delay-300"></span>
        </div>
        <div class="flex items-center gap-2 text-xs font-bold text-[#131722] dark:text-white">
          <span class="w-2 h-2 rounded-full bg-[#0072fd] animate-ping"></span>
          <span>Connecting BlackTrader Engine</span>
        </div>
        <div class="text-[10px] font-mono text-[#787b86] dark:text-[#a0a5b0] mt-1.5">
          {{ symbol }} • {{ timeframeLabel }} • {{ isDark ? 'Dark Theme' : 'Light Theme' }}
        </div>
      </div>

      <iframe
        :key="btKey"
        ref="blackTraderFrame"
        :src="blackTraderUrl"
        class="w-full h-full border-0 bg-white dark:bg-black"
        allow="clipboard-read; clipboard-write; fullscreen; accelerometer; gyroscope; encrypted-media; autoplay"
        loading="eager"
        title="BlackTrader Chart"
        @load="onBlackTraderLoaded"
      ></iframe>

      <div class="absolute top-2 right-2 z-20 flex items-center gap-2 bg-white/95 dark:bg-black/95 backdrop-blur-sm px-2.5 py-1 rounded-md border border-[#e3e6eb] dark:border-[#222222] shadow-xs text-[11px] select-none text-[#5d6673] dark:text-[#a0a5b0]">
        <button
          type="button"
          class="flex items-center gap-1 font-bold text-[#0072fd] dark:text-[#38bdf8] hover:underline cursor-pointer"
          title="Switch back to XtremeNext Chart"
          @click="$emit('switch-engine', 'xtremenext')"
        >
          <span>← Back to XtremeNext</span>
        </button>
        <span class="text-gray-300 dark:text-gray-700">|</span>
        <button
          type="button"
          class="flex items-center gap-1 hover:text-[#0072fd] dark:hover:text-white font-medium cursor-pointer transition-colors"
          title="Sync Current Symbol & Timeframe"
          @click="syncCurrentConfigToBlackTrader"
        >
          <span>Sync Symbol</span>
        </button>
        <span class="text-gray-300 dark:text-gray-700">|</span>
        <button
          type="button"
          class="flex items-center gap-1 hover:text-[#0072fd] dark:hover:text-white font-medium cursor-pointer transition-colors"
          title="Reload BlackTrader Chart"
          @click="reloadBlackTrader"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
          <span>Reload</span>
        </button>
        <span class="text-gray-300 dark:text-gray-700">|</span>
        <a
          :href="blackTraderUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 hover:text-[#0072fd] dark:hover:text-white font-medium cursor-pointer transition-colors"
          title="Open BlackTrader in direct browser tab"
        >
          <span>Direct Tab</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRef, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useChart } from '../composables/useChart.js';
import { useTheme } from '../composables/useTheme.js';
import { SYMBOLS } from '../data/marketData.js';
import { usePositions } from '../stores/positions.js';
import { wsStatus } from '../services/xtremeNextWs.js';
import ChartOrderOverlays from './chart/ChartOrderOverlays.vue';
import ScalperHud from './chart/ScalperHud.vue';
import ChartPatternOverlay from './chart/ChartPatternOverlay.vue';
import {
  activeTool,
  drawings,
  drawingsHidden,
  drawingsLocked,
  stayInDrawingMode,
  showFavoritesBar,
  favoriteTools,
  replayActive,
  replayPlaying,
  setActiveTool,
  addDrawing
} from '../stores/drawings.js';

const props = defineProps({
  engine:    { type: String, default: 'xtremenext' },
  symbol:    { type: String, default: 'XAUUSD' },
  timeframe: { type: String, default: '15' },
  bars:      { type: Array,  default: () => [] },
  chartType: { type: String, default: 'candles' },
  summary:   { type: Object, default: () => ({ open: '1.00', high: '1.00', low: '1.00', close: '1.00', change: 0, changePct: 0 }) }
});

const emit = defineEmits(['buy', 'sell', 'switch-engine', 'update:symbol']);

const { isDark } = useTheme();

const { positions, closePosition } = usePositions();
const symbolPositions = computed(() => {
  return positions.value.filter(p => p.symbol === props.symbol);
});

const containerRef = ref(null);
const svgOverlayRef = ref(null);
const blackTraderFrame = ref(null);
const btKey = ref(1);
const btLoading = ref(true);

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

const blackTraderUrl = computed(() => {
  const currentTheme = isDark.value ? 'dark' : 'light';
  return `https://chart.blacktrader.com/?theme=${currentTheme}#chart_MiD2b`;
});

const tfCodeMap = {
  '1': '1 minute',
  '3': '3 minutes',
  '5': '5 minutes',
  '10': '10 minutes',
  '15': '15 minutes',
  '30': '30 minutes',
  '60': '60 minutes',
  '120': '120 minutes',
  '240': '240 minutes',
  'D': '1 day',
  'W': '1 week',
  'M': '1 month'
};

function sendThemeToBlackTrader() {
  if (blackTraderFrame.value && blackTraderFrame.value.contentWindow) {
    const currentTheme = isDark.value ? 'dark' : 'light';
    try {
      blackTraderFrame.value.contentWindow.postMessage({
        source: 'xtreme-parent',
        type: 'theme',
        payload: currentTheme
      }, '*');
    } catch (e) {
      console.warn('[BlackTrader] Failed to postMessage theme:', e);
    }
  }
}

function sendConfigToBlackTrader(symbol, timeframe) {
  if (blackTraderFrame.value && blackTraderFrame.value.contentWindow) {
    const sym = symbol.includes(':') ? symbol : `XtremeNext:C.${symbol}`;
    const tf = tfCodeMap[timeframe] || `${timeframe} minutes`;
    try {
      blackTraderFrame.value.contentWindow.postMessage({
        source: 'xtreme-parent',
        type: 'chart:config',
        payload: { symbol: sym, timeframe: tf }
      }, '*');
      blackTraderFrame.value.contentWindow.postMessage({
        source: 'xtreme-parent',
        type: 'chart:symbol',
        payload: { symbol: sym }
      }, '*');
      blackTraderFrame.value.contentWindow.postMessage({
        source: 'xtreme-parent',
        type: 'chart:timeframe',
        payload: { timeframe: tf }
      }, '*');
    } catch (e) {
      console.warn('[BlackTrader] Sync config error:', e);
    }
  }
}

function syncCurrentConfigToBlackTrader() {
  sendThemeToBlackTrader();
  sendConfigToBlackTrader(props.symbol, props.timeframe);
}

function onBlackTraderLoaded() {
  syncCurrentConfigToBlackTrader();
  setTimeout(() => {
    syncCurrentConfigToBlackTrader();
    btLoading.value = false;
  }, 180);
  setTimeout(syncCurrentConfigToBlackTrader, 500);
  setTimeout(syncCurrentConfigToBlackTrader, 1200);
  setTimeout(syncCurrentConfigToBlackTrader, 2500);
}

watch(isDark, () => {
  sendThemeToBlackTrader();
  setTimeout(sendThemeToBlackTrader, 180);
  if (props.engine === 'blacktrader') {
    btLoading.value = true;
    btKey.value += 1;
  }
});

watch([() => props.symbol, () => props.timeframe], ([s, tf]) => {
  if (props.engine === 'blacktrader') {
    sendConfigToBlackTrader(s, tf);
    setTimeout(() => sendConfigToBlackTrader(s, tf), 200);
  }
});

watch(() => props.engine, (eng) => {
  if (eng === 'blacktrader') {
    btLoading.value = true;
    nextTick(() => {
      syncCurrentConfigToBlackTrader();
      setTimeout(syncCurrentConfigToBlackTrader, 200);
      setTimeout(syncCurrentConfigToBlackTrader, 600);
    });
  }
});

function reloadBlackTrader() {
  btLoading.value = true;
  btKey.value += 1;
}

// ── Drawing Engine Interactions ───────────────────────────────────
const symbolDrawings = computed(() => {
  return drawings.value.filter(d => !d.symbol || d.symbol === props.symbol);
});

const isDrawingToolActive = computed(() => {
  return !['cursor', 'dot', 'arrow'].includes(activeTool.value);
});

const chartCursorStyle = computed(() => {
  if (activeTool.value === 'cursor') return 'crosshair';
  if (activeTool.value === 'text') return 'text';
  if (activeTool.value === 'brush') return 'cell';
  if (isDrawingToolActive.value) return 'crosshair';
  return 'default';
});

const isDrawing = ref(false);
const currentDrawing = ref(null);

function handleDrawingMouseDown(e) {
  if (drawingsLocked.value || !isDrawingToolActive.value) return;
  const rect = svgOverlayRef.value.getBoundingClientRect();
  const startX = e.clientX - rect.left;
  const startY = e.clientY - rect.top;

  isDrawing.value = true;
  if (activeTool.value === 'brush') {
    currentDrawing.value = {
      type: 'brush',
      symbol: props.symbol,
      path: `M ${startX} ${startY}`
    };
  } else {
    currentDrawing.value = {
      type: activeTool.value,
      symbol: props.symbol,
      x1: startX,
      y1: startY,
      x2: startX,
      y2: startY
    };
  }
}

function handleDrawingMouseMove(e) {
  if (!isDrawing.value || !currentDrawing.value) return;
  const rect = svgOverlayRef.value.getBoundingClientRect();
  const curX = e.clientX - rect.left;
  const curY = e.clientY - rect.top;

  if (currentDrawing.value.type === 'brush') {
    currentDrawing.value.path += ` L ${curX} ${curY}`;
  } else {
    currentDrawing.value.x2 = curX;
    currentDrawing.value.y2 = curY;
  }
}

function handleDrawingMouseUp() {
  if (!isDrawing.value || !currentDrawing.value) return;
  isDrawing.value = false;

  addDrawing({ ...currentDrawing.value });
  currentDrawing.value = null;

  if (!stayInDrawingMode.value) {
    setActiveTool('cursor');
  }
}

function formatPriceAtY(y) {
  const base = Number(props.summary?.close) || 4168.84;
  const delta = (250 - y) * 0.15;
  return (base + delta).toFixed(digits.value);
}

function getFibColor(lvl) {
  if (lvl === 0 || lvl === 1) return '#787b86';
  if (lvl === 0.236) return '#f23645';
  if (lvl === 0.382) return '#ff9800';
  if (lvl === 0.5) return '#089981';
  if (lvl === 0.618) return '#2962ff';
  return '#9c27b0';
}

function getFavLabel(tool) {
  const map = {
    'trend': '╱',
    'h-line': '—',
    'rectangle': '▭',
    'fib-retracement': '≡',
    'long-pos': '▲',
    'short-pos': '▼',
    'brush': '✎'
  };
  return map[tool] || tool.slice(0, 2);
}

// ── Replay controls ───────────────────────────────────────────────
function stepReplay(step) {
  // Simulates stepping forward or backward
}

function togglePlayReplay() {
  replayPlaying.value = !replayPlaying.value;
}

// Mount native lightweight chart for XtremeNext with crosshair support
const {
  hoveredBar,
  updateBar,
  indicatorsVisible,
  toggleIndicators
} = useChart(
  containerRef,
  toRef(props, 'bars'),
  toRef(props, 'chartType'),
  toRef(props, 'symbol')
);

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
  getLot: () => lot.value,
  updateLiveBar: (b) => { if (typeof updateBar === 'function') updateBar(b); }
});
</script>
