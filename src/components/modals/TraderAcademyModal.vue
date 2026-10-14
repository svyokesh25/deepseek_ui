<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in" @click.self="$emit('close')">
      <div class="w-full max-w-3xl bg-[#0d121e] border border-[#1e2a3b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] my-auto font-sans select-none">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#1e2a3b] flex items-center justify-between bg-gradient-to-r from-purple-600/15 via-indigo-600/10 to-transparent">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-xl text-purple-400">
            🎓
          </div>
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              Trader Academy & Strategy Ground
              <span class="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                PRO
              </span>
            </h2>
            <p class="text-xs text-gray-400">Interactive learning paths, quizzes & live chart scenario practice</p>
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

      <!-- Module & View Selector Tabs -->
      <div class="px-6 py-2.5 bg-[#0a0f19] border-b border-[#1e2a3b] flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <button
            v-for="tab in [
              { id: 'quiz', label: '🧠 Interactive Quizzes' },
              { id: 'modules', label: '📚 Learning Modules' },
              { id: 'practice', label: '🎯 Strategy Practice Ground' }
            ]"
            :key="tab.id"
            type="button"
            class="px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer"
            :class="activeTab === tab.id
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        <span class="text-[11px] text-purple-400 font-mono font-bold">XP: {{ userXP }} / 500</span>
      </div>

      <!-- Main Body -->
      <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
        <!-- 1. QUIZ TAB -->
        <div v-if="activeTab === 'quiz'" class="space-y-4">
          <div class="p-4 rounded-xl bg-[#111827] border border-[#1e2a3f] space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-purple-400 font-bold uppercase tracking-wider">Question {{ currentQuizIdx + 1 }} of {{ quizQuestions.length }}</span>
              <span class="text-[10px] text-gray-400 font-mono">Streak: 🔥 {{ quizStreak }} Correct</span>
            </div>

            <h3 class="text-sm font-bold text-white leading-relaxed">
              {{ currentQuestion.question }}
            </h3>

            <!-- Options -->
            <div class="space-y-2 pt-1">
              <button
                v-for="(opt, oIdx) in currentQuestion.options"
                :key="oIdx"
                type="button"
                class="w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer"
                :class="getOptionClass(oIdx)"
                :disabled="selectedOption !== null"
                @click="chooseOption(oIdx)"
              >
                <span>{{ opt }}</span>
                <span v-if="selectedOption !== null && oIdx === currentQuestion.correct" class="text-emerald-400 font-bold">✓ Correct</span>
                <span v-else-if="selectedOption === oIdx && oIdx !== currentQuestion.correct" class="text-rose-400 font-bold">✕ Incorrect</span>
              </button>
            </div>

            <!-- Explanation & Next Button -->
            <div v-if="selectedOption !== null" class="p-3 rounded-lg bg-[#0a0e17] border border-gray-800 space-y-2 text-xs">
              <div class="text-gray-300 leading-relaxed">
                <b class="text-white">Explanation:</b> {{ currentQuestion.explanation }}
              </div>
              <div class="flex justify-end pt-1">
                <button
                  type="button"
                  class="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all text-xs cursor-pointer shadow-md"
                  @click="nextQuestion"
                >
                  {{ currentQuizIdx === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question →' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. LEARNING MODULES TAB -->
        <div v-else-if="activeTab === 'modules'" class="space-y-3">
          <div
            v-for="mod in learningModules"
            :key="mod.title"
            class="p-4 rounded-xl bg-[#111827] border border-[#1e2a3f] hover:border-purple-500/40 transition-colors space-y-2"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="text-xl">{{ mod.icon }}</span>
                <div>
                  <h4 class="text-xs font-bold text-white">{{ mod.title }}</h4>
                  <p class="text-[10px] text-gray-400">{{ mod.duration }} • {{ mod.lessons }} lessons</p>
                </div>
              </div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {{ mod.badge }}
              </span>
            </div>
            <p class="text-[11px] text-gray-300 leading-relaxed">{{ mod.desc }}</p>
          </div>
        </div>

        <!-- 3. STRATEGY PRACTICE GROUND TAB -->
        <div v-else class="space-y-4">
          <div class="p-4 rounded-xl bg-[#111827] border border-[#1e2a3f] space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-white flex items-center gap-2">
                <span>🎯 Practice Live Setup on Chart</span>
              </h4>
              <span class="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">1-Click Chart Sync</span>
            </div>
            <p class="text-xs text-gray-300 leading-relaxed">
              Select a real-market scenario below to automatically load the exact historical market setup onto your chart canvas. Practice identifying support, entry levels, and placing optimal risk/reward ratios in real-time.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div
                v-for="sc in scenarios"
                :key="sc.name"
                class="p-3.5 rounded-xl bg-[#0a0f17] border border-gray-800 hover:border-cyan-500/40 transition-all space-y-2"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white">{{ sc.name }}</span>
                  <span class="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">{{ sc.symbol }}</span>
                </div>
                <p class="text-[10.5px] text-gray-400 leading-tight">{{ sc.desc }}</p>
                <button
                  type="button"
                  class="w-full py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-[11px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  @click="practiceScenario(sc)"
                >
                  <span>⚡ Load Scenario on Chart</span>
                </button>
              </div>
            </div>
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

const emit = defineEmits(['close', 'load-symbol']);
const { notify } = useNotifications();

const activeTab = ref('quiz');
const userXP = ref(240);
const quizStreak = ref(3);

const currentQuizIdx = ref(0);
const selectedOption = ref(null);

const quizQuestions = [
  {
    question: 'What is the primary characteristic of a high-probability Fair Value Gap (FVG)?',
    options: [
      'A large consolidation of 10 inside bars with flat volume',
      'A 3-candle sequence where Candle 1 high and Candle 3 low leave an unfilled price void',
      'Any candlestick that closes below the 200 EMA',
      'A double bottom with an equal high retest'
    ],
    correct: 1,
    explanation: 'A Fair Value Gap is created when aggressive market orders cause an imbalance between Candle 1 and Candle 3, creating an inefficiency that smart money frequently retests.'
  },
  {
    question: 'If you have an account equity of $10,000 and your risk rule is 1% per trade, what is your maximum allowed loss on a trade?',
    options: [
      '$500',
      '$250',
      '$100',
      '$50'
    ],
    correct: 2,
    explanation: '1% of $10,000 is exactly $100. Sizing your stop-loss distance to equal $100 ensures that no single loss damages your account psychology or equity curve.'
  },
  {
    question: 'What indicates a genuine "Liquidity Sweep" rather than a real breakout?',
    options: [
      'Price pierces key equal highs with an immediate wick rejection and close back inside the range',
      'Price closes 5 consecutive high-volume green candles above resistance',
      'The 50 EMA crosses above the 200 EMA with expanding ATR',
      'A gap up during Sunday market open that never fills'
    ],
    correct: 0,
    explanation: 'Liquidity sweeps target retail stop-orders above obvious highs, absorbing buy orders into institutional sell limits with a rapid wick rejection back inside the value area.'
  }
];

const currentQuestion = computed(() => quizQuestions[currentQuizIdx.value]);

function chooseOption(idx) {
  selectedOption.value = idx;
  if (idx === currentQuestion.value.correct) {
    userXP.value += 50;
    quizStreak.value++;
    notify({ message: '🎯 Correct Answer! +50 XP Earned', type: 'success' });
  } else {
    quizStreak.value = 0;
  }
}

function getOptionClass(idx) {
  if (selectedOption.value === null) {
    return 'bg-[#0a0e17] border-gray-800 text-gray-200 hover:border-purple-500/50 hover:bg-white/5';
  }
  if (idx === currentQuestion.value.correct) {
    return 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200';
  }
  if (idx === selectedOption.value) {
    return 'bg-rose-950/40 border-rose-500/80 text-rose-200';
  }
  return 'bg-[#0a0e17] border-gray-800 text-gray-400 opacity-50';
}

function nextQuestion() {
  selectedOption.value = null;
  if (currentQuizIdx.value < quizQuestions.length - 1) {
    currentQuizIdx.value++;
  } else {
    currentQuizIdx.value = 0;
    notify({ message: '🏆 Quiz Completed! All modules refreshed.', type: 'info' });
  }
}

const learningModules = [
  {
    icon: '🏛️',
    title: 'Smart Money Concepts & Liquidity',
    duration: '25 min',
    lessons: 6,
    badge: 'Core Foundation',
    desc: 'Master institutional order flow, fair value gaps, liquidity pools, and market structure shifts (BOS/CHoCH).'
  },
  {
    icon: '🛡️',
    title: 'Risk Management & Capital Preservation',
    duration: '18 min',
    lessons: 4,
    badge: 'Essential',
    desc: 'The mathematical secrets of asymmetrical risk:reward ratios, position sizing formulas, and avoiding drawdown traps.'
  },
  {
    icon: '🕯️',
    title: 'Price Action & Candlestick Confirmation',
    duration: '22 min',
    lessons: 5,
    badge: 'Execution Edge',
    desc: 'Read the story behind each candle wick. Spot engulfing patterns, pinbars, and multi-timeframe confluence.'
  }
];

const scenarios = [
  {
    name: 'London Open Liquidity Sweep',
    symbol: 'XAUUSD',
    desc: 'Gold sweeps Asian session lows into 15m order block before initiating aggressive +$24 expansion.'
  },
  {
    name: 'ECB Rate Decision Breakout',
    symbol: 'EURUSD',
    desc: 'Fair value gap retest following high-impact ECB rate announcement confirmation.'
  }
];

function practiceScenario(sc) {
  notify({ message: `Loaded ${sc.name} (${sc.symbol}) onto Chart!`, type: 'info' });
  emit('load-symbol', sc.symbol);
  emit('close');
}
</script>
