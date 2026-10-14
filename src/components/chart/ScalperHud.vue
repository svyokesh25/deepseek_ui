<template>
  <div
    class="absolute top-12 left-4 z-25 font-sans select-none transition-all duration-200"
    :class="collapsed ? 'w-auto' : 'w-[250px]'"
  >
    <!-- Glassmorphic Card Container -->
    <div class="bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-md border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl shadow-2xl p-2.5 transition-colors">
      <!-- Header: Symbol + Spread + Collapse Button -->
      <div class="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{{ symbol }}</span>
          <span class="text-[9.5px] font-mono text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
            Spread: {{ spread }}
          </span>
        </div>

        <button
          type="button"
          class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs cursor-pointer p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :title="collapsed ? 'Expand HUD' : 'Collapse HUD'"
          @click="collapsed = !collapsed"
        >
          {{ collapsed ? '＋' : '✕' }}
        </button>
      </div>

      <!-- Body: Quick Lot Buttons + Buy/Sell + Reverse -->
      <div v-show="!collapsed" class="space-y-2">
        <!-- Quick Lot Buttons -->
        <div class="grid grid-cols-5 gap-1 text-[10px] font-bold">
          <button
            v-for="l in [0.01, 0.05, 0.10, 0.50, 1.00]"
            :key="l"
            type="button"
            class="py-1 rounded border text-center transition-all cursor-pointer"
            :class="currentLot === l
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-gray-50 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400'"
            @click="currentLot = l"
          >
            {{ l }}
          </button>
        </div>

        <!-- 1-Click Execution Buttons -->
        <div class="grid grid-cols-2 gap-1.5 pt-0.5">
          <!-- BUY BUTTON -->
          <button
            type="button"
            class="flex flex-col items-center justify-center py-2 px-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
            @click="$emit('buy', currentLot)"
          >
            <span class="text-[11px] font-black tracking-wider">BUY</span>
            <span class="text-[9.5px] font-mono opacity-85 tabular-nums">{{ askPrice }}</span>
          </button>

          <!-- SELL BUTTON -->
          <button
            type="button"
            class="flex flex-col items-center justify-center py-2 px-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
            @click="$emit('sell', currentLot)"
          >
            <span class="text-[11px] font-black tracking-wider">SELL</span>
            <span class="text-[9.5px] font-mono opacity-85 tabular-nums">{{ bidPrice }}</span>
          </button>
        </div>

        <!-- Utility: Reverse Position & Breakeven All -->
        <div class="flex items-center justify-between text-[10px] pt-1 text-gray-500 dark:text-gray-400">
          <button
            type="button"
            class="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors"
            @click="reversePositions"
          >
            ⇄ Reverse Active
          </button>
          <button
            type="button"
            class="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors"
            @click="breakEvenAll"
          >
            ⚡ BE All
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePositions } from '../../stores/positions.js';

const props = defineProps({
  symbol: { type: String, required: true },
  summary: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['buy', 'sell']);

const collapsed = ref(false);
const currentLot = ref(0.01);

const { positions, closePosition, openPosition, setStopLoss } = usePositions();

const bidPrice = computed(() => {
  const p = props.summary?.bid || props.summary?.close || 1.11920;
  return Number(p).toFixed(props.symbol.includes('JPY') ? 3 : 5);
});

const askPrice = computed(() => {
  const p = props.summary?.ask || (Number(props.summary?.close || 1.11920) + 0.00015);
  return Number(p).toFixed(props.symbol.includes('JPY') ? 3 : 5);
});

const spread = computed(() => {
  return props.symbol.includes('XAU') ? '18' : '1.2';
});

// Reverse active positions for this symbol
function reversePositions() {
  const symPositions = positions.value.filter(p => p.symbol === props.symbol);
  if (!symPositions.length) return;
  symPositions.forEach(p => {
    const oppSide = p.side === 'BUY' ? 'SELL' : 'BUY';
    const lot = p.lot;
    closePosition(p.id);
    emit(oppSide.toLowerCase(), lot);
  });
}

function breakEvenAll() {
  const symPositions = positions.value.filter(p => p.symbol === props.symbol);
  symPositions.forEach(p => {
    setStopLoss(p.id, p.entry);
  });
}
</script>
