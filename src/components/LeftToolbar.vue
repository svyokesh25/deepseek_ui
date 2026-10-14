<template>
  <div
    id="drawing-toolbar"
    class="w-[44px] bg-[#f8fafc]/95 dark:bg-[#090d16]/95 backdrop-blur-xl border-r border-[#e2e8f0] dark:border-[#161f30] flex flex-col items-center py-2 gap-1 shrink-0 transition-all select-none relative z-25 font-sans shadow-[1px_0_10px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)]"
  >
    <!-- Tool Groups -->
    <div class="flex flex-col items-center gap-1 w-full">
      <!-- 1. Cursors Group -->
      <div class="tool-slot-group relative w-full flex items-center justify-center">
        <div
          class="tool-btn-wrap flex items-center justify-center h-[32px] w-[34px] rounded-[9px] cursor-pointer hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white transition-all relative group"
          :class="{ 'active-slot': isGroupActive('cursors') }"
        >
          <button
            type="button"
            class="flex items-center justify-center flex-1 h-full text-current"
            :title="getToolMeta(activeSubtools.cursors).title"
            @click="selectTool(activeSubtools.cursors, 'cursors')"
          >
            <component :is="getToolIcon(activeSubtools.cursors)" />
          </button>
          <button
            type="button"
            class="arrow-trigger w-2.5 h-full flex items-center justify-center text-[#94a3b8] hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Cursors"
            @click.stop="toggleFlyout('cursors')"
          >
            <svg width="5" height="8" viewBox="0 0 10 16"><path fill="currentColor" d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>
          </button>
        </div>

        <!-- Flyout Drawer -->
        <div v-if="openFlyout === 'cursors'" class="flyout-drawer" @click.stop>
          <div class="flyout-header">CURSORS</div>
          <div
            v-for="t in toolGroups.cursors"
            :key="t.id"
            class="flyout-item"
            :class="{ active: activeTool === t.id }"
            @click="selectSubtool(t.id, 'cursors')"
          >
            <div class="flex items-center gap-2.5">
              <component :is="t.icon" class="w-4 h-4" />
              <span class="text-xs font-medium">{{ t.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="t.hotkey" class="hotkey-pill">{{ t.hotkey }}</span>
              <button
                type="button"
                class="star-btn"
                :class="{ starred: isFavorite(t.id) }"
                @click.stop="toggleFavorite(t.id)"
              >
                ★
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Trend Lines Group -->
      <div class="tool-slot-group relative w-full flex items-center justify-center">
        <div
          class="tool-btn-wrap flex items-center justify-center h-[32px] w-[34px] rounded-[9px] cursor-pointer hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white transition-all relative group"
          :class="{ 'active-slot': isGroupActive('trend') }"
        >
          <button
            type="button"
            class="flex items-center justify-center flex-1 h-full text-current"
            :title="getToolMeta(activeSubtools.trend).title"
            @click="selectTool(activeSubtools.trend, 'trend')"
          >
            <component :is="getToolIcon(activeSubtools.trend)" />
          </button>
          <button
            type="button"
            class="arrow-trigger w-2.5 h-full flex items-center justify-center text-[#94a3b8] hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Trend Line Tools"
            @click.stop="toggleFlyout('trend')"
          >
            <svg width="5" height="8" viewBox="0 0 10 16"><path fill="currentColor" d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>
          </button>
        </div>

        <div v-if="openFlyout === 'trend'" class="flyout-drawer" @click.stop>
          <div class="flyout-header">LINES & TRENDS</div>
          <div
            v-for="t in toolGroups.trend"
            :key="t.id"
            class="flyout-item"
            :class="{ active: activeTool === t.id }"
            @click="selectSubtool(t.id, 'trend')"
          >
            <div class="flex items-center gap-2.5">
              <component :is="t.icon" class="w-4 h-4" />
              <span class="text-xs font-medium">{{ t.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="t.hotkey" class="hotkey-pill">{{ t.hotkey }}</span>
              <button
                type="button"
                class="star-btn"
                :class="{ starred: isFavorite(t.id) }"
                @click.stop="toggleFavorite(t.id)"
              >
                ★
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Gann and Fibonacci Group -->
      <div class="tool-slot-group relative w-full flex items-center justify-center">
        <div
          class="tool-btn-wrap flex items-center justify-center h-[32px] w-[34px] rounded-[9px] cursor-pointer hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white transition-all relative group"
          :class="{ 'active-slot': isGroupActive('fib') }"
        >
          <button
            type="button"
            class="flex items-center justify-center flex-1 h-full text-current"
            :title="getToolMeta(activeSubtools.fib).title"
            @click="selectTool(activeSubtools.fib, 'fib')"
          >
            <component :is="getToolIcon(activeSubtools.fib)" />
          </button>
          <button
            type="button"
            class="arrow-trigger w-2.5 h-full flex items-center justify-center text-[#94a3b8] hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Fibonacci & Gann Tools"
            @click.stop="toggleFlyout('fib')"
          >
            <svg width="5" height="8" viewBox="0 0 10 16"><path fill="currentColor" d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>
          </button>
        </div>

        <div v-if="openFlyout === 'fib'" class="flyout-drawer" @click.stop>
          <div class="flyout-header">GANN AND FIBONACCI</div>
          <div
            v-for="t in toolGroups.fib"
            :key="t.id"
            class="flyout-item"
            :class="{ active: activeTool === t.id }"
            @click="selectSubtool(t.id, 'fib')"
          >
            <div class="flex items-center gap-2.5">
              <component :is="t.icon" class="w-4 h-4" />
              <span class="text-xs font-medium">{{ t.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="t.hotkey" class="hotkey-pill">{{ t.hotkey }}</span>
              <button
                type="button"
                class="star-btn"
                :class="{ starred: isFavorite(t.id) }"
                @click.stop="toggleFavorite(t.id)"
              >
                ★
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Geometric Shapes Group -->
      <div class="tool-slot-group relative w-full flex items-center justify-center">
        <div
          class="tool-btn-wrap flex items-center justify-center h-[32px] w-[34px] rounded-[9px] cursor-pointer hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white transition-all relative group"
          :class="{ 'active-slot': isGroupActive('shapes') }"
        >
          <button
            type="button"
            class="flex items-center justify-center flex-1 h-full text-current"
            :title="getToolMeta(activeSubtools.shapes).title"
            @click="selectTool(activeSubtools.shapes, 'shapes')"
          >
            <component :is="getToolIcon(activeSubtools.shapes)" />
          </button>
          <button
            type="button"
            class="arrow-trigger w-2.5 h-full flex items-center justify-center text-[#94a3b8] hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Geometric Shapes"
            @click.stop="toggleFlyout('shapes')"
          >
            <svg width="5" height="8" viewBox="0 0 10 16"><path fill="currentColor" d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>
          </button>
        </div>

        <div v-if="openFlyout === 'shapes'" class="flyout-drawer" @click.stop>
          <div class="flyout-header">GEOMETRIC SHAPES</div>
          <div
            v-for="t in toolGroups.shapes"
            :key="t.id"
            class="flyout-item"
            :class="{ active: activeTool === t.id }"
            @click="selectSubtool(t.id, 'shapes')"
          >
            <div class="flex items-center gap-2.5">
              <component :is="t.icon" class="w-4 h-4" />
              <span class="text-xs font-medium">{{ t.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="t.hotkey" class="hotkey-pill">{{ t.hotkey }}</span>
              <button
                type="button"
                class="star-btn"
                :class="{ starred: isFavorite(t.id) }"
                @click.stop="toggleFavorite(t.id)"
              >
                ★
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Annotation Tools Group -->
      <div class="tool-slot-group relative w-full flex items-center justify-center">
        <div
          class="tool-btn-wrap flex items-center justify-center h-[32px] w-[34px] rounded-[9px] cursor-pointer hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white transition-all relative group"
          :class="{ 'active-slot': isGroupActive('annotation') }"
        >
          <button
            type="button"
            class="flex items-center justify-center flex-1 h-full text-current"
            :title="getToolMeta(activeSubtools.annotation).title"
            @click="selectTool(activeSubtools.annotation, 'annotation')"
          >
            <component :is="getToolIcon(activeSubtools.annotation)" />
          </button>
          <button
            type="button"
            class="arrow-trigger w-2.5 h-full flex items-center justify-center text-[#94a3b8] hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Annotation Tools"
            @click.stop="toggleFlyout('annotation')"
          >
            <svg width="5" height="8" viewBox="0 0 10 16"><path fill="currentColor" d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>
          </button>
        </div>

        <div v-if="openFlyout === 'annotation'" class="flyout-drawer" @click.stop>
          <div class="flyout-header">ANNOTATION TOOLS</div>
          <div
            v-for="t in toolGroups.annotation"
            :key="t.id"
            class="flyout-item"
            :class="{ active: activeTool === t.id }"
            @click="selectSubtool(t.id, 'annotation')"
          >
            <div class="flex items-center gap-2.5">
              <component :is="t.icon" class="w-4 h-4" />
              <span class="text-xs font-medium">{{ t.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="t.hotkey" class="hotkey-pill">{{ t.hotkey }}</span>
              <button
                type="button"
                class="star-btn"
                :class="{ starred: isFavorite(t.id) }"
                @click.stop="toggleFavorite(t.id)"
              >
                ★
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Patterns Group -->
      <div class="tool-slot-group relative w-full flex items-center justify-center">
        <div
          class="tool-btn-wrap flex items-center justify-center h-[32px] w-[34px] rounded-[9px] cursor-pointer hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white transition-all relative group"
          :class="{ 'active-slot': isGroupActive('patterns') }"
        >
          <button
            type="button"
            class="flex items-center justify-center flex-1 h-full text-current"
            :title="getToolMeta(activeSubtools.patterns).title"
            @click="selectTool(activeSubtools.patterns, 'patterns')"
          >
            <component :is="getToolIcon(activeSubtools.patterns)" />
          </button>
          <button
            type="button"
            class="arrow-trigger w-2.5 h-full flex items-center justify-center text-[#94a3b8] hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Patterns"
            @click.stop="toggleFlyout('patterns')"
          >
            <svg width="5" height="8" viewBox="0 0 10 16"><path fill="currentColor" d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>
          </button>
        </div>

        <div v-if="openFlyout === 'patterns'" class="flyout-drawer" @click.stop>
          <div class="flyout-header">PATTERNS</div>
          <div
            v-for="t in toolGroups.patterns"
            :key="t.id"
            class="flyout-item"
            :class="{ active: activeTool === t.id }"
            @click="selectSubtool(t.id, 'patterns')"
          >
            <div class="flex items-center gap-2.5">
              <component :is="t.icon" class="w-4 h-4" />
              <span class="text-xs font-medium">{{ t.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="star-btn"
                :class="{ starred: isFavorite(t.id) }"
                @click.stop="toggleFavorite(t.id)"
              >
                ★
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Prediction & Measurement Group -->
      <div class="tool-slot-group relative w-full flex items-center justify-center">
        <div
          class="tool-btn-wrap flex items-center justify-center h-[32px] w-[34px] rounded-[9px] cursor-pointer hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white transition-all relative group"
          :class="{ 'active-slot': isGroupActive('prediction') }"
        >
          <button
            type="button"
            class="flex items-center justify-center flex-1 h-full text-current"
            :title="getToolMeta(activeSubtools.prediction).title"
            @click="selectTool(activeSubtools.prediction, 'prediction')"
          >
            <component :is="getToolIcon(activeSubtools.prediction)" />
          </button>
          <button
            type="button"
            class="arrow-trigger w-2.5 h-full flex items-center justify-center text-[#94a3b8] hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Prediction and Measurement"
            @click.stop="toggleFlyout('prediction')"
          >
            <svg width="5" height="8" viewBox="0 0 10 16"><path fill="currentColor" d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>
          </button>
        </div>

        <div v-if="openFlyout === 'prediction'" class="flyout-drawer" @click.stop>
          <div class="flyout-header">PREDICTION & MEASUREMENT</div>
          <div
            v-for="t in toolGroups.prediction"
            :key="t.id"
            class="flyout-item"
            :class="{ active: activeTool === t.id }"
            @click="selectSubtool(t.id, 'prediction')"
          >
            <div class="flex items-center gap-2.5">
              <component :is="t.icon" class="w-4 h-4" />
              <span class="text-xs font-medium">{{ t.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="star-btn"
                :class="{ starred: isFavorite(t.id) }"
                @click.stop="toggleFavorite(t.id)"
              >
                ★
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 8. Icons / Stickers -->
      <div class="tool-slot-group relative w-full flex items-center justify-center">
        <button
          type="button"
          class="tool-single-btn h-[32px] w-[34px] flex items-center justify-center rounded-[9px] text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 transition-all cursor-pointer relative"
          :class="{ 'active-slot': activeTool === 'smile' }"
          title="Icons & Stickers"
          @click="selectTool('smile', 'stickers')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" stroke-width="2.6" stroke-linecap="round" />
            <line x1="15" y1="9" x2="15.01" y2="9" stroke-width="2.6" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Gradient Ambient Divider -->
    <div class="w-5 h-px bg-gradient-to-r from-transparent via-[#cbd5e1] dark:via-[#1e293b] to-transparent my-1 shrink-0"></div>

    <!-- Utility & Control Tools -->
    <div class="flex flex-col items-center gap-1 w-full mt-auto">
      <!-- 9. Measure Ruler -->
      <button
        type="button"
        class="tool-single-btn h-[32px] w-[34px] flex items-center justify-center rounded-[9px] text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 transition-all cursor-pointer relative"
        :class="{ 'active-slot': activeTool === 'measure' }"
        title="Measure (Shift + Click)"
        @click="selectTool('measure')"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M3 9 9 3l12 12-6 6z" />
          <path d="m7 7 2 2M10 4l2 2M13 7l2 2M16 10l2 2" />
        </svg>
      </button>

      <!-- 10. Zoom In -->
      <button
        type="button"
        class="tool-single-btn h-[32px] w-[34px] flex items-center justify-center rounded-[9px] text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 transition-all cursor-pointer relative"
        :class="{ 'active-slot': activeTool === 'zoom-in' }"
        title="Zoom in"
        @click="selectTool('zoom-in')"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
        </svg>
      </button>

      <!-- 11. Magnet Mode -->
      <button
        type="button"
        class="tool-single-btn h-[32px] w-[34px] flex items-center justify-center rounded-[9px] text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 transition-all cursor-pointer relative"
        :class="{ 'active-slot': magnetMode }"
        title="Magnet Mode (Snaps drawings to bars)"
        @click="magnetMode = !magnetMode"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="m6 15-3-3 6.7-6.7a4 4 0 0 1 5.6 0l2.4 2.4a4 4 0 0 1 0 5.6L11 20l-3-3" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </button>

      <!-- 12. Stay in Drawing Mode -->
      <button
        type="button"
        class="tool-single-btn h-[32px] w-[34px] flex items-center justify-center rounded-[9px] text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 transition-all cursor-pointer relative"
        :class="{ 'active-slot': stayInDrawingMode }"
        title="Stay in Drawing Mode"
        @click="stayInDrawingMode = !stayInDrawingMode"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="m18 2 4 4-12 12H6v-4L18 2z" />
          <path d="m15 5 4 4" />
        </svg>
      </button>

      <!-- 13. Lock All Drawings -->
      <button
        type="button"
        class="tool-single-btn h-[32px] w-[34px] flex items-center justify-center rounded-[9px] text-[#64748b] dark:text-[#7d8b9d] hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer relative"
        :class="drawingsLocked ? 'bg-rose-500/10 dark:bg-rose-950/40 text-rose-500 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.25)]' : ''"
        title="Lock All Drawing Tools"
        @click="toggleLockDrawings"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </button>

      <!-- 14. Hide All Drawings (Eye) -->
      <button
        type="button"
        class="tool-single-btn h-[32px] w-[34px] flex items-center justify-center rounded-[9px] text-[#64748b] dark:text-[#7d8b9d] hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all cursor-pointer relative"
        :class="drawingsHidden ? 'bg-amber-500/10 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)]' : ''"
        title="Hide / Show all drawings"
        @click="toggleHideDrawings"
      >
        <svg v-if="!drawingsHidden" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
      </button>

      <!-- 15. Remove / Trash can with flyout -->
      <div class="relative w-full flex items-center justify-center">
        <button
          type="button"
          class="tool-single-btn h-[32px] w-[34px] flex items-center justify-center rounded-[9px] text-[#64748b] dark:text-[#7d8b9d] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer relative"
          title="Remove drawings"
          @click.stop="toggleFlyout('trash')"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          </svg>
        </button>

        <div v-if="openFlyout === 'trash'" class="flyout-drawer" @click.stop>
          <div class="flyout-header">
            <span>REMOVE TOOLS</span>
          </div>
          <div class="flyout-item" @click="handleClear('drawings')">
            <span class="text-xs font-semibold text-rose-500">Remove Drawings</span>
          </div>
          <div class="flyout-item" @click="handleClear('indicators')">
            <span class="text-xs font-medium">Remove Indicators</span>
          </div>
          <div class="flyout-item" @click="handleClear('all')">
            <span class="text-xs font-bold text-rose-600 dark:text-rose-400">Remove Drawings & Indicators</span>
          </div>
        </div>
      </div>

      <!-- 16. Star / Favorites Toolbar toggle -->
      <button
        type="button"
        class="tool-single-btn h-[32px] w-[34px] flex items-center justify-center rounded-[9px] text-[#64748b] dark:text-[#7d8b9d] hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all cursor-pointer relative mt-0.5"
        :class="showFavoritesBar ? 'bg-amber-500/10 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)]' : ''"
        title="Show Favorite Drawing Tools Toolbar"
        @click="showFavoritesBar = !showFavoritesBar"
      >
        <span class="text-base leading-none">★</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, h, onMounted, onBeforeUnmount } from 'vue';
import {
  activeTool,
  activeSubtools,
  magnetMode,
  stayInDrawingMode,
  drawingsLocked,
  drawingsHidden,
  showFavoritesBar,
  setActiveTool,
  clearDrawings,
  toggleHideDrawings,
  toggleLockDrawings,
  toggleFavorite,
  isFavorite
} from '../stores/drawings.js';
import { useNotifications } from '../stores/notifications.js';

const { notify } = useNotifications();
const openFlyout = ref(null);

function toggleFlyout(grp) {
  openFlyout.value = openFlyout.value === grp ? null : grp;
}

function selectTool(id, grp) {
  setActiveTool(id, grp);
  openFlyout.value = null;
  notify({ message: `Drawing Tool: ${getToolMeta(id).title}`, type: 'info', duration: 2000 });
}

function selectSubtool(id, grp) {
  selectTool(id, grp);
}

function handleClear(scope) {
  clearDrawings(scope);
  openFlyout.value = null;
  notify({ message: `Cleared ${scope}`, type: 'info', duration: 2500 });
}

function isGroupActive(grp) {
  const currentSub = activeSubtools.value[grp];
  return activeTool.value === currentSub;
}

// ── SVG Icon Definitions ──────────────────────────────────────────
const IconCross = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 28 28', width: '20', height: '20', fill: 'currentColor' }, [
  h('path', { d: 'M18 15h8v-1h-8zM14 18v8h1v-8zM14 3v8h1v-8zM3 15h8v-1h-8z' })
]);
const IconDot = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'currentColor' }, [
  h('circle', { cx: '12', cy: '12', r: '3.5' })
]);
const IconArrow = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { d: 'm3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z' })
]);
const IconEraser = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('path', { d: 'm19 14-7 7-6-6 7-7 6 6zM5 21h14' })
]);

const IconTrendline = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 28 28', width: '20', height: '20', fill: 'currentColor' }, [
  h('path', { d: 'M7.354 21.354l14-14-.707-.707-14 14z' }),
  h('circle', { cx: '22', cy: '7', r: '2.5' }),
  h('circle', { cx: '6', cy: '23', r: '2.5' })
]);
const IconRay = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('line', { x1: '4', y1: '20', x2: '20', y2: '4' }),
  h('circle', { cx: '4', cy: '20', r: '2', fill: 'currentColor' })
]);
const IconHLine = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('line', { x1: '3', y1: '12', x2: '21', y2: '12' })
]);
const IconVLine = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('line', { x1: '12', y1: '3', x2: '12', y2: '21' })
]);
const IconChannel = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('line', { x1: '4', y1: '16', x2: '18', y2: '4' }),
  h('line', { x1: '6', y1: '20', x2: '20', y2: '8' })
]);

