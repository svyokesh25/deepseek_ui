<template>
  <div class="absolute inset-0 pointer-events-none overflow-hidden select-none z-20 font-sans">
    <div
      v-for="p in symbolPositions"
      :key="p.id"
      class="absolute left-0 right-14 pointer-events-auto transition-all duration-300"
      :style="{ top: getPositionTop(p) + 'px' }"
    >
      <!-- Horizontal Dotted Entry Line -->
      <div
        class="w-full border-b border-dashed flex items-center justify-between relative group"
        :class="p.side === 'BUY' ? 'border-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'border-orange-500/80 shadow-[0_0_8px_rgba(249,115,22,0.3)]'"
      >
        <!-- Left Badge: Order Details + Side + Lot -->
        <div
          class="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-md ml-3 transform -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
          :class="p.side === 'BUY' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-orange-600 to-red-600'"
        >
          <span>#{{ p.id }}</span>
          <span>{{ p.side }} {{ p.lot }}</span>
          <span class="opacity-80">@ {{ p.entry }}</span>
        </div>

        <!-- Center Actions: Break-Even (BE), Close (X), and Live Floating P/L -->
        <div class="flex items-center gap-1.5 bg-white/95 dark:bg-[#111827]/95 border border-gray-200 dark:border-gray-700/80 rounded-md px-2 py-0.5 shadow-lg transform -translate-y-1/2 mr-4">
          <!-- Live P/L Badge -->
          <span
            class="text-[11px] font-black tabular-nums"
            :class="(p.pl || 0) >= 0 ? 'text-[#089981] dark:text-[#34d399]' : 'text-[#f23645] dark:text-[#f87171]'"
          >
            {{ (p.pl || 0) >= 0 ? '+' : '' }}${{ (p.pl || 0).toFixed(2) }}
          </span>

          <!-- Break-Even Quick Button (BE) -->
          <button
            type="button"
            class="px-1.5 py-0.5 text-[9.5px] font-black rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
            title="Snap Stop Loss to Break-Even"
            @click.stop="snapBreakEven(p)"
          >
            BE
          </button>

          <!-- Quick Close (✕) -->
          <button
            type="button"
            class="w-4 h-4 flex items-center justify-center rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 text-[11px] font-bold transition-colors cursor-pointer"
            title="Close Position"
            @click.stop="closePosition(p.id)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePositions } from '../../stores/positions.js';

const props = defineProps({
  symbol: { type: String, required: true },
  containerHeight: { type: Number, default: 450 }
});

const { positions, closePosition, setStopLoss } = usePositions();

const symbolPositions = computed(() => {
  return positions.value.filter(p => p.symbol === props.symbol);
});

// Distribute lines visually across the chart canvas based on position index
function getPositionTop(p) {
  const index = symbolPositions.value.findIndex(item => item.id === p.id);
  const baseTop = Math.max(80, (props.containerHeight || 450) * 0.45);
  return baseTop + (index * 42);
}

function snapBreakEven(p) {
  setStopLoss(p.id, p.entry);
}
</script>
