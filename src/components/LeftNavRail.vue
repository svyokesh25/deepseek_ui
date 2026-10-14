<template>
  <aside class="w-[50px] bg-[#f8fafc]/95 dark:bg-[#090d16]/95 backdrop-blur-xl border-r border-[#e2e8f0] dark:border-[#161f30] flex flex-col items-center py-2.5 shrink-0 select-none z-40 relative transition-all duration-200 h-full overflow-hidden shadow-[1px_0_12px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.45)]">
    <!-- Top Profile / Brand Emblem Button -->
    <div
      class="mb-1 cursor-pointer shrink-0 relative group"
      :class="{ 'ring-2 ring-cyan-400/50 shadow-[0_0_16px_rgba(56,189,248,0.4)] rounded-xl': profileOpen }"
      data-tooltip="Profile & Accounts"
      @click="$emit('toggle-profile')"
    >
      <div class="w-[34px] h-[34px] rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-[0_0_14px_rgba(59,130,246,0.35)] group-hover:shadow-[0_0_20px_rgba(56,189,248,0.55)] group-hover:scale-105 active:scale-95 transition-all">
        <div class="w-full h-full rounded-[10px] bg-white dark:bg-[#0c1017] flex items-center justify-center transition-colors">
          <!-- Brand emblem / checkmark logo with cyber glow -->
          <svg class="w-4 h-4 text-blue-600 dark:text-cyan-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Gradient Ambient Divider -->
    <div class="w-6 h-px bg-gradient-to-r from-transparent via-[#cbd5e1] dark:via-[#1e293b] to-transparent my-1.5 shrink-0"></div>

    <!-- Navigation Icon Items -->
    <div class="flex-1 flex flex-col items-center gap-1.5 w-full overflow-y-auto no-scrollbar py-1">
      <!-- 1. Watchlist Toggle (Docked Sidebar Panel State) -->
      <button
        type="button"
        class="rail-btn relative shrink-0"
        :class="watchlistOpen
          ? 'bg-cyan-500/10 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 dark:border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
          : 'text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 border border-transparent'"
        data-tooltip="Toggle Watchlist"
        @click="$emit('toggle-watchlist')"
        aria-label="Toggle Watchlist"
      >
        <!-- Panel docked indicator dot on right edge -->
        <span
          v-if="watchlistOpen"
          class="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-3 rounded-l-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.9)]"
        ></span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
          <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
        </svg>
      </button>

      <!-- 2. Chart View -->
      <button
        type="button"
        class="rail-btn relative shrink-0"
        :class="activeNav === 'chart' ? activeClass : inactiveClass"
        data-tooltip="Live Chart"
        @click="$emit('select-nav', 'chart')"
        aria-label="Chart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
          <path d="M9 5v4" />
          <rect width="4" height="6" x="7" y="9" rx="1" />
          <path d="M9 15v2" />
          <path d="M17 3v2" />
          <rect width="4" height="8" x="15" y="5" rx="1" />
          <path d="M17 13v3" />
          <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        </svg>
      </button>

      <!-- 3. Position -->
      <button
        type="button"
        class="rail-btn relative shrink-0"
        :class="activeNav === 'position' ? activeClass : inactiveClass"
        data-tooltip="Positions"
        @click="$emit('select-nav', 'position')"
        aria-label="Position"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
          <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          <rect width="20" height="14" x="2" y="6" rx="2" />
        </svg>
      </button>

      <!-- 4. History -->
      <button
        type="button"
        class="rail-btn relative shrink-0"
        :class="activeNav === 'history' ? activeClass : inactiveClass"
        data-tooltip="Trade History"
        @click="$emit('select-nav', 'history')"
        aria-label="History"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l4 2" />
        </svg>
      </button>

      <!-- 5. API ACCESS -->
      <button
        type="button"
        class="rail-btn relative shrink-0"
        :class="activeNav === 'api' ? activeClass : inactiveClass"
        data-tooltip="API Access"
        @click="$emit('select-nav', 'api')"
        aria-label="API Access"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
          <path d="m16 18 6-6-6-6" />
          <path d="m8 6-6 6 6 6" />
        </svg>
      </button>

      <!-- 6. Refer & Earn -->
      <button
        type="button"
        class="rail-btn relative shrink-0"
        :class="activeNav === 'refer' ? activeClass : inactiveClass"
        data-tooltip="Refer &amp; Earn"
        @click="$emit('select-nav', 'refer')"
        aria-label="Refer and Earn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <path d="M16 3.128a4 4 0 0 1 0 7.744" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      </button>

      <!-- 7. Funds -->
      <button
        type="button"
        class="rail-btn relative shrink-0"
        :class="activeNav === 'funds' ? activeClass : inactiveClass"
        data-tooltip="Funds &amp; Wallet"
        @click="$emit('select-nav', 'funds')"
        aria-label="Funds"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
      </button>

      <!-- 8. Copy Trade -->
      <button
        type="button"
        class="rail-btn relative shrink-0"
        :class="activeNav === 'copy' ? activeClass : inactiveClass"
        data-tooltip="Copy Trading"
        @click="$emit('select-nav', 'copy')"
        aria-label="Copy Trade"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
          <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
          <path d="M5 21h14" />
        </svg>
      </button>

      <!-- 9. MAM -->
      <button
        type="button"
        class="rail-btn relative shrink-0"
        :class="activeNav === 'mam' ? activeClass : inactiveClass"
        data-tooltip="MAM Accounts"
        @click="$emit('select-nav', 'mam')"
        aria-label="MAM"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
          <path d="M22 10v6" />
          <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
        </svg>
      </button>

      <!-- 10. PAMM (with Gen-Z Radar Ping Notification Badge) -->
      <button
        type="button"
        class="rail-btn relative shrink-0"
        :class="activeNav === 'pamm' ? activeClass : inactiveClass"
        data-tooltip="PAMM Master"
        @click="$emit('select-nav', 'pamm')"
        aria-label="PAMM"
      >
        <!-- Pulsing radar notification badge -->
        <span class="absolute top-1.5 right-1.5 flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-tr from-rose-500 to-amber-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]"></span>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
          <path d="M10 15H6a4 4 0 0 0-4 4v2" />
          <path d="m14.305 16.53.923-.382" />
          <path d="m15.228 13.852-.923-.383" />
          <path d="m16.852 12.228-.383-.923" />
          <path d="m16.852 17.772-.383.924" />
          <path d="m19.148 12.228.383-.923" />
          <path d="m19.53 18.696-.382-.924" />
          <path d="m20.772 13.852.924-.383" />
          <path d="m20.772 16.148.924.383" />
          <circle cx="18" cy="15" r="3" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      </button>
    </div>

    <!-- Bottom Controls & Theme Switcher -->
    <div class="mt-auto flex flex-col items-center gap-1.5 w-full pb-1">
      <div class="w-6 h-px bg-gradient-to-r from-transparent via-[#cbd5e1] dark:via-[#1e293b] to-transparent mb-0.5"></div>
      
      <!-- Theme Switcher Micro-Widget -->
      <button
        id="rail-theme-toggle"
        type="button"
        class="w-[34px] h-[34px] rounded-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-90 bg-slate-100/90 dark:bg-[#121926]/90 border border-slate-200 dark:border-[#1e293b] shadow-xs group"
        :data-tooltip="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        aria-label="Toggle Theme"
        @click="toggleTheme"
      >
        <svg v-if="isDark" class="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] group-hover:rotate-45 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
        <svg v-else class="w-4 h-4 text-indigo-600 drop-shadow-[0_0_8px_rgba(79,70,229,0.5)] group-hover:-rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useTheme } from '../composables/useTheme.js'

