<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in" @click.self="$emit('close')">
      <div class="w-full max-w-2xl bg-[#0d121e] border border-[#1e2a3b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] my-auto font-sans select-none">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#1e2a3b] flex items-center justify-between bg-gradient-to-r from-amber-600/15 via-orange-600/10 to-transparent">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xl text-amber-400">
            🏆
          </div>
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              Trader Discipline Challenges
              <span class="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                ACTIVE
              </span>
            </h2>
            <p class="text-xs text-gray-400">Rewards psychological discipline, risk management & consistency over pure profit</p>
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

      <!-- Rank & XP Status Banner -->
      <div class="px-6 py-3.5 bg-[#0a0f19] border-b border-[#1e2a3b] flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-bold text-gray-900 shadow-md">
            🛡️
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-white">Discipline Rank: Level 3</span>
              <span class="text-[9.5px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300">
                Disciplined Sniper
              </span>
            </div>
            <div class="flex items-center gap-2 mt-1">
              <div class="w-36 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-amber-500 to-yellow-400 w-3/4 rounded-full"></div>
              </div>
              <span class="text-[9.5px] text-gray-400 font-mono">680 / 900 XP</span>
            </div>
          </div>
        </div>

        <div class="text-right">
          <div class="text-[10px] text-gray-400 uppercase font-semibold">Streak</div>
          <div class="text-xs font-bold text-amber-400 font-mono">🔥 6 Days Consistent</div>
        </div>
      </div>

      <!-- Filter Tabs: Daily vs Weekly -->
      <div class="px-6 py-2 bg-[#0d121c] border-b border-[#1e2a3b] flex items-center gap-2">
        <button
          type="button"
          class="px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer"
          :class="activeFilter === 'daily'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'text-gray-400 hover:text-white'"
          @click="activeFilter = 'daily'"
        >
          ⚡ Daily Quests (Resets in 8h)
        </button>
        <button
          type="button"
          class="px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer"
          :class="activeFilter === 'weekly'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'text-gray-400 hover:text-white'"
          @click="activeFilter = 'weekly'"
        >
          🗓️ Weekly Gauntlets (3 Days Left)
        </button>
      </div>

      <!-- Main Challenge Cards List -->
      <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-3">
        <div
          v-for="ch in currentChallenges"
          :key="ch.id"
          class="p-4 rounded-xl bg-[#111827] border transition-all space-y-2.5"
          :class="ch.completed ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-[#1e2a3f] hover:border-amber-500/30'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-lg">{{ ch.icon }}</span>
              <div>
                <h4 class="text-xs font-bold text-white flex items-center gap-2">
                  <span>{{ ch.title }}</span>
                  <span v-if="ch.completed" class="text-[9.5px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    COMPLETED
                  </span>
                </h4>
                <p class="text-[11px] text-gray-400">{{ ch.desc }}</p>
              </div>
            </div>

            <div class="text-right">
              <span class="text-xs font-mono font-bold text-amber-400">+{{ ch.xp }} XP</span>
            </div>
          </div>

          <!-- Progress Bar & Claim Button -->
          <div class="flex items-center justify-between gap-4 pt-1">
            <div class="flex-1 space-y-1">
              <div class="flex justify-between text-[10px] font-mono text-gray-400">
                <span>Progress: {{ ch.progress }} / {{ ch.target }}</span>
                <span>{{ Math.min(100, Math.round((ch.progress / ch.target) * 100)) }}%</span>
              </div>
              <div class="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="ch.completed ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'"
                  :style="{ width: Math.min(100, (ch.progress / ch.target) * 100) + '%' }"
                ></div>
              </div>
            </div>

            <button
              v-if="ch.completed && !ch.claimed"
              type="button"
              class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 cursor-pointer active:scale-95 transition-all"
              @click="claimReward(ch)"
            >
              Claim Reward
            </button>
            <span v-else-if="ch.claimed" class="text-[10.5px] font-mono text-gray-500">
              Claimed ✓
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useNotifications } from '../../stores/notifications.js';
import { playAchievementSound } from '../../utils/soundFx.js';

defineEmits(['close']);
const { notify } = useNotifications();

const activeFilter = ref('daily');

const dailyChallenges = ref([
  {
    id: 'd1',
    icon: '🛡️',
    title: 'Stop-Loss Guardian',
    desc: 'Attach an explicit Stop-Loss on 3 executed orders today without manual removal.',
    target: 3,
    progress: 3,
    completed: true,
    claimed: false,
    xp: 120
  },
  {
    id: 'd2',
    icon: '🧘',
    title: 'Emotional Reset',
    desc: 'Zero revenge trades: maintain at least 15 minutes between a closed loss and any new entry.',
    target: 1,
    progress: 1,
    completed: true,
    claimed: true,
    xp: 90
  },
  {
    id: 'd3',
    icon: '📓',
    title: 'Mindful Journaler',
    desc: 'Log emotions and market execution reasoning for 2 trades in your Trade Journal.',
    target: 2,
    progress: 1,
    completed: false,
    claimed: false,
    xp: 100
  }
]);

const weeklyChallenges = ref([
  {
    id: 'w1',
    icon: '📉',
    title: 'Drawdown Fortress',
    desc: 'Keep total weekly peak-to-trough account drawdown strictly under 2.5%.',
    target: 5,
    progress: 4,
    completed: false,
    claimed: false,
    xp: 250
  },
  {
    id: 'w2',
    icon: '⚖️',
    title: 'Risk Parity Standard',
    desc: 'Execute 10 consecutive trades using your recommended lot sizing without oversizing.',
    target: 10,
    progress: 8,
    completed: false,
    claimed: false,
    xp: 220
  },
  {
    id: 'w3',
    icon: '🎯',
    title: 'Asymmetrical Sniper',
    desc: 'Achieve at least a 1:2.0 Risk-to-Reward ratio on 3 profitable trade targets.',
    target: 3,
    progress: 3,
    completed: true,
    claimed: false,
    xp: 300
  }
]);

const currentChallenges = computed(() => {
  return activeFilter.value === 'daily' ? dailyChallenges.value : weeklyChallenges.value;
});

function claimReward(ch) {
  ch.claimed = true;
  playAchievementSound();
  notify({
    message: `🏆 Challenge Claimed: +${ch.xp} Discipline XP awarded!`,
    type: 'success'
  });
}
</script>
