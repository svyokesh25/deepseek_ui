<template>
  <div class="mini-pnl-strip bg-[#f8fafc]/95 dark:bg-[#0a0e17]/95 backdrop-blur-md border-b border-[#e2e8f0] dark:border-[#1a2333] px-3 py-1 flex items-center justify-between text-xs select-none relative z-30 transition-colors">
    <!-- Left: Live Account Metrics -->
    <div class="flex items-center gap-3">
      <!-- Floating P/L Pill -->
      <div
        class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border font-mono font-bold transition-all shadow-xs"
        :class="totalPl >= 0
          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
          : 'bg-red-50 text-red-700 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'"
        title="Current Floating Unrealized P/L"
      >
        <span class="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400">P/L</span>
        <span>{{ totalPl >= 0 ? '+' : '' }}${{ totalPl.toFixed(2) }}</span>
      </div>

      <!-- Equity -->
      <div class="hidden sm:flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
        <span class="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500">Equity:</span>
        <span class="font-mono text-gray-900 dark:text-white font-medium">${{ equity.toFixed(2) }}</span>
      </div>

      <!-- Balance -->
      <div class="hidden md:flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
        <span class="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500">Bal:</span>
        <span class="font-mono text-gray-700 dark:text-gray-300 font-medium">${{ balance.toFixed(2) }}</span>
      </div>

      <!-- Active positions badge -->
      <div class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
        <span class="w-1.5 h-1.5 rounded-full" :class="positionCount > 0 ? 'bg-blue-500 dark:bg-blue-400 animate-pulse' : 'bg-gray-400 dark:bg-gray-600'"></span>
        <span class="text-[11px] font-mono text-gray-700 dark:text-gray-300">{{ positionCount }} open</span>
      </div>
    </div>

    <!-- Right: Quick Feature Shortcuts Strip -->
    <div class="flex items-center gap-1 text-[11px]">
      <!-- 1. Sound FX Toggle -->
      <button
        type="button"
        class="px-2 py-0.5 rounded-md hover:bg-gray-200/80 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 text-gray-700 dark:text-gray-300"
        :title="soundActive ? 'Mute Sound FX' : 'Enable Sound FX'"
        @click="toggleSound"
      >
        <span>{{ soundActive ? '🔊' : '🔇' }}</span>
        <span class="hidden lg:inline text-[10px] text-gray-500 dark:text-gray-400">Sound</span>
      </button>

      <!-- 2. Economic Calendar Button -->
      <button
        type="button"
        class="px-2 py-0.5 rounded-md hover:bg-gray-200/80 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 text-gray-700 dark:text-gray-300"
        title="Open Economic Calendar"
        @click="$emit('open-calendar')"
      >
        <span>📅</span>
        <span class="hidden lg:inline text-[10px] text-gray-500 dark:text-gray-400">Calendar</span>
      </button>

      <!-- 3. Price Alerts Button -->
      <button
        type="button"
        class="px-2 py-0.5 rounded-md hover:bg-gray-200/80 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 text-gray-700 dark:text-gray-300 relative"
        title="Open Smart Price Alerts"
        @click="$emit('open-alerts')"
      >
        <span>🔔</span>
        <span class="hidden lg:inline text-[10px] text-gray-500 dark:text-gray-400">Alerts</span>
        <span
          v-if="activeAlertsCount > 0"
          class="w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center font-mono"
        >
          {{ activeAlertsCount }}
        </span>
      </button>

      <!-- 4. Trade Journal Button -->
      <button
        type="button"
        class="px-2 py-0.5 rounded-md hover:bg-gray-200/80 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 text-gray-700 dark:text-gray-300"
        title="Open Trade Journal"
        @click="$emit('open-journal')"
      >
        <span>📝</span>
        <span class="hidden lg:inline text-[10px] text-gray-500 dark:text-gray-400">Journal</span>
      </button>

      <!-- 5. Achievements Trophy Button -->
      <button
        type="button"
        class="px-2 py-0.5 rounded-md hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 transition-colors cursor-pointer flex items-center gap-1 border border-amber-500/30 dark:border-amber-500/20 bg-amber-500/10"
        title="Open Trader Trophies"
        @click="$emit('open-achievements')"
      >
        <span>🏆</span>
        <span class="text-[10px] font-bold font-mono">{{ unlockedAchievementsCount }}</span>
      </button>

      <!-- 6. Discipline Challenges Button -->
      <button
        type="button"
        class="px-2 py-0.5 rounded-md hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 border border-amber-500/25 bg-amber-500/5"
        title="Open Discipline Challenges"
        @click="$emit('open-challenges')"
      >
        <span>🎯</span>
        <span class="hidden md:inline text-[10px] font-bold">Quests</span>
      </button>

      <!-- 7. Trader Academy & Quizzes Button -->
      <button
        type="button"
        class="px-2 py-0.5 rounded-md hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 transition-colors cursor-pointer flex items-center gap-1 border border-purple-500/25 bg-purple-500/5"
        title="Open Trader Academy & Quizzes"
        @click="$emit('open-academy')"
      >
        <span>🎓</span>
        <span class="hidden md:inline text-[10px] font-bold">Academy</span>
      </button>

      <!-- 8. Sentiment Matrix Button -->
      <button
        type="button"
        class="px-2 py-0.5 rounded-md hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1 border border-cyan-500/25 bg-cyan-500/5"
        title="Open Institutional Sentiment & News Catalyst Scorecard"
        @click="$emit('open-sentiment')"
      >
        <span>📊</span>
        <span class="hidden md:inline text-[10px] font-bold">Sentiment</span>
      </button>

      <!-- 9. Theme Studio Button -->
      <button
        type="button"
        class="px-2 py-0.5 rounded-md hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 transition-colors cursor-pointer flex items-center gap-1 border border-purple-500/30 dark:border-purple-500/20 bg-purple-500/10 ml-0.5"
        title="Chart Theme Studio"
        @click="$emit('open-theme-studio')"
      >
        <span>🎨</span>
        <span class="hidden xl:inline text-[10px] font-semibold">Theme</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePositions } from '../../stores/positions.js';
import { usePriceAlerts } from '../../stores/priceAlerts.js';
import { useAchievements } from '../../stores/achievements.js';
import { isSoundEnabled, setSoundEnabled } from '../../utils/soundFx.js';

defineEmits([
  'open-calendar',
  'open-alerts',
  'open-journal',
  'open-achievements',
  'open-theme-studio',
  'open-challenges',
  'open-academy',
  'open-sentiment'
]);

const { totalPl, equity, balance, positionCount } = usePositions();
const { activeAlerts } = usePriceAlerts();
const { unlockedCount: unlockedAchievementsCount } = useAchievements();

const soundActive = ref(isSoundEnabled());
const activeAlertsCount = ref(activeAlerts.value.length);

function toggleSound() {
  soundActive.value = !soundActive.value;
  setSoundEnabled(soundActive.value);
}
</script>