defineProps({
  activeNav: { type: String, default: 'chart' },
  watchlistOpen: { type: Boolean, default: true },
  profileOpen: { type: Boolean, default: false }
})

defineEmits(['toggle-profile', 'toggle-watchlist', 'select-nav'])

const { isDark, toggleTheme } = useTheme()

const activeClass = 'bg-blue-50 text-blue-600 border border-blue-200 shadow-xs dark:bg-gradient-to-b dark:from-[#13233e]/95 dark:to-[#0e182a]/90 dark:text-cyan-400 dark:border-cyan-500/40 dark:shadow-[0_0_14px_rgba(56,189,248,0.25)]'
const inactiveClass = 'text-[#64748b] dark:text-[#7d8b9d] hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141c2c]/80 border border-transparent'
</script>

<style scoped>
.rail-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.rail-btn:hover {
  transform: translateY(-1px);
}

.rail-btn:active {
  transform: scale(0.92);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Next-Gen Glassmorphic Tooltip */
[data-tooltip] {
  position: relative;
}

[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%) translateX(-6px);
  background: rgba(11, 15, 25, 0.96);
  backdrop-filter: blur(12px);
  color: #f1f5f9;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.015em;
  white-space: nowrap;
  padding: 5px 10px;
  border-radius: 7px;
  border: 1px solid rgba(56, 189, 248, 0.3);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.5), 0 0 12px rgba(56, 189, 248, 0.15);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1000;
}

:global(.light) [data-tooltip]::after,
:global([data-theme="light"]) [data-tooltip]::after {
  background: rgba(255, 255, 255, 0.98);
  color: #0f172a;
  border: 1px solid rgba(203, 213, 225, 0.9);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

[data-tooltip]:hover::after {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}
</style>
