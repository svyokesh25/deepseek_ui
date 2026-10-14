<template>
  <div
    class="bg-white dark:bg-[#090d16] flex flex-col shrink-0 min-h-0 border-t border-[#dcdfe4] dark:border-[#162032] transition-colors"
    :style="{ height: height + 'px' }"
  >
    <!-- Tab strip + bulk menu trigger matching original reference -->
    <div class="flex items-center bg-[#f1f1f1] dark:bg-[#070a11] border-b border-[#dcdfe4] dark:border-[#162032] h-[28px] shrink-0 overflow-visible relative select-none transition-colors">
      <div
        v-for="t in tabs" :key="t.id"
        class="h-full px-3.5 flex items-center text-xs select-none cursor-pointer border-r border-[#d4d8df] dark:border-[#162032] transition-colors leading-none"
        :class="active === t.id
          ? 'bg-[#d0d4dc] dark:bg-[#142340] text-[#1a1d24] dark:text-[#38bdf8] font-bold'
          : 'text-[#333a45] dark:text-[#7e8d9f] hover:bg-[#e4e7ec] dark:hover:bg-[#0e1626] dark:hover:text-white font-normal'"
        @click="active = t.id"
      >
        {{ t.label }} ({{ t.count }})
      </div>

      <div class="flex-1"></div>

      <!-- Collapse (⌄) -->
      <button
        type="button"
        class="w-7 h-full flex items-center justify-center text-[#555e6c] dark:text-[#787b86] hover:text-[#1a1d24] dark:hover:text-white cursor-pointer transition-colors active:scale-95"
        title="Collapse"
        @click="$emit('toggle-collapse')"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      <!-- Bulk menu (⋯) -->
      <div class="relative mr-1.5">
        <button
          type="button"
          class="w-7 h-full flex items-center justify-center text-[#555e6c] dark:text-[#787b86] hover:text-[#1a1d24] dark:hover:text-white cursor-pointer transition-colors active:scale-95"
          title="Bulk actions"
          @click.stop="toggleBulk"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5"  cy="12" r="1.5"/>
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="19" cy="12" r="1.5"/>
          </svg>
        </button>

        <div
          v-if="bulkOpen"
          ref="bulkMenu"
          class="absolute right-0 bottom-full mb-1 z-50 bg-white dark:bg-[#0d1322] border border-[#e3e6eb] dark:border-[#162032]
                 rounded-md shadow-lg min-w-[210px] py-1 text-xs"
          @click.stop
        >
          <button
            v-for="item in bulkItems" :key="item.id"
            type="button"
            class="w-full text-left px-3.5 py-2 hover:bg-[#f6f8fb] dark:hover:bg-[#142340] flex items-center gap-2 border-b border-[#f0f2f5] dark:border-[#162032] last:border-b-0 cursor-pointer text-[#212529] dark:text-[#d1d4dc] font-normal transition-colors"
            :class="{ 'opacity-40 cursor-not-allowed': item.disabled }"
            :disabled="item.disabled"
            @click="runBulk(item)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tab bodies -->
    <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-white dark:bg-[#080c14] transition-colors">
      <PositionsTable  v-show="active === 'positions'" />
      <PendingTable    v-show="active === 'pending'"   />
      <HistoryTable    v-show="active === 'history'"   />
      <CancelledTable  v-show="active === 'cancelled'" />
    </div>

    <!-- Account stats bar matching original reference exactly -->
    <div class="border-t border-[#dcdfe4] dark:border-[#162032] px-3 py-1.5 flex items-center text-[12px] shrink-0 bg-white dark:bg-[#070a11] select-none transition-colors">
      <div class="flex items-center gap-x-6">
        <span class="text-[#212529] dark:text-[#d1d4dc] font-normal">
          Balance : <b class="text-[#0072fd] dark:text-[#38bdf8] font-bold tabular-nums">{{ fmt(account.balance.value) }}</b>
        </span>
        <span class="text-[#212529] dark:text-[#d1d4dc] font-normal">
          Equity : <b class="text-[#0072fd] dark:text-[#38bdf8] font-bold tabular-nums">{{ fmt(account.equity.value) }}</b>
        </span>
        <span class="text-[#212529] dark:text-[#d1d4dc] font-normal">
          Used Margin : <b class="text-[#0072fd] dark:text-[#38bdf8] font-bold tabular-nums">{{ fmt(account.usedMargin.value) }}</b>
        </span>
        <span class="text-[#212529] dark:text-[#d1d4dc] font-normal">
          Free Margin : <b class="text-[#0072fd] dark:text-[#38bdf8] font-bold tabular-nums">{{ fmt(account.freeMargin.value) }}</b>
        </span>
        <span class="text-[#212529] dark:text-[#d1d4dc] font-normal">
          Margin Level : <b class="font-bold tabular-nums" :class="marginLevelClass">{{ (account.usedMargin.value <= 0 ? '0.00' : account.marginLevel.value.toFixed(2)) }}%</b>
        </span>
        <span class="text-[#212529] dark:text-[#d1d4dc] font-normal hidden lg:inline">
          Buying Power : <b class="text-[#0072fd] dark:text-[#38bdf8] font-bold tabular-nums">{{ fmt(buyingPower) }}</b>
        </span>
      </div>

      <div class="flex-1"></div>

      <!-- Right total profit aligned directly under the PROFIT column with end gap matching the action column -->
      <div class="flex items-center gap-2">
        <span class="text-[11px] text-[#6c757d] dark:text-[#787b86] hidden sm:inline">P/L Today</span>
        <span
          class="font-bold tabular-nums text-[12px] w-[85px] text-right px-3"
          :class="account.totalPl.value > 0 ? 'text-[#089981] dark:text-[#26a69a]' : account.totalPl.value < 0 ? 'text-[#f23645] dark:text-[#ef5350]' : 'text-[#0072fd] dark:text-[#38bdf8]'"
        >
          {{ (account.totalPl.value === 0 && account.positions.value.length === 0 ? '+0.00' : account.totalPl.value.toFixed(2)) }}
        </span>
        <div class="w-[42px]"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import PositionsTable from './positions/PositionsTable.vue';
import PendingTable   from './positions/PendingTable.vue';
import HistoryTable   from './positions/HistoryTable.vue';
import CancelledTable from './positions/CancelledTable.vue';
import { usePositions } from '../stores/positions.js';

defineProps({ height: { type: Number, default: 200 } });
defineEmits(['toggle-collapse']);

const account = usePositions();
const active  = ref('positions');

// ---- tab strip state ----
const tabs = computed(() => ([
  { id: 'positions', label: 'Positions',      count: account.positions.value.length },
  { id: 'pending',   label: 'Pending',        count: 0 },
  { id: 'history',   label: 'History 24H',    count: account.history.value.length },
  { id: 'cancelled', label: 'Cancelled 24H',  count: 0 }
]));

// Simulated retail buying power (Free Margin × 4 leverage)
const buyingPower = computed(() => {
  return Math.max(account.freeMargin.value, 0) * 4;
});

// Warning color for margin levels
const marginLevelClass = computed(() => {
  const lvl = account.marginLevel.value;
  if (account.usedMargin.value <= 0 || lvl === 0) return 'text-[#0072fd] dark:text-[#4597ff]';
  if (lvl < 50) return 'text-[#f23645] dark:text-[#ef5350]';
  if (lvl < 100) return 'text-[#d99a00] dark:text-[#f5bf23]';
  return 'text-[#089981] dark:text-[#26a69a]';
});

// ---- bulk menu ----
const bulkOpen = ref(false);
const bulkMenu = ref(null);

const bulkItems = computed(() => {
  if (active.value === 'pending') {
    return [
      { id: 'cancel-all',     label: 'Cancel all order',            disabled: false },
      { id: 'cancel-limit',   label: 'Cancel limit order',          disabled: false },
      { id: 'cancel-stop',    label: 'Cancel stop order',           disabled: false }
    ];
  }
  return [
    { id: 'close-all',      label: 'Close all position',          disabled: account.positions.value.length === 0 },
    { id: 'close-profit',   label: 'Close profitable position',   disabled: !account.positions.value.some(p => (p.pl || 0) > 0) },
    { id: 'close-loss',     label: 'Close losing position',       disabled: !account.positions.value.some(p => (p.pl || 0) < 0) },
    { id: 'cancel-all',     label: 'Cancel all order',            disabled: true  },
    { id: 'cancel-limit',   label: 'Cancel limit order',          disabled: true  },
    { id: 'cancel-stop',    label: 'Cancel stop order',           disabled: true  }
  ];
});

function toggleBulk() {
  bulkOpen.value = !bulkOpen.value;
}

async function runBulk(item) {
  if (item.disabled) return;
  bulkOpen.value = false;

  switch (item.id) {
    case 'cancel-all':     await account.cancelAllPendingOrders();   break;
    case 'cancel-limit':   await account.cancelLimitOrders();        break;
    case 'cancel-stop':    await account.cancelStopOrders();         break;
    case 'close-all':      account.closeAllPositions();              break;
    case 'close-profit':   account.closeProfitablePositions();       break;
    case 'close-loss':     account.closeLosingPositions();           break;
  }
}

// Close menu on outside click or Escape
function onDocClick(e) {
  if (!bulkOpen.value) return;
  const root = bulkMenu.value;
  const btn  = e.target.closest && e.target.closest('button');
  if (root && root.contains(e.target)) return;
  if (btn && btn.parentElement && btn.parentElement.classList.contains('relative')) return;
  bulkOpen.value = false;
}

function onKeydown(e) {
  if (e.key === 'Escape') bulkOpen.value = false;
}

onMounted(() => {
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick);
  document.removeEventListener('keydown', onKeydown);
});

function fmt(v) {
  const n = Number(v) || 0;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
</script>