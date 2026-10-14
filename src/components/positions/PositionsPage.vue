<template>
  <div class="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#0c1017] text-[#1a1d24] dark:text-[#d1d4dc] overflow-hidden select-none transition-colors">
    <!-- Top Bar: Title on left, Bulk Action links on right matching reference image -->
    <div class="h-[38px] px-4 flex items-center justify-between border-b border-[#e5e8ec] dark:border-[#1a2232] bg-[#fbfcfd] dark:bg-[#0d111a] shrink-0">
      <!-- Title -->
      <div class="flex items-center gap-2">
        <h2 class="text-[13px] font-bold text-[#1a1d24] dark:text-white tracking-tight">
          Positions ({{ account.positions.value.length }})
        </h2>
      </div>

      <!-- Bulk Actions Bar -->
      <div class="flex items-center gap-3 text-[11px] overflow-x-auto">
        <button
          type="button"
          class="hover:text-[#0072fd] dark:hover:text-[#38bdf8] transition-colors cursor-pointer text-[#4b5563] dark:text-[#9ca3af] disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="pendingCount === 0"
          @click="account.cancelAllPendingOrders()"
        >
          Cancel all orders
        </button>

        <button
          type="button"
          class="hover:text-[#0072fd] dark:hover:text-[#38bdf8] transition-colors cursor-pointer text-[#4b5563] dark:text-[#9ca3af] disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="pendingCount === 0"
          @click="account.cancelLimitOrders()"
        >
          Cancel limit order
        </button>

        <button
          type="button"
          class="hover:text-[#0072fd] dark:hover:text-[#38bdf8] transition-colors cursor-pointer text-[#4b5563] dark:text-[#9ca3af] disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="pendingCount === 0"
          @click="account.cancelStopOrders()"
        >
          Cancel stop order
        </button>

        <!-- Vertical Separator -->
        <span class="text-[#c4c9d2] dark:text-[#374151] font-light select-none">||</span>

        <button
          type="button"
          class="hover:text-[#0072fd] dark:hover:text-[#38bdf8] transition-colors cursor-pointer text-[#4b5563] dark:text-[#9ca3af] disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          :disabled="account.positions.value.length === 0"
          @click="account.closeAllPositions()"
        >
          Close all positions
        </button>

        <button
          type="button"
          class="hover:text-[#0072fd] dark:hover:text-[#38bdf8] transition-colors cursor-pointer text-[#4b5563] dark:text-[#9ca3af] disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!hasProfitablePositions"
          @click="account.closeProfitablePositions()"
        >
          Close profitable position
        </button>

        <button
          type="button"
          class="hover:text-[#0072fd] dark:hover:text-[#38bdf8] transition-colors cursor-pointer text-[#4b5563] dark:text-[#9ca3af] disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!hasLosingPositions"
          @click="account.closeLosingPositions()"
        >
          Close losing position
        </button>
      </div>
    </div>

    <!-- Scrollable Tables Container -->
    <div class="flex-1 min-h-0 overflow-y-auto overflow-x-auto flex flex-col">
      <!-- 1. Open Positions Table -->
      <div class="min-w-full">
        <PositionsTable />
      </div>

      <!-- 2. Account Metric Stats Bar (Positioned under open positions table) -->
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
          <div class="whitespace-nowrap flex items-center gap-1">
            <span class="text-[#787b86] dark:text-[#8b95a5]">Used Margin : </span>
            <b class="text-[#0072fd] dark:text-[#38bdf8] font-bold tabular-nums">{{ fmt(account.usedMargin.value) }}</b>
          </div>
          <div class="whitespace-nowrap flex items-center gap-1">
            <span class="text-[#787b86] dark:text-[#8b95a5]">Free Margin : </span>
            <b class="text-[#0072fd] dark:text-[#38bdf8] font-bold tabular-nums">{{ fmt(account.freeMargin.value) }}</b>
          </div>
          <div class="whitespace-nowrap flex items-center gap-1">
            <span class="text-[#787b86] dark:text-[#8b95a5]">Margin Level : </span>
            <b class="font-bold tabular-nums" :class="marginLevelClass">
              {{ account.usedMargin.value <= 0 ? '0.00' : account.marginLevel.value.toFixed(2) }}%
            </b>
          </div>
        </div>

        <!-- Total P/L -->
        <div class="px-2 text-right whitespace-nowrap shrink-0 flex items-center justify-end font-bold text-[12px] tabular-nums">
          <span
            :class="account.totalPl.value > 0 ? 'text-[#089981] dark:text-[#34d399]' : account.totalPl.value < 0 ? 'text-[#f23645] dark:text-[#f87171]' : 'text-[#0072fd] dark:text-[#38bdf8]'"
          >
            {{ (account.totalPl.value === 0 && account.positions.value.length === 0 ? '+0.00' : (account.totalPl.value > 0 ? '+' : '') + account.totalPl.value.toFixed(2)) }}
          </span>
        </div>
      </div>

      <!-- 3. Pending Orders Table -->
      <div class="min-w-full flex-1">
        <PendingTable />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import PositionsTable from './PositionsTable.vue';
import PendingTable from './PendingTable.vue';
import { usePositions } from '../../stores/positions.js';

const account = usePositions();
const pendingCount = ref(0);

const hasProfitablePositions = computed(() => {
  return account.positions.value.some(p => (p.pl || 0) > 0);
});

const hasLosingPositions = computed(() => {
  return account.positions.value.some(p => (p.pl || 0) < 0);
});

const marginLevelClass = computed(() => {
  const lvl = account.marginLevel.value;
  if (account.usedMargin.value <= 0 || lvl === 0) return 'text-[#0072fd] dark:text-[#4597ff]';
  if (lvl < 50) return 'text-[#f23645] dark:text-[#ef5350]';
  if (lvl < 100) return 'text-[#d99a00] dark:text-[#f5bf23]';
  return 'text-[#089981] dark:text-[#26a69a]';
});

function fmt(v) {
  const n = Number(v) || 0;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
</script>
