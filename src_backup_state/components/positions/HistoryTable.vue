<template>
  <div class="min-w-full font-sans select-none">
    <table class="w-full border-collapse text-[11px]">
      <thead class="bg-[#f1f1f1] dark:bg-[#0a0f1a] border-b border-[#e2e5ea] dark:border-[#162032]">
        <tr class="h-[28px] text-[11px] text-[#737c89] dark:text-[#7e8d9f] font-normal">
          <th class="px-3 text-left font-normal">ID</th>
          <th class="px-3 text-left font-normal">Close Time</th>
          <th class="px-3 text-left font-normal">
            <span class="inline-flex items-center gap-1">
              Symbol <span class="text-[#ff3b30] text-[10px] font-bold">⇂⇃</span>
            </span>
          </th>
          <th class="px-3 text-center font-normal">Order</th>
          <th class="px-3 text-center font-normal">Lot</th>
          <th class="px-3 text-right font-normal">Entry</th>
          <th class="px-3 text-right font-normal">Exit</th>
          <th class="px-4 text-right font-normal">P/L</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="history.length === 0">
          <td colspan="8" class="text-center text-[#9aa3b0] py-8 text-xs bg-white dark:bg-[#080c14]">
            No Closed position(s) Found
          </td>
        </tr>

        <tr
          v-for="h in history"
          :key="h.id"
          class="h-[32px] border-b border-[#edf0f5] dark:border-[#162032] hover:bg-[#f9fafb] dark:hover:bg-[#101828] text-[11px] text-[#333a45] dark:text-[#d1d4dc] transition-colors"
        >
          <td class="px-3 text-left tabular-nums text-[#333a45] dark:text-[#d1d4dc]">{{ h.id }}</td>
          <td class="px-3 text-left text-[#555e6c] dark:text-[#787b86] tabular-nums whitespace-nowrap">{{ h.closeTime }}</td>
          <td class="px-3 text-left font-normal text-[#212529] dark:text-white">{{ h.symbol }}</td>
          <td class="px-3 text-center">
            <span
              class="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-tight"
              :class="h.side === 'BUY' ? 'bg-[#e8f0fe] dark:bg-[#142340] text-[#0072fd] dark:text-[#38bdf8]' : 'bg-[#fee8e8] dark:bg-[#331118] text-[#f23645] dark:text-[#f87171]'"
            >
              {{ h.side }}
            </span>
          </td>
          <td class="px-3 text-center tabular-nums text-[#333a45] dark:text-[#d1d4dc]">{{ h.lot }}</td>
          <td class="px-3 text-right tabular-nums text-[#333a45] dark:text-[#d1d4dc]">{{ h.entry.toFixed(h.digits || 2) }}</td>
          <td class="px-3 text-right tabular-nums text-[#333a45] dark:text-[#d1d4dc]">{{ h.exit.toFixed(h.digits || 2) }}</td>
          <td
            class="px-4 text-right tabular-nums font-semibold"
            :class="(h.pl || 0) >= 0 ? 'text-[#0072fd] dark:text-[#38bdf8]' : 'text-[#f23645] dark:text-[#ef5350]'"
          >
            {{ (h.pl || 0).toFixed(2) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { usePositions } from '../../stores/positions.js';

const { history } = usePositions();
</script>
