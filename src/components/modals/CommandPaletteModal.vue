<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-start justify-center pt-24 p-4 select-none font-sans"
      @click.self="$emit('close')"
    >
    <div class="bg-white dark:bg-[#0a0a0a] rounded-xl shadow-2xl border border-[#e3e6eb] dark:border-[#1a1a1a] w-full max-w-[560px] overflow-hidden transition-colors flex flex-col">
      <!-- Search Input Header -->
      <div class="p-3 border-b border-[#f0f2f5] dark:border-[#1a1a1a] flex items-center gap-3">
        <svg class="w-4 h-4 text-[#8a94a6] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          class="w-full bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
          placeholder="Search symbols, indicators, drawing tools, settings... (ESC to close)"
          autocomplete="off"
          @keydown.esc="$emit('close')"
        />
        <span class="text-[10px] font-mono bg-gray-100 dark:bg-[#1a1a1a] px-1.5 py-0.5 rounded text-gray-500">ESC</span>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-1.5 px-3 py-2 border-b border-[#f0f2f5] dark:border-[#1a1a1a] overflow-x-auto text-[11px]">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="px-2.5 py-1 rounded-full cursor-pointer transition-colors font-medium whitespace-nowrap"
          :class="activeCategory === cat
            ? 'bg-[#0072fd] text-white'
            : 'bg-gray-100 dark:bg-[#151515] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Results List -->
      <div class="max-h-[340px] overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#1a1a1a] p-2">
        <div
          v-for="(item, idx) in filteredItems"
          :key="item.title + idx"
          class="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f6f8fb] dark:hover:bg-[#151515] cursor-pointer transition-colors group"
          @click="onSelect(item)"
        >
          <div class="flex items-center gap-3">
            <div class="w-7 h-7 rounded bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:text-[#0072fd] transition-colors">
              <span class="text-xs">{{ item.icon || '⚡' }}</span>
            </div>
            <div>
              <div class="font-semibold text-gray-900 dark:text-gray-100 text-xs">{{ item.title }}</div>
              <div class="text-[10px] text-gray-400 dark:text-gray-500">{{ item.subtitle }}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="item.badge" class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 font-mono">
              {{ item.badge }}
            </span>
            <span class="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Select ↵</span>
          </div>
        </div>

        <div v-if="filteredItems.length === 0" class="py-8 text-center text-gray-400 text-xs">
          No matches found for "{{ query }}"
        </div>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'select-symbol', 'select-indicator', 'select-tool', 'open-settings', 'action']);

const query = ref('');
const activeCategory = ref('All');
const categories = ['All', 'Symbols', 'Indicators', 'Drawing Tools', 'Actions'];
const inputRef = ref(null);

const allItems = [
  // Symbols
  { category: 'Symbols', title: 'XAUUSD', subtitle: 'Gold Spot / US Dollar (OANDA)', icon: '🥇', type: 'symbol', value: 'XAUUSD' },
  { category: 'Symbols', title: 'EURUSD', subtitle: 'Euro / US Dollar (FOREX)', icon: '💶', type: 'symbol', value: 'EURUSD' },
  { category: 'Symbols', title: 'BTCUSD', subtitle: 'Bitcoin / US Dollar (CRYPTO)', icon: '₿', type: 'symbol', value: 'BTCUSD' },
  { category: 'Symbols', title: 'GBPUSD', subtitle: 'British Pound / US Dollar', icon: '💷', type: 'symbol', value: 'GBPUSD' },
  { category: 'Symbols', title: 'USDJPY', subtitle: 'US Dollar / Japanese Yen', icon: '💴', type: 'symbol', value: 'USDJPY' },
  
  // Indicators
  { category: 'Indicators', title: 'Relative Strength Index (RSI)', subtitle: 'Momentum Oscillator', icon: '📈', type: 'indicator', value: 'rsi', badge: 'RSI' },
  { category: 'Indicators', title: 'Moving Average Convergence (MACD)', subtitle: 'Trend Following', icon: '📊', type: 'indicator', value: 'macd', badge: 'MACD' },
  { category: 'Indicators', title: 'Bollinger Bands (BB)', subtitle: 'Volatility Channel', icon: '〰️', type: 'indicator', value: 'bb', badge: 'BB' },
  { category: 'Indicators', title: 'Exponential Moving Average (EMA)', subtitle: 'EMA 20 / 50 / 200', icon: '📉', type: 'indicator', value: 'ema', badge: 'EMA' },
  
  // Drawings
  { category: 'Drawing Tools', title: 'Trendline', subtitle: 'Draw angled trend lines', icon: '📏', type: 'tool', value: 'trend', badge: 'Alt + T' },
  { category: 'Drawing Tools', title: 'Horizontal Line', subtitle: 'Support & resistance levels', icon: '➖', type: 'tool', value: 'h-line', badge: 'Alt + H' },
  { category: 'Drawing Tools', title: 'Fibonacci Retracement', subtitle: 'Golden ratio levels', icon: '📐', type: 'tool', value: 'fib-retracement', badge: 'Alt + F' },
  { category: 'Drawing Tools', title: 'Long Position Tool', subtitle: 'Calculate Risk-to-Reward ratio', icon: '🟢', type: 'tool', value: 'long-pos' },
  { category: 'Drawing Tools', title: 'Short Position Tool', subtitle: 'Calculate Short Risk:Reward', icon: '🔴', type: 'tool', value: 'short-pos' },
  
  // Actions
  { category: 'Actions', title: 'Discipline Challenges', subtitle: 'View daily quests & consistency milestones', icon: '🏆', type: 'action', value: 'challenges' },
  { category: 'Actions', title: 'Trader Academy & Quizzes', subtitle: 'Interactive SMC quizzes & practice ground', icon: '🎓', type: 'action', value: 'academy' },
  { category: 'Actions', title: 'Institutional Sentiment Matrix', subtitle: 'News sentiment score & catalyst breakdown', icon: '📊', type: 'action', value: 'sentiment' },
  { category: 'Actions', title: 'Auto-Snapshot Trade Journal', subtitle: 'Review mistakes, tags & reflections', icon: '📝', type: 'action', value: 'journal' },
  { category: 'Actions', title: 'Institutional Economic Calendar', subtitle: 'High impact macroeconomic releases', icon: '📅', type: 'action', value: 'calendar' },
  { category: 'Actions', title: 'Chart Settings', subtitle: 'Open workspace appearance & audio', icon: '⚙️', type: 'action', value: 'settings' },
  { category: 'Actions', title: 'Take Snapshot', subtitle: 'Download PNG chart screenshot', icon: '📷', type: 'action', value: 'snapshot' }
];

const filteredItems = computed(() => {
  const q = query.value.trim().toLowerCase();
  return allItems.filter(item => {
    if (activeCategory.value !== 'All' && item.category !== activeCategory.value) {
      return false;
    }
    if (!q) return true;
    return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
  });
});

function onSelect(item) {
  if (item.type === 'symbol') {
    emit('select-symbol', item.value);
  } else if (item.type === 'indicator') {
    emit('select-indicator', item.value);
  } else if (item.type === 'tool') {
    emit('select-tool', item.value);
  } else if (item.type === 'action') {
    emit('action', item.value);
    emit('open-settings');
  }
  emit('close');
}

onMounted(() => {
  nextTick(() => {
    inputRef.value?.focus();
  });
});
</script>
