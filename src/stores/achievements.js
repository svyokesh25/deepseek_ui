// Achievements Store — Gamified trader milestones
import { ref, computed, watch } from 'vue';
import { playAchievementSound } from '../utils/soundFx.js';
import { useNotifications } from './notifications.js';

const ACHIEVEMENT_DEFS = [
  { id: 'first_trade',       icon: '🎯', title: 'First Blood',        desc: 'Place your first trade',                      check: (s) => s.totalTrades >= 1 },
  { id: 'ten_trades',        icon: '🔟', title: 'Getting Started',     desc: 'Complete 10 trades',                          check: (s) => s.totalTrades >= 10 },
  { id: 'fifty_trades',      icon: '🔥', title: 'On Fire',             desc: 'Complete 50 trades',                          check: (s) => s.totalTrades >= 50 },
  { id: 'first_profit',      icon: '💰', title: 'Ka-Ching!',           desc: 'Close your first profitable trade',           check: (s) => s.profitTrades >= 1 },
  { id: 'profit_100',        icon: '💵', title: '$100 Club',           desc: 'Earn $100 total profit',                      check: (s) => s.totalProfit >= 100 },
  { id: 'profit_1000',       icon: '🏆', title: '$1,000 Club',         desc: 'Earn $1,000 total profit',                    check: (s) => s.totalProfit >= 1000 },
  { id: 'win_streak_3',      icon: '⚡', title: 'Hot Streak',          desc: '3 profitable trades in a row',                check: (s) => s.winStreak >= 3 },
  { id: 'win_streak_5',      icon: '🌟', title: 'Unstoppable',         desc: '5 profitable trades in a row',                check: (s) => s.winStreak >= 5 },
  { id: 'win_streak_10',     icon: '💎', title: 'Diamond Hands',       desc: '10 profitable trades in a row',               check: (s) => s.winStreak >= 10 },
  { id: 'sl_streak_10',      icon: '🛡️', title: 'Iron Discipline',    desc: 'Followed stop-loss 10 times in a row',        check: (s) => (s.slStreak || 0) >= 10 },
  { id: 'zen_trader',        icon: '🧘', title: 'Zen Master',          desc: '0 revenge trades across 10 executions',       check: (s) => (s.noRevengeStreak || 0) >= 10 },
  { id: 'risk_master',       icon: '⚖️', title: 'Risk Maestro',        desc: 'Consistent lot sizing on 15 trades in a row', check: (s) => (s.properSizeStreak || 0) >= 15 },
  { id: 'journal_streak_5',  icon: '📓', title: 'Mindful Journaler',   desc: 'Logged reflections on 5 trades in a row',     check: (s) => (s.journalStreak || 0) >= 5 },
  { id: 'multi_symbol',      icon: '🌍', title: 'Diversified',         desc: 'Trade 5 different symbols',                   check: (s) => s.uniqueSymbols >= 5 },
  { id: 'scalper',           icon: '⏱️', title: 'Speed Demon',         desc: 'Close 5 trades within 1 minute',              check: (s) => s.quickTrades >= 5 },
  { id: 'night_owl',         icon: '🦉', title: 'Night Owl',           desc: 'Trade after midnight',                        check: (s) => s.nightTrades >= 1 },
];

const unlocked = ref((() => {
  try {
    const raw = localStorage.getItem('xn_achievements');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
})());

const stats = ref({
  totalTrades: 0,
  profitTrades: 0,
  totalProfit: 0,
  winStreak: 0,
  currentStreak: 0,
  slStreak: 0,
  noRevengeStreak: 0,
  properSizeStreak: 0,
  journalStreak: 0,
  uniqueSymbols: 0,
  symbolsTraded: [],
  quickTrades: 0,
  nightTrades: 0
});

function persist() {
  try { localStorage.setItem('xn_achievements', JSON.stringify(unlocked.value)); } catch {}
}

// Latest popup for animation
const latestUnlock = ref(null);

export function useAchievements() {
  function recordTrade({ symbol, pl, closedAt, slFollowed = true, isRevenge = false, isOversized = false, hasJournal = false }) {
    const s = stats.value;
    s.totalTrades++;

    if (pl > 0) {
      s.profitTrades++;
      s.totalProfit += pl;
      s.currentStreak++;
      if (s.currentStreak > s.winStreak) s.winStreak = s.currentStreak;
    } else {
      s.currentStreak = 0;
    }

    // Discipline tracking
    if (slFollowed !== false) {
      s.slStreak = (s.slStreak || 0) + 1;
    } else {
      s.slStreak = 0;
    }

    if (!isRevenge) {
      s.noRevengeStreak = (s.noRevengeStreak || 0) + 1;
    } else {
      s.noRevengeStreak = 0;
    }

    if (!isOversized) {
      s.properSizeStreak = (s.properSizeStreak || 0) + 1;
    } else {
      s.properSizeStreak = 0;
    }

    if (hasJournal) {
      s.journalStreak = (s.journalStreak || 0) + 1;
    }

    if (!s.symbolsTraded.includes(symbol)) {
      s.symbolsTraded.push(symbol);
      s.uniqueSymbols = s.symbolsTraded.length;
    }

    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) s.nightTrades++;

    // Check all achievements
    const { notify } = useNotifications();
    ACHIEVEMENT_DEFS.forEach(def => {
      if (unlocked.value.includes(def.id)) return;
      if (def.check(s)) {
        unlocked.value.push(def.id);
        persist();
        playAchievementSound();
        latestUnlock.value = def;
        notify({
          message: `${def.icon} Achievement Unlocked: ${def.title}`,
          type: 'success',
          duration: 6000
        });
        // Auto-clear popup after 4s
        setTimeout(() => {
          if (latestUnlock.value?.id === def.id) latestUnlock.value = null;
        }, 4000);
      }
    });
  }

  const allAchievements = computed(() =>
    ACHIEVEMENT_DEFS.map(def => ({
      ...def,
      unlocked: unlocked.value.includes(def.id)
    }))
  );

  const unlockedCount = computed(() => unlocked.value.length);
  const totalCount = ACHIEVEMENT_DEFS.length;
  const progressPct = computed(() => Math.round((unlockedCount.value / totalCount) * 100));

  return {
    allAchievements,
    unlockedCount,
    totalCount,
    progressPct,
    latestUnlock,
    recordTrade,
    stats
  };
}
