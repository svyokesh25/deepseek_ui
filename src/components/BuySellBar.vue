<template>
  <div class="bg-xn-panel border-b border-xn-border flex items-center shrink-0"
       style="height: 30px; min-height: 30px; padding: 0 10px; gap: 6px;">
    <button
      class="text-white text-[11px] font-semibold rounded-sm bg-xn-buy hover:opacity-90 transition-opacity"
      style="height: 22px; padding: 0 18px;"
      @click="$emit('buy')"
    >BUY</button>

    <div class="flex items-center rounded-sm bg-xn-panel2" style="height: 22px;">
      <button class="text-xn-dim hover:bg-xn-hover text-[13px] font-bold leading-none"
              style="width: 20px; height: 22px;"
              @click="decrement">−</button>
      <input
        v-model.number="lot"
        type="number"
        step="0.01"
        min="0.01"
        class="text-center text-[11px] bg-transparent outline-none tabular-nums"
        style="width: 42px; height: 22px;"
      />
      <button class="text-xn-dim hover:bg-xn-hover text-[13px] font-bold leading-none"
              style="width: 20px; height: 22px;"
              @click="increment">+</button>
    </div>

    <button
      class="text-white text-[11px] font-semibold rounded-sm bg-xn-sell hover:opacity-90 transition-opacity"
      style="height: 22px; padding: 0 18px;"
      @click="$emit('sell')"
    >SELL</button>

    <span v-if="currentPrice" class="text-[11px] text-xn-dim tabular-nums" style="margin-left: 8px;">
      {{ symbol }} · <span class="text-xn-text font-medium">{{ currentPrice }}</span>
    </span>

    <div class="flex-1"></div>

    <span class="text-[10px] text-xn-mute tabular-nums">{{ now }}</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  symbol: String,
  currentPrice: [Number, String]
})
defineEmits(['buy', 'sell'])

const lot = ref(0.01)
function increment() { lot.value = +(lot.value + 0.01).toFixed(2) }
function decrement() { if (lot.value > 0.01) lot.value = +(lot.value - 0.01).toFixed(2) }

const time = ref(Date.now())
let timer = null
onMounted(() => { timer = setInterval(() => { time.value = Date.now() }, 1000) })
onBeforeUnmount(() => { if (timer) clearInterval(timer) })
const now = computed(() => {
  const d = new Date(time.value)
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  const ss = String(d.getUTCSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss} UTC`
})

defineExpose({ getLot: () => lot.value })
</script>