<template>
  <div class="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#0c1017] text-[#1a1d24] dark:text-[#d1d4dc] overflow-hidden select-none transition-colors">
    <!-- Top Bar: Title on left -->
    <div class="h-[38px] px-4 flex items-center justify-between border-b border-[#e5e8ec] dark:border-[#1a2232] bg-[#fbfcfd] dark:bg-[#0d111a] shrink-0">
      <div class="flex items-center gap-2">
        <h2 class="text-[13px] font-bold text-[#1a1d24] dark:text-white tracking-tight">
          History 24H ({{ account.history.value.length }})
        </h2>
      </div>

      <div class="flex items-center gap-4 text-[11px] text-[#555e6c] dark:text-[#8a94a6]">
        <span>Total Trades: <b class="text-[#1a1d24] dark:text-white">{{ account.history.value.length }}</b></span>
        <span>Realized P/L: 
          <b :class="realizedPl >= 0 ? 'text-[#089981] dark:text-[#34d399]' : 'text-[#f23645] dark:text-[#f87171]'">
            {{ realizedPl >= 0 ? '+' : '' }}{{ realizedPl.toFixed(2) }}
          </b>
        </span>
      </div>
    </div>

    <!-- Scrollable Tables Container -->
    <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col">
      <div class="min-w-full flex-1">
        <HistoryTable />
      </div>

      <!-- Account Metric Stats Bar -->
      <div class="border-y border-[#dcdfe4] dark:border-[#1a2232] px-4 py-2 flex items-center justify-between text-[11px] shrink-0 bg-[#f9fafb] dark:bg-[#0b0f17] select-none transition-colors w-full">
        <div class="flex items-center gap-4 py-0.5 text-[11px] flex-wrap">
          <div class="whitespace-nowrap flex items-center gap-1">
            <span class="text-[#787b86] dark:text-[#8b95a5]">Balance : </span>
            <b class="text-[#0072fd] dark:text-[#38bdf8] font-bold tabular-nums">{{ fmt(account.balance.value) }}</b>
          </div>
          <div class="whitespace-nowrap flex items-center gap-1">
            <span class="text-[#787b86] dark:text-[#8b95a5]">Equity : </span>
            <b class="text-[#0072fd] dark:text-[#38bdf8] font-bold tabular-nums">{{ fmt(account.equity.value) }}</b>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import HistoryTable from './HistoryTable.vue';
import { usePositions } from '../../stores/positions.js';

const account = usePositions();

const realizedPl = computed(() => {
  return account.history.value.reduce((acc, h) => acc + (h.pl || 0), 0);
});

function fmt(v) {
  const n = Number(v) || 0;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
</script>