const IconFib = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('line', { x1: '3', y1: '5', x2: '21', y2: '5' }),
  h('line', { x1: '3', y1: '10', x2: '21', y2: '10' }),
  h('line', { x1: '3', y1: '15', x2: '21', y2: '15' }),
  h('line', { x1: '3', y1: '20', x2: '21', y2: '20' })
]);
const IconPitchfork = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('line', { x1: '4', y1: '20', x2: '12', y2: '12' }),
  h('line', { x1: '12', y1: '12', x2: '12', y2: '4' }),
  h('line', { x1: '12', y1: '12', x2: '6', y2: '4' }),
  h('line', { x1: '12', y1: '12', x2: '18', y2: '4' })
]);

const IconRectangle = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('rect', { x: '4', y: '5', width: '16', height: '14', rx: '1' })
]);
const IconCircle = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('circle', { cx: '12', cy: '12', r: '8' })
]);
const IconBrush = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('path', { d: 'M4 20c2-2 4-3 4-6 0-2 2-4 4-4' }),
  h('path', { d: 'm14 4 6 6-9 9H5v-6z' })
]);
const IconHighlighter = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('path', { d: 'm9 11-6 6v3h3l6-6' }),
  h('path', { d: 'm22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4' })
]);

const IconText = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('path', { d: 'M5 7V5h14v2M12 5v14M9 19h6' })
]);
const IconCallout = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' })
]);

const IconPatterns = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('path', { d: 'M4 18l4-10 4 8 4-12 4 14' })
]);

const IconLongPos = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('rect', { x: '4', y: '4', width: '16', height: '7', rx: '1', fill: 'rgba(8,153,129,0.3)', stroke: '#089981' }),
  h('rect', { x: '4', y: '11', width: '16', height: '9', rx: '1', fill: 'rgba(242,54,69,0.3)', stroke: '#f23645' })
]);
const IconShortPos = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }, [
  h('rect', { x: '4', y: '4', width: '16', height: '9', rx: '1', fill: 'rgba(242,54,69,0.3)', stroke: '#f23645' }),
  h('rect', { x: '4', y: '13', width: '16', height: '7', rx: '1', fill: 'rgba(8,153,129,0.3)', stroke: '#089981' })
]);

// ── Tool Groups Data ──────────────────────────────────────────────
const toolGroups = {
  cursors: [
    { id: 'cursor', name: 'Cross', title: 'Cross', icon: IconCross },
    { id: 'dot',    name: 'Dot',   title: 'Dot',   icon: IconDot },
    { id: 'arrow',  name: 'Arrow', title: 'Arrow', icon: IconArrow },
    { id: 'eraser', name: 'Eraser',title: 'Eraser',icon: IconEraser }
  ],
  trend: [
    { id: 'trend',    name: 'Trendline',       title: 'Trendline',       hotkey: 'Alt + T', icon: IconTrendline },
    { id: 'ray',      name: 'Ray',             title: 'Ray',             icon: IconRay },
    { id: 'h-line',   name: 'Horizontal Line', title: 'Horizontal Line', hotkey: 'Alt + H', icon: IconHLine },
    { id: 'v-line',   name: 'Vertical Line',   title: 'Vertical Line',   hotkey: 'Alt + V', icon: IconVLine },
    { id: 'channel',  name: 'Parallel Channel',title: 'Parallel Channel',icon: IconChannel }
  ],
  fib: [
    { id: 'fib-retracement', name: 'Fib Retracement', title: 'Fib Retracement', hotkey: 'Alt + F', icon: IconFib },
    { id: 'pitchfork',       name: 'Pitchfork',       title: 'Pitchfork',       icon: IconPitchfork }
  ],
  shapes: [
    { id: 'rectangle',   name: 'Rectangle',   title: 'Rectangle',   icon: IconRectangle },
    { id: 'circle',      name: 'Circle',      title: 'Circle',      icon: IconCircle },
    { id: 'brush',       name: 'Brush',       title: 'Brush',       icon: IconBrush },
    { id: 'highlighter', name: 'Highlighter', title: 'Highlighter', icon: IconHighlighter }
  ],
  annotation: [
    { id: 'text',    name: 'Text',    title: 'Text Annotation', hotkey: 'Alt + T', icon: IconText },
    { id: 'callout', name: 'Callout', title: 'Callout Bubble',  icon: IconCallout }
  ],
  patterns: [
    { id: 'head-shoulders', name: 'Head & Shoulders', title: 'Head & Shoulders Pattern', icon: IconPatterns },
    { id: 'xabcd',          name: 'XABCD Pattern',    title: 'XABCD Harmonic Pattern',    icon: IconPatterns }
  ],
  prediction: [
    { id: 'long-pos',  name: 'Long Position',  title: 'Long Position (Risk:Reward)',  icon: IconLongPos },
    { id: 'short-pos', name: 'Short Position', title: 'Short Position (Risk:Reward)', icon: IconShortPos }
  ]
};

const allToolsFlat = Object.values(toolGroups).flat();

function getToolMeta(id) {
  const f = allToolsFlat.find(t => t.id === id);
  return f || { title: id, name: id };
}

function getToolIcon(id) {
  const f = allToolsFlat.find(t => t.id === id);
  return f ? f.icon : IconCross;
}

// Global click outside to dismiss flyouts
function handleGlobalClick() {
  openFlyout.value = null;
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick);
});
</script>

<style scoped>
.tool-btn-wrap,
.tool-single-btn {
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.tool-btn-wrap:hover,
.tool-single-btn:hover {
  transform: translateY(-0.5px);
}

.tool-btn-wrap:active,
.tool-single-btn:active {
  transform: scale(0.93);
}

/* Active Slot: LIGHT THEME DEFAULT (Clean blueish with soft white highlights matching left rail) */
.active-slot {
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%) !important;
  color: #2563eb !important;
  border: 1px solid rgba(147, 197, 253, 0.9) !important;
  box-shadow: 0 1px 4px rgba(37, 99, 235, 0.14), inset 0 1px 1.5px rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(8px) !important;
}

/* Micro-accent indicator on active slot */
.active-slot::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 18px;
  border-radius: 0 4px 4px 0;
  background: #2563eb;
  box-shadow: 0 0 6px rgba(37, 99, 235, 0.5);
  pointer-events: none;
}

