<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none font-sans" @click="$emit('close')">
      <div
        class="bg-white dark:bg-[#0a0a0a] border border-[#e3e6eb] dark:border-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transition-colors my-auto"
        @click.stop
      >
      <!-- Header -->
      <div class="px-5 py-3.5 border-b border-[#f0f2f5] dark:border-[#1a1a1a] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center text-[#ff6a00]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
              <path d="M5 21h14" />
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-bold text-[#1a1d24] dark:text-white leading-tight">Social Copy Trading Leaderboard</h2>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">Mirror verified institutional traders with 1-click execution</p>
          </div>
        </div>
        <button
          class="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1f1f1f] flex items-center justify-center cursor-pointer transition-colors"
          @click="$emit('close')"
        >✕</button>
      </div>

      <!-- Traders Grid -->
      <div class="p-5 max-h-[460px] overflow-y-auto space-y-3">
        <div
          v-for="t in traders"
          :key="t.name"
          class="p-4 rounded-xl border border-gray-200 dark:border-[#1a1a1a] bg-gray-50/60 dark:bg-[#000000] hover:border-blue-400 dark:hover:border-blue-600 transition-all flex items-center justify-between"
        >
          <!-- Left: Trader Info -->
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-blue-500/20">
              {{ t.avatar }}
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-xs text-[#1a1d24] dark:text-white">{{ t.name }}</span>
                <span class="px-1.5 py-0.2 rounded text-[9.5px] font-bold tracking-tight bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  {{ t.badge }}
                </span>
              </div>
              <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                <span>{{ t.strategy }}</span>
                <span>•</span>
                <span>{{ t.followers }} Copiers</span>
              </div>
            </div>
          </div>

          <!-- Middle: Stats -->
          <div class="flex items-center gap-6">
            <div class="text-right">
              <span class="text-[10px] text-gray-400 uppercase font-semibold block">30D Return</span>
              <span class="text-xs font-bold text-[#089981] dark:text-[#26a69a] tabular-nums">+{{ t.roi }}%</span>
            </div>
            <div class="text-right">
              <span class="text-[10px] text-gray-400 uppercase font-semibold block">Win Rate</span>
              <span class="text-xs font-bold text-[#1a1d24] dark:text-white tabular-nums">{{ t.winRate }}%</span>
            </div>
            <div class="text-right">
              <span class="text-[10px] text-gray-400 uppercase font-semibold block">Max DD</span>
              <span class="text-xs font-bold text-[#f23645] dark:text-[#ef5350] tabular-nums">{{ t.maxDd }}%</span>
            </div>
          </div>

          <!-- Right: 1-Click Action -->
          <div>
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-xs"
              :class="t.copied
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0072fd] hover:bg-[#005cd0] text-white'"
              @click="toggleCopy(t)"
            >
              {{ t.copied ? '✓ Copying' : 'Copy Trader' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { useNotifications } from '../../stores/notifications.js';

defineEmits(['close']);
const { notify } = useNotifications();

const traders = ref([
  {
    name: 'Quantum Alpha FX',
    avatar: 'QA',
    badge: 'PRO',
    strategy: 'Trend Momentum EUR/USD & Gold',
    followers: '1,482',
    roi: '214.8',
    winRate: '89.4',
    maxDd: '4.2',
    copied: false
  },
  {
    name: 'Apex Scalper X',
    avatar: 'AS',
    badge: 'ELITE',
    strategy: 'High-Frequency Breakouts',
    followers: '924',
    roi: '182.4',
    winRate: '92.1',
    maxDd: '5.8',
    copied: false
  },
  {
    name: 'London Swing Capital',
    avatar: 'LS',
    badge: 'VERIFIED',
    strategy: 'Daily Key Levels & Retests',
    followers: '610',
    roi: '124.6',
    winRate: '84.0',
    maxDd: '3.9',
    copied: false
  }
]);

function toggleCopy(t) {
  t.copied = !t.copied;
  if (t.copied) {
    notify({ message: `Successfully subscribed to copy ${t.name}`, type: 'info' });
  } else {
    notify({ message: `Stopped copying ${t.name}`, type: 'info' });
  }
}
</script>
