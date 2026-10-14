<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in" @click.self="$emit('close')">
      <div class="w-full max-w-2xl bg-[#0e1420] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] my-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xl shadow-inner text-amber-400">
            🏆
          </div>
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              Trader Milestones & Trophies
              <span class="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                {{ unlockedCount }} / {{ totalCount }}
              </span>
            </h2>
            <p class="text-xs text-gray-400">Unlock achievements as you trade and achieve profitability</p>
          </div>
        </div>
        <button
          type="button"
          class="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Stats Progress Strip -->
      <div class="px-6 py-4 bg-[#0a0f19] border-b border-[#1e293b]">
        <div class="flex items-center justify-between text-xs mb-2">
          <span class="text-gray-400 font-medium">Overall Completion</span>
          <span class="text-amber-400 font-bold font-mono">{{ progressPct }}%</span>
        </div>
        <div class="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden p-0.5 border border-gray-700/50">
          <div
            class="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700 shadow-sm shadow-amber-500/50"
            :style="{ width: `${progressPct}%` }"
          ></div>
        </div>

        <!-- Quick stats cards -->
        <div class="grid grid-cols-4 gap-3 mt-4">
          <div class="bg-[#121a2b] border border-[#1e293b] rounded-xl p-2.5 text-center">
            <div class="text-[10px] text-gray-400 uppercase font-semibold">Total Trades</div>
            <div class="text-sm font-bold text-white font-mono mt-0.5">{{ stats.totalTrades }}</div>
          </div>
          <div class="bg-[#121a2b] border border-[#1e293b] rounded-xl p-2.5 text-center">
            <div class="text-[10px] text-gray-400 uppercase font-semibold">Win Streak</div>
            <div class="text-sm font-bold text-amber-400 font-mono mt-0.5">{{ stats.winStreak }}🔥</div>
          </div>
          <div class="bg-[#121a2b] border border-[#1e293b] rounded-xl p-2.5 text-center">
            <div class="text-[10px] text-gray-400 uppercase font-semibold">Total Profit</div>
            <div class="text-sm font-bold font-mono mt-0.5" :class="stats.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'">
              ${{ stats.totalProfit.toFixed(2) }}
            </div>
          </div>
          <div class="bg-[#121a2b] border border-[#1e293b] rounded-xl p-2.5 text-center">
            <div class="text-[10px] text-gray-400 uppercase font-semibold">Symbols</div>
            <div class="text-sm font-bold text-blue-400 font-mono mt-0.5">{{ stats.uniqueSymbols }}</div>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="px-6 py-2.5 border-b border-[#1e293b] flex items-center gap-2 bg-[#0d1320]">
        <button
          v-for="f in ['all', 'unlocked', 'locked']"
          :key="f"
          type="button"
          class="px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer capitalize"
          :class="filter === f ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'"
          @click="filter = f"
        >
          {{ f }}
        </button>
      </div>

      <!-- Achievements Grid -->
      <div class="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3.5 custom-scrollbar">
        <div
          v-for="ach in filteredAchievements"
          :key="ach.id"
          class="flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-300"
          :class="ach.unlocked
            ? 'bg-gradient-to-br from-amber-500/10 via-[#121929] to-[#0d1322] border-amber-500/30 shadow-md shadow-amber-500/5'
            : 'bg-[#101624]/60 border-[#1c2436] opacity-60 hover:opacity-80'"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform hover:scale-110 select-none"
            :class="ach.unlocked
              ? 'bg-amber-500/20 border border-amber-500/40 shadow-inner ring-2 ring-amber-500/20'
              : 'bg-gray-800/60 border border-gray-700/40 grayscale'"
          >
            {{ ach.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <h3 class="text-xs font-bold text-white truncate">{{ ach.title }}</h3>
              <span
                v-if="ach.unlocked"
                class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold shrink-0"
              >
                ✓ Done
              </span>
              <span
                v-else
                class="text-[10px] text-gray-500 font-medium shrink-0 flex items-center gap-1"
              >
                🔒 Locked
              </span>
            </div>
            <p class="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{{ ach.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3 border-t border-[#1e293b] flex items-center justify-between text-xs text-gray-400 bg-[#0a0f19]">
        <span>Keep trading to unlock more badges!</span>
        <button
          type="button"
          class="px-4 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold cursor-pointer transition-colors"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAchievements } from '../../stores/achievements.js';

defineEmits(['close']);

const filter = ref('all');
const { allAchievements, unlockedCount, totalCount, progressPct, stats } = useAchievements();

const filteredAchievements = computed(() => {
  if (filter.value === 'unlocked') return allAchievements.value.filter(a => a.unlocked);
  if (filter.value === 'locked') return allAchievements.value.filter(a => !a.unlocked);
  return allAchievements.value;
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