/* Active Slot: DARK THEME (Cyan-blue glow for dark mode) */
:global(.dark) .active-slot,
:global([data-theme="dark"]) .active-slot,
:global(.darkTheme) .active-slot,
:global(html.dark) .active-slot,
:global(body.darkTheme) .active-slot {
  background: linear-gradient(180deg, rgba(37, 99, 235, 0.45) 0%, rgba(17, 34, 78, 0.7) 100%), rgba(255, 255, 255, 0.12) !important;
  color: #7dd3fc !important;
  border: 1px solid rgba(186, 230, 253, 0.52) !important;
  box-shadow: 0 0 14px rgba(56, 189, 248, 0.35), inset 0 1px 1.5px rgba(255, 255, 255, 0.35) !important;
}

:global(.dark) .active-slot::before,
:global([data-theme="dark"]) .active-slot::before,
:global(.darkTheme) .active-slot::before,
:global(html.dark) .active-slot::before,
:global(body.darkTheme) .active-slot::before {
  background: linear-gradient(180deg, #38bdf8, #60a5fa, #818cf8);
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.95);
}

/* Cyber-Glass Flyout Drawers */
.flyout-drawer {
  position: absolute;
  left: calc(100% + 6px);
  top: -4px;
  width: 252px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 12px;
  box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.12), 0 0 16px rgba(37, 99, 235, 0.06);
  padding: 6px;
  z-index: 60;
  color: #0f172a;
  animation: flyoutSlideIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

