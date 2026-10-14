<template>
  <div class="flex-1 min-h-0 p-2 overflow-y-auto select-none font-sans">
    <div class="grid grid-cols-2 gap-1.5">
      <div
        v-for="item in rows"
        :key="item.symbol"
        class="p-2.5 rounded-lg border flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-sm group"
        :class="getTileClass(item)"
        @click="$emit('select', item.symbol)"
      >
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs tracking-tight text-white drop-shadow-sm">{{ item.symbol }}</span>
          <span class="text-[9px] font-mono px-1 py-0.2 rounded bg-black/25 text-white/90">
            {{ item.sector || 'FX' }}
          </span>
        </div>

        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-[11px] font-mono font-bold text-white/95 tabular-nums">
            {{ formatPrice(item.last) }}
          </span>
          <span class="text-[10px] font-mono font-black text-white px-1 rounded bg-black/20">
            {{ item.changePct || '+0.00%' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rows: { type: Array, default: () => [] },
  currentSymbol: { type: String, default: '' }
});

defineEmits(['select']);

function getTileClass(item) {
  const isNegative = String(item.changePct || '').startsWith('-');
  const isSelected = item.symbol === item.currentSymbol;

  if (isNegative) {
    return isSelected
      ? 'bg-gradient-to-br from-red-600 to-rose-700 border-white ring-2 ring-red-400'
      : 'bg-gradient-to-br from-red-500/90 to-rose-600/90 hover:from-red-600 hover:to-rose-700 border-red-400/40';
  }

  return isSelected
    ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-white ring-2 ring-emerald-400'
    : 'bg-gradient-to-br from-emerald-500/90 to-teal-600/90 hover:from-emerald-600 hover:to-teal-700 border-emerald-400/40';
}

function formatPrice(p) {
  if (!p) return '1.11920';
  return Number(p).toFixed(4);
}
</script>
