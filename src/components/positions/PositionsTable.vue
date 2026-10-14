<template>
  <div class="min-w-full font-sans select-none">
    <table class="w-full border-collapse text-[11px] table-fixed">
      <thead class="sticky top-0 z-10 bg-[#f1f1f1] dark:bg-[#0d111a] border-b border-[#e2e5ea] dark:border-[#161e2c]">
        <tr class="h-[28px] text-[11px] text-[#737c89] dark:text-[#6b788e] font-normal">
          <th class="px-2 text-left font-normal w-[45px] min-w-[45px]">ID</th>
          <th class="px-1.5 text-left font-normal w-[115px] min-w-[115px]">Time</th>
          <th class="px-1.5 text-left font-normal w-[80px] min-w-[80px]">
            <span class="inline-flex items-center gap-1">
              Symbol <span class="text-[#ff3b30] text-[10px] font-bold">⇂⇃</span>
            </span>
          </th>
          <th class="px-1 text-center font-normal w-[52px] min-w-[52px]">Order</th>
          <th class="px-1 text-center font-normal w-[44px] min-w-[44px]">Lot</th>
          <th class="px-1.5 text-right font-normal w-[68px] min-w-[68px]">Price</th>
          <th class="px-1 text-right font-normal w-[62px] min-w-[62px]">Partial</th>
          <th class="px-1 text-right font-normal w-[46px] min-w-[46px]">SL</th>
          <th class="px-1 text-right font-normal w-[46px] min-w-[46px]">TP</th>
          <th class="px-1.5 text-right font-normal w-[50px] min-w-[50px]">SWAP</th>
          <th class="px-1.5 text-right font-normal w-[68px] min-w-[68px]">LTP</th>
          <th class="px-1.5 text-right font-normal w-[86px] min-w-[86px]">PROFIT</th>
          <th class="w-[36px] min-w-[36px] px-1 text-center font-normal"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="positions.length === 0">
          <td colspan="13" class="text-center text-[#9aa3b0] dark:text-[#5a6578] py-8 text-xs bg-white dark:bg-[#0d111a]">
            No Position(s) Found
          </td>
        </tr>

        <tr
          v-for="(p, idx) in positions"
          :key="p.id"
          class="h-[34px] border-b border-[#edf0f5] dark:border-[#161e2c] hover:bg-[#f9fafb] dark:hover:bg-[#141b2a] text-[11px] text-[#333a45] dark:text-[#d1d4dc] transition-colors group"
          :class="idx % 2 === 1 ? 'bg-[#fbfcfd] dark:bg-[#0d111a]' : 'bg-white dark:bg-[#0f141f]'"
        >
          <td class="px-2 text-left tabular-nums">{{ p.id }}</td>
          <td class="px-1.5 text-left text-[#555e6c] dark:text-[#6b788e] tabular-nums whitespace-nowrap text-[10.5px]">{{ p.time }}</td>
          <td class="px-1.5 text-left font-medium text-[#212529] dark:text-white">{{ p.symbol }}</td>
          <td class="px-1 text-center">
            <span
              class="inline-block px-2 py-0.5 rounded text-[9.5px] font-bold tracking-tight border"
              :class="p.side === 'BUY'
                ? 'bg-[#e8f0fe] dark:bg-[#0c1a30] text-[#0072fd] dark:text-[#38bdf8] border-blue-200 dark:border-blue-900/60'
                : 'bg-[#fff0eb] dark:bg-[#2b160e] text-[#ff5722] dark:text-[#ff7849] border-orange-200 dark:border-orange-900/60'"
            >
              {{ p.side }}
            </span>
          </td>
          <td class="px-1 text-center tabular-nums">{{ typeof p.lot === 'number' ? p.lot.toFixed(2) : p.lot }}</td>
          <td class="px-1.5 text-right tabular-nums">{{ p.entry.toFixed(p.digits || 2) }}</td>
          <!-- Partial column with interactive 1-click partial close menu -->
          <td class="px-1 text-right tabular-nums text-[#8a94a6] relative">
            <button
              type="button"
              class="px-1.5 py-0.5 rounded text-[10px] hover:bg-gray-100 dark:hover:bg-[#1a2232] cursor-pointer transition-colors text-gray-700 dark:text-gray-300 border border-transparent dark:border-[#1a2232] dark:bg-[#131823]"
              :title="'Take partial profit on #' + p.id"
              @click.stop="activePartialId = activePartialId === p.id ? null : p.id"
            >
              {{ p.partial || 'Close %' }} ▾
            </button>

            <!-- Partial Close Flyout -->
            <div
              v-if="activePartialId === p.id"
              class="absolute right-1 top-full mt-1 z-50 bg-white dark:bg-[#131823] border border-[#e3e6eb] dark:border-[#1a2232] rounded-md shadow-lg p-1.5 flex items-center gap-1 text-[10px]"
              @click.stop
            >
              <button
                type="button"
                class="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 font-semibold cursor-pointer transition-colors"
                @click.stop="takePartial(p.id, 0.25)"
              >25%</button>
              <button
                type="button"
                class="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 font-semibold cursor-pointer transition-colors"
                @click.stop="takePartial(p.id, 0.5)"
              >50%</button>
              <button
                type="button"
                class="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 font-semibold cursor-pointer transition-colors"
                @click.stop="takePartial(p.id, 0.75)"
              >75%</button>
            </div>
          </td>
          <td class="px-1 text-right tabular-nums text-[#8a94a6]">
            <input
              class="w-[42px] text-right bg-transparent outline-none tabular-nums focus:bg-[#f0f3fa] dark:focus:bg-[#1a2232] rounded px-0.5 text-[#333a45] dark:text-[#d1d4dc]"
              :value="p.sl && p.sl !== '---' ? p.sl : ''"
              placeholder="--"
              @change="e => setStopLoss(p.id, e.target.value)"
            />
          </td>
          <td class="px-1 text-right tabular-nums text-[#8a94a6]">
            <input
              class="w-[42px] text-right bg-transparent outline-none tabular-nums focus:bg-[#f0f3fa] dark:focus:bg-[#1a2232] rounded px-0.5 text-[#333a45] dark:text-[#d1d4dc]"
              :value="p.tp && p.tp !== '---' ? p.tp : ''"
              placeholder="--"
              @change="e => setTarget(p.id, e.target.value)"
            />
          </td>
          <td class="px-1.5 text-right tabular-nums">{{ (p.swap || 0).toFixed(2) }}</td>
          <td class="px-1.5 text-right tabular-nums font-semibold text-[#1a1d24] dark:text-white whitespace-nowrap">{{ (p.ltp || p.entry).toFixed(p.digits || 2) }}</td>

          <!-- Profit Value inside green and red box with zero overlap, click triggers viral card -->
          <td class="px-1.5 text-right tabular-nums whitespace-nowrap">
            <div
              v-if="(p.pl || 0) >= 0"
              class="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-md bg-[#052e16] border border-emerald-500/40 text-emerald-400 font-bold shadow-xs text-[10.5px] cursor-pointer hover:scale-105 transition-transform"
              title="Click to generate Viral PnL Flex Card 📸"
              @click.stop="openPnlCard(p)"
            >
              <span class="text-emerald-400 text-[10px]">✦</span>
              <span>+{{ (p.pl || 0).toFixed(2) }}</span>
            </div>
            <div
              v-else
              class="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#3b0a12] border border-rose-500/40 text-rose-400 font-bold shadow-xs text-[10.5px] cursor-pointer hover:scale-105 transition-transform"
              title="Click to generate Viral PnL Flex Card 📸"
              @click.stop="openPnlCard(p)"
            >
              <span>{{ (p.pl || 0).toFixed(2) }}</span>
            </div>
          </td>

          <!-- Dedicated action column for circular white cross button -->
          <td class="w-[36px] min-w-[36px] px-1 text-center whitespace-nowrap">
            <button
              type="button"
              class="w-[18px] h-[18px] rounded-full bg-white text-black hover:bg-gray-100 active:scale-90 inline-flex items-center justify-center cursor-pointer text-[10px] font-bold shadow-xs transition-transform"
              title="Close position"
              @click.stop="closePosition(p.id)"
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { usePositions } from '../../stores/positions.js';
import { openPnlCard } from '../../stores/pnlCard.js';

const {
  positions,
  closePosition,
  closePartialPosition,
  setStopLoss,
  setTarget
} = usePositions();

const activePartialId = ref(null);

function takePartial(id, ratio) {
  closePartialPosition(id, ratio);
  activePartialId.value = null;
}

function onDocClick() {
  activePartialId.value = null;
}

onMounted(() => {
  document.addEventListener('click', onDocClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick);
});
</script>