:global(.dark) .flyout-drawer,
:global([data-theme="dark"]) .flyout-drawer,
:global(.darkTheme) .flyout-drawer,
:global(html.dark) .flyout-drawer,
:global(body.darkTheme) .flyout-drawer {
  background: rgba(11, 17, 28, 0.96);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(56, 189, 248, 0.25);
  box-shadow: 0 20px 40px -4px rgba(0, 0, 0, 0.7), 0 0 20px rgba(56, 189, 248, 0.15);
  color: #e2e8f0;
}

@keyframes flyoutSlideIn {
  from {
    opacity: 0;
    transform: translateX(-6px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.flyout-header {
  padding: 6px 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #64748b;
  border-bottom: 1px solid rgba(226, 232, 240, 0.7);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:global(.dark) .flyout-header,
:global([data-theme="dark"]) .flyout-header,
:global(.darkTheme) .flyout-header,
:global(html.dark) .flyout-header,
:global(body.darkTheme) .flyout-header {
  border-bottom: 1px solid rgba(22, 31, 48, 0.8);
  color: #38bdf8;
  text-shadow: 0 0 10px rgba(56, 189, 248, 0.35);
}

.flyout-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.14s ease;
  color: #475569;
}

.flyout-item:hover {
  background: rgba(241, 245, 249, 0.9);
  color: #0f172a;
  transform: translateX(2px);
}

:global(.dark) .flyout-item {
  color: #94a3b8;
}

:global(.dark) .flyout-item:hover,
:global([data-theme="dark"]) .flyout-item:hover,
:global(.darkTheme) .flyout-item:hover,
:global(html.dark) .flyout-item:hover,
:global(body.darkTheme) .flyout-item:hover {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.12), rgba(99, 102, 241, 0.06));
  color: #f1f5f9;
  transform: translateX(2px);
}

.flyout-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

:global(.dark) .flyout-item.active,
:global([data-theme="dark"]) .flyout-item.active,
:global(.darkTheme) .flyout-item.active,
:global(html.dark) .flyout-item.active,
:global(body.darkTheme) .flyout-item.active {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.22), rgba(37, 99, 235, 0.14));
  color: #38bdf8;
  border-left: 2px solid #38bdf8;
  font-weight: 600;
}

.hotkey-pill {
  font-size: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  padding: 1px 5px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid rgba(203, 213, 225, 0.6);
}

:global(.dark) .hotkey-pill,
:global([data-theme="dark"]) .hotkey-pill,
:global(.darkTheme) .hotkey-pill,
:global(html.dark) .hotkey-pill,
:global(body.darkTheme) .hotkey-pill {
  background: rgba(15, 23, 42, 0.8);
  color: #7dd3fc;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.star-btn {
  font-size: 13px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1;
  padding: 2px;
  border-radius: 4px;
}

.star-btn:hover {
  color: #f59e0b;
  transform: scale(1.15);
}

.star-btn.starred {
  color: #f59e0b;
  text-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
}
</style>
