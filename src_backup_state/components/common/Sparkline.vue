<template>
  <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" class="block shrink-0 select-none">
    <polyline
      v-if="points"
      :points="points"
      fill="none"
      :stroke="stroke"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  values: { type: Array, required: true },
  width:  { type: Number, default: 32 },
  height: { type: Number, default: 18 },
  up:     { type: Boolean, default: true }
});

const stroke = computed(() => props.up ? '#089981' : '#f23645');

const points = computed(() => {
  const vs = props.values;
  if (!vs || vs.length < 2) return '';
  let lo = Infinity, hi = -Infinity;
  for (const v of vs) {
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  const span = (hi - lo) || 1;
  const step = props.width / (vs.length - 1);
  return vs.map((v, i) => {
    const x = i * step;
    const y = props.height - 1 - ((v - lo) / span) * (props.height - 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
});
</script>
