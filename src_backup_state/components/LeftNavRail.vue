<template>
  <aside class="w-[48px] bg-white dark:bg-[#070a10] border-r border-[#eef0f4] dark:border-[#162032] flex flex-col items-center py-2 shrink-0 select-none z-40 relative transition-colors duration-150">
    <!-- Top Profile / Logo Button -->
    <div
      class="rail-icon topleft mb-1 cursor-pointer"
      :class="{ active: profileOpen }"
      title="Profile"
      @click="$emit('toggle-profile')"
    >
      <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-500/20 hover:scale-105 transition-transform">
        <!-- Brand emblem / checkmark logo matching original -->
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>

    <div class="w-7 h-px bg-[#eef0f4] dark:bg-[#162032] my-1"></div>

    <!-- Navigation Icon Items -->
    <div class="flex flex-col items-center gap-1 w-full">
      <!-- 1. Watchlist Toggle -->
      <button
        type="button"
        class="rail-icon"
        :class="{ active: watchlistOpen }"
        data-tooltip="Watchlist"
        @click="$emit('toggle-watchlist')"
        aria-label="Toggle Watchlist"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
        </svg>
      </button>

      <!-- 2. Chart View -->
      <button
        type="button"
        class="rail-icon"
        :class="{ active: activeNav === 'chart' }"
        data-tooltip="Chart"
        @click="$emit('select-nav', 'chart')"
        aria-label="Chart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
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
        class="rail-icon"
        :class="{ active: activeNav === 'position' }"
        data-tooltip="Position"
        @click="$emit('select-nav', 'position')"
        aria-label="Position"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          <rect width="20" height="14" x="2" y="6" rx="2" />
        </svg>
      </button>

      <!-- 4. History -->
      <button
        type="button"
        class="rail-icon"
        :class="{ active: activeNav === 'history' }"
        data-tooltip="History"
        @click="$emit('select-nav', 'history')"
        aria-label="History"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l4 2" />
        </svg>
      </button>

      <!-- 5. API ACCESS -->
      <button
        type="button"
        class="rail-icon"
        :class="{ active: activeNav === 'api' }"
        data-tooltip="API ACCESS"
        @click="$emit('select-nav', 'api')"
        aria-label="API Access"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="m16 18 6-6-6-6" />
          <path d="m8 6-6 6 6 6" />
        </svg>
      </button>

      <!-- 6. Refer & Earn -->
      <button
        type="button"
        class="rail-icon"
        :class="{ active: activeNav === 'refer' }"
        data-tooltip="Refer &amp; Earn"
        @click="$emit('select-nav', 'refer')"
        aria-label="Refer and Earn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <path d="M16 3.128a4 4 0 0 1 0 7.744" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      </button>

      <!-- 7. Funds -->
      <button
        type="button"
        class="rail-icon"
        :class="{ active: activeNav === 'funds' }"
        data-tooltip="Funds"
        @click="$emit('select-nav', 'funds')"
        aria-label="Funds"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
      </button>

      <!-- 8. Copy Trade -->
      <button
        type="button"
        class="rail-icon"
        :class="{ active: activeNav === 'copy' }"
        data-tooltip="Copy Trade"
        @click="$emit('select-nav', 'copy')"
        aria-label="Copy Trade"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
          <path d="M5 21h14" />
        </svg>
      </button>

      <!-- 9. MAM -->
      <button
        type="button"
        class="rail-icon"
        :class="{ active: activeNav === 'mam' }"
        data-tooltip="MAM"
        @click="$emit('select-nav', 'mam')"
        aria-label="MAM"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
          <path d="M22 10v6" />
          <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
        </svg>
      </button>

      <!-- 10. PAMM (with notification badge) -->
      <button
        type="button"
        class="rail-icon relative"
        :class="{ active: activeNav === 'pamm' }"
        data-tooltip="PAMM"
        @click="$emit('select-nav', 'pamm')"
        aria-label="PAMM"
      >
        <span class="w-2 h-2 rounded-full bg-[#ff5722] absolute top-2 right-2 ring-2 ring-white"></span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
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

    <div class="mt-auto"></div>
  </aside>
</template>

<script setup>
defineProps({
  activeNav: { type: String, default: 'chart' },
  watchlistOpen: { type: Boolean, default: true },
  profileOpen: { type: Boolean, default: false }
})

defineEmits(['toggle-profile', 'toggle-watchlist', 'select-nav'])
</script>

<style scoped>
.rail-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #5d6673;
  transition: all 0.15s ease;
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
}

.rail-icon svg {
  width: 19px;
  height: 19px;
  transition: transform 0.15s ease;
}

.rail-icon:hover {
  background-color: #f0f3fa;
  color: #131722;
}

.rail-icon.active {
  background-color: #e3ebff;
  color: #0072fd;
}

.rail-icon.active svg {
  stroke-width: 2.1;
}

/* Tooltip styles matching original app */
[data-tooltip] {
  position: relative;
}

[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%) translateX(-4px);
  background-color: #1a1d24;
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  padding: 5px 9px;
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(20, 24, 33, 0.22);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
  transition-delay: 0.05s;
  z-index: 1000;
}

[data-tooltip]:hover::after {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

:global([data-theme="dark"]) aside, :global(.dark) aside, :global(.darkTheme) aside {
  background-color: #070a10 !important;
  border-color: #162032 !important;
}
:global([data-theme="dark"]) .rail-icon, :global(.dark) .rail-icon, :global(.darkTheme) .rail-icon {
  color: #7e8d9f;
}
:global([data-theme="dark"]) .rail-icon:hover, :global(.dark) .rail-icon:hover, :global(.darkTheme) .rail-icon:hover {
  background-color: #121b2d;
  color: #ffffff;
}
:global([data-theme="dark"]) .rail-icon.active, :global(.dark) .rail-icon.active, :global(.darkTheme) .rail-icon.active {
  background-color: #142340;
  color: #38bdf8;
}
:global([data-theme="dark"]) [data-tooltip]::after, :global(.dark) [data-tooltip]::after, :global(.darkTheme) [data-tooltip]::after {
  background-color: #0d1322;
  color: #ffffff;
  border: 1px solid #162032;
}
</style>
