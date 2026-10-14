<template>
  <div
    v-if="open && item"
    class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none font-sans"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-black border border-[#e3e6eb] dark:border-[#222222] rounded-2xl shadow-2xl w-full max-w-[460px] overflow-hidden text-[#131722] dark:text-[#ffffff] transition-colors"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="px-5 py-4 border-b border-[#f0f2f5] dark:border-[#1a1a1a] flex items-center justify-between bg-gray-50/50 dark:bg-black">
        <div class="flex items-center gap-3">
          <!-- 2-Letter Asset Badge -->
          <div
            class="w-9 h-9 rounded-lg text-white font-black text-sm flex items-center justify-center shadow-xs"
            :class="badgeColorClass"
          >
            {{ item.tag || (item.symbol || '').slice(0, 2) }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-base font-extrabold tracking-tight">{{ item.symbol }}</span>
              <span class="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 dark:text-[#a0a5b0] border border-gray-200 dark:border-[#262626]">
                {{ item.badge || item.category || 'INSTRUMENT' }}
              </span>
            </div>
            <div class="text-xs text-gray-500 dark:text-[#888888] font-normal truncate max-w-[260px]">
              {{ item.name }}
            </div>
          </div>
        </div>

        <button
          type="button"
          class="w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-gray-400 hover:text-gray-700 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <!-- Live Price Banner -->
      <div class="px-5 py-3.5 bg-white dark:bg-black flex items-center justify-between border-b border-[#f0f2f5] dark:border-[#1a1a1a]">
        <div>
          <div class="text-[11px] font-semibold text-gray-400 dark:text-[#737373] uppercase tracking-wider">LTP / Current Price</div>
          <div class="text-2xl font-black font-mono tabular-nums tracking-tight text-[#000000] dark:text-[#ffffff]">
            {{ item.last != null ? item.last : '-' }}
          </div>
        </div>
        <div class="text-right">
          <div class="text-[11px] font-semibold text-gray-400 dark:text-[#737373] uppercase tracking-wider">24h Change</div>
          <div
            class="text-sm font-bold font-mono tabular-nums px-2 py-0.5 rounded inline-block mt-0.5"
            :class="(item.changePercent ?? 0) >= 0 ? 'bg-[#089981]/10 text-[#089981]' : 'bg-[#f23645]/10 text-[#f23645]'"
          >
            {{ (item.changePercent >= 0 ? '+' : '') + (item.changePercent != null ? item.changePercent.toFixed(2) : '0.00') }}%
            ({{ item.change >= 0 ? '+' : '' }}{{ item.change != null ? item.change : '0.00' }})
          </div>
        </div>
      </div>

      <!-- Analytics Grid -->
      <div class="p-5 grid grid-cols-2 gap-3 text-xs bg-gray-50/40 dark:bg-black">
        <div class="p-2.5 rounded-lg bg-white dark:bg-[#101010] border border-[#eef0f4] dark:border-[#1f1f1f]">
          <span class="text-[10px] text-gray-400 dark:text-[#737373] uppercase font-bold block">24h High</span>
          <span class="font-bold font-mono text-[13px] tabular-nums">{{ item.high || (item.last * 1.008).toFixed(item.digits || 2) }}</span>
        </div>
        <div class="p-2.5 rounded-lg bg-white dark:bg-[#101010] border border-[#eef0f4] dark:border-[#1f1f1f]">
          <span class="text-[10px] text-gray-400 dark:text-[#737373] uppercase font-bold block">24h Low</span>
          <span class="font-bold font-mono text-[13px] tabular-nums">{{ item.low || (item.last * 0.992).toFixed(item.digits || 2) }}</span>
        </div>
        <div class="p-2.5 rounded-lg bg-white dark:bg-[#101010] border border-[#eef0f4] dark:border-[#1f1f1f]">
          <span class="text-[10px] text-gray-400 dark:text-[#737373] uppercase font-bold block">Spread</span>
          <span class="font-bold font-mono text-[13px] tabular-nums text-[#0072fd] dark:text-[#38bdf8]">{{ item.spread || '2' }} pts</span>
        </div>
        <div class="p-2.5 rounded-lg bg-white dark:bg-[#101010] border border-[#eef0f4] dark:border-[#1f1f1f]">
          <span class="text-[10px] text-gray-400 dark:text-[#737373] uppercase font-bold block">Contract Size</span>
          <span class="font-bold font-mono text-[13px] tabular-nums">{{ contractSizeDisplay }}</span>
        </div>
        <div class="p-2.5 rounded-lg bg-white dark:bg-[#101010] border border-[#eef0f4] dark:border-[#1f1f1f]">
          <span class="text-[10px] text-gray-400 dark:text-[#737373] uppercase font-bold block">Session Status</span>
          <span class="font-bold text-[12px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Open & Streaming
          </span>
        </div>
        <div class="p-2.5 rounded-lg bg-white dark:bg-[#101010] border border-[#eef0f4] dark:border-[#1f1f1f]">
          <span class="text-[10px] text-gray-400 dark:text-[#737373] uppercase font-bold block">Precision (Decimals)</span>
          <span class="font-bold font-mono text-[13px] tabular-nums">{{ item.digits ?? 2 }} digits</span>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="px-5 py-3.5 bg-white dark:bg-black border-t border-[#f0f2f5] dark:border-[#1a1a1a] flex items-center justify-between gap-3">
        <button
          type="button"
          class="flex-1 py-2 rounded-lg bg-[#0072fd] hover:bg-[#005cd0] text-white font-black text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
          @click="onBuy"
        >
          BUY ({{ item.symbol }})
        </button>
        <button
          type="button"
          class="flex-1 py-2 rounded-lg bg-[#ff5722] hover:bg-[#e64a19] text-white font-black text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
          @click="onSell"
        >
          SELL ({{ item.symbol }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { contractSize } from '../../data/marketData.js';

const props = defineProps({
  open: { type: Boolean, default: false },
  item: { type: Object, default: null }
});

const emit = defineEmits(['close', 'buy', 'sell']);

const contractSizeDisplay = computed(() => {
  if (!props.item?.symbol) return '1';
  const size = contractSize(props.item.symbol);
  return size.toLocaleString('en-US');
});

const badgeColorClass = computed(() => {
  const cat = (props.item?.category || '').toLowerCase();
  if (cat.includes('forex')) return 'bg-[#6366f1]';
  if (cat.includes('crypto')) return 'bg-[#f59e0b]';
  if (cat.includes('commodity')) return 'bg-[#d97706]';
  if (cat.includes('stock')) return 'bg-[#10b981]';
  if (cat.includes('indices') || cat.includes('index')) return 'bg-[#1e40af]';
  return 'bg-[#6366f1]';
});

function onBuy() {
  emit('buy', props.item.symbol);
  emit('close');
}

function onSell() {
  emit('sell', props.item.symbol);
  emit('close');
}
</script>
