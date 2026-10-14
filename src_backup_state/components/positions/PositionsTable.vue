<template>
  <div class="min-w-full font-sans select-none">
    <table class="w-full border-collapse text-[11px]">
      <thead class="sticky top-0 z-10 bg-[#f1f1f1] dark:bg-[#0a0f1a] border-b border-[#e2e5ea] dark:border-[#162032]">
        <tr class="h-[28px] text-[11px] text-[#737c89] dark:text-[#7e8d9f] font-normal">
          <th class="px-3 text-left font-normal">ID</th>
          <th class="px-3 text-left font-normal">Time</th>
          <th class="px-3 text-left font-normal">
            <span class="inline-flex items-center gap-1">
              Symbol <span class="text-[#ff3b30] text-[10px] font-bold">⇂⇃</span>
            </span>
          </th>
          <th class="px-3 text-center font-normal">Order</th>
          <th class="px-3 text-center font-normal">Lot</th>
          <th class="px-3 text-right font-normal">Price</th>
          <th class="px-3 text-right font-normal">Partial</th>
          <th class="px-3 text-right font-normal">SL</th>
          <th class="px-3 text-right font-normal">TP</th>
          <th class="px-3 text-right font-normal">SWAP</th>
          <th class="px-3 text-right font-normal">LTP</th>
          <th class="px-3 text-right font-normal w-[85px]">PROFIT</th>
          <th class="w-[42px] px-1 text-center font-normal"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="positions.length === 0">
          <td colspan="13" class="text-center text-[#9aa3b0] py-8 text-xs bg-white dark:bg-[#080c14]">
            No Position(s) Found
          </td>
        </tr>

        <tr
          v-for="(p, idx) in positions"
          :key="p.id"
          class="h-[32px] border-b border-[#edf0f5] dark:border-[#162032] hover:bg-[#f9fafb] dark:hover:bg-[#101828] text-[11px] text-[#333a45] dark:text-[#d1d4dc] transition-colors group"
          :class="idx % 2 === 1 ? 'bg-[#fbfcfd] dark:bg-[#0b101b]' : 'bg-white dark:bg-[#080c14]'"
        >
          <td class="px-3 text-left tabular-nums">{{ p.id }}</td>
          <td class="px-3 text-left text-[#555e6c] dark:text-[#787b86] tabular-nums whitespace-nowrap">{{ p.time }}</td>
          <td class="px-3 text-left font-normal text-[#212529] dark:text-white">{{ p.symbol }}</td>
          <td class="px-3 text-center">
            <span
              class="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-tight"
              :class="p.side === 'BUY'
                ? 'bg-[#e8f0fe] dark:bg-[#142340] text-[#0072fd] dark:text-[#38bdf8]'
                : 'bg-[#fee8e8] dark:bg-[#331118] text-[#f23645] dark:text-[#f87171]'"
            >
              {{ p.side }}
            </span>
          </td>
          <td class="px-3 text-center tabular-nums">{{ typeof p.lot === 'number' ? p.lot.toFixed(2) : p.lot }}</td>
          <td class="px-3 text-right tabular-nums">{{ p.entry.toFixed(p.digits || 2) }}</td>
          <td class="px-3 text-right tabular-nums text-[#8a94a6]">{{ p.partial || '' }}</td>
          <td class="px-3 text-right tabular-nums text-[#8a94a6]">
            <input
              class="w-[60px] text-right bg-transparent outline-none tabular-nums focus:bg-[#f0f3fa] dark:focus:bg-[#142340] rounded px-1 text-[#333a45] dark:text-[#d1d4dc]"
              :value="p.sl && p.sl !== '---' ? p.sl : ''"
              placeholder="--"
              @change="e => setStopLoss(p.id, e.target.value)"
            />
          </td>
          <td class="px-3 text-right tabular-nums text-[#8a94a6]">
            <input
              class="w-[60px] text-right bg-transparent outline-none tabular-nums focus:bg-[#f0f3fa] dark:focus:bg-[#142340] rounded px-1 text-[#333a45] dark:text-[#d1d4dc]"
              :value="p.tp && p.tp !== '---' ? p.tp : ''"
              placeholder="--"
              @change="e => setTarget(p.id, e.target.value)"
            />
          </td>
          <td class="px-3 text-right tabular-nums">{{ (p.swap || 0).toFixed(2) }}</td>
          <td class="px-3 text-right tabular-nums">{{ (p.ltp || p.entry).toFixed(p.digits || 2) }}</td>

          <!-- Profit Value with subtle contrast pill/background -->
          <td
            class="px-3 text-right tabular-nums font-semibold w-[85px] transition-colors"
            :class="(p.pl || 0) > 0
              ? 'text-[#089981] dark:text-[#34d399] bg-[#e8f5f0] dark:bg-[#062c22]'
              : (p.pl || 0) < 0
                ? 'text-[#f23645] dark:text-[#f87171] bg-[#fde8eb] dark:bg-[#331118]'
                : (p.side === 'BUY' && (p.ltp || p.entry) < p.entry
                  ? 'text-[#f23645] dark:text-[#f87171] bg-[#fde8eb] dark:bg-[#331118]'
                  : 'text-[#089981] dark:text-[#34d399] bg-[#e8f5f0] dark:bg-[#062c22]')"
          >
            {{ (p.pl || 0).toFixed(2) }}
          </td>

          <!-- Dedicated action column for close button matching original pink circle badge -->
          <td class="w-[42px] px-1 text-center">
            <button
              type="button"
              class="w-[18px] h-[18px] rounded-full bg-[#fca5a5] hover:bg-[#ef4444] text-white inline-flex items-center justify-center cursor-pointer text-[10px] transition-all leading-none shadow-2xs group-hover:opacity-100 opacity-90 active:scale-90"
              title="Close position"
              @click="closePosition(p.id)"
            >
              ✕
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { usePositions } from '../../stores/positions.js';

const {
  positions,
  closePosition,
  setStopLoss,
  setTarget
} = usePositions();
</script>
