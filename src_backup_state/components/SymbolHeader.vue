<template>
  <div class="h-9 bg-xn-panel border-b border-xn-border flex items-center gap-3 px-3 shrink-0">
    <span class="text-[15px] font-semibold text-xn-text">{{ summary.symbol }}</span>
    <span class="text-xn-mute">·</span>
    <span class="text-[13px] text-xn-text">{{ currentTfLabel }}</span>
    <span class="w-2 h-2 rounded-full bg-xn-up ml-1"></span>
    <span class="text-[11px] text-xn-dim flex gap-2.5 ml-1">
      <span>O<span class="text-xn-text ml-1">{{ summary.open }}</span></span>
      <span>H<span class="text-xn-text ml-1">{{ summary.high }}</span></span>
      <span>L<span class="text-xn-text ml-1">{{ summary.low }}</span></span>
      <span>C<span class="text-xn-text ml-1">{{ summary.close }}</span></span>
      <span :class="summary.change >= 0 ? 'text-xn-up' : 'text-xn-down'">
        {{ (summary.change >= 0 ? '+' : '') + summary.change }}
        ({{ (summary.changePct >= 0 ? '+' : '') + summary.changePct }}%)
      </span>
    </span>
    <div class="flex-1"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  summary: { type: Object, required: true },
  currentTf: { type: String, default: '15' }
})
const tfMap = {
  '1': '1',
  '5': '5',
  '15': '15',
  '30': '30',
  '60': '1H',
  '120': '2H',
  '240': '4H',
  'D': '1D',
  'W': '1W',
  'M': '1M'
}
const currentTfLabel = computed(() => tfMap[props.currentTf] || props.currentTf || '15')
</script>
