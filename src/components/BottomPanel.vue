<template>
  <div
    class="bg-white dark:bg-[#0d111a] flex flex-col shrink-0 min-h-0 border-t border-[#dcdfe4] dark:border-[#1a2232] transition-colors"
    :style="{ height: height + 'px' }"
  >
    <!-- Tab strip + bulk menu trigger matching original reference -->
    <div class="flex items-center bg-[#f1f1f1] dark:bg-[#0d111a] border-b border-[#dcdfe4] dark:border-[#1a2232] h-[28px] shrink-0 overflow-visible relative select-none transition-colors">
      <div
        v-for="t in tabs" :key="t.id"
        class="h-full px-3.5 flex items-center text-xs select-none cursor-pointer border-r border-[#d4d8df] dark:border-[#1a2232] transition-colors leading-none"
        :class="active === t.id
          ? 'bg-[#d0d4dc] dark:bg-[#141f32] text-[#1a1d24] dark:text-[#38bdf8] font-bold border-b-2 border-[#0072fd] dark:border-[#38bdf8]'
          : 'text-[#333a45] dark:text-[#7e8d9f] hover:bg-[#e4e7ec] dark:hover:bg-[#131823] dark:hover:text-white font-normal'"
        @click="selectTab(t.id)"
      >
        {{ t.label }} ({{ t.count }})
      </div>

      <div class="flex-1"></div>

      <!-- When collapsed, keep Copilot, P&L, and Speedometer visible in the tab strip -->
      <div v-if="height <= 45" class="flex items-center shrink-0 mr-3">
        <!-- AI Copilot Trigger Button (directly in left of Total P/L) -->
        <button
          type="button"
          class="flex items-center gap-1.5 px-2.5 py-0.5 mr-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-sm hover:shadow transition-all cursor-pointer text-[10.5px] font-bold select-none active:scale-95 shrink-0"
          :class="copilotOpen ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-white dark:ring-offset-[#0b0f17]' : ''"
          title="Toggle AI Trade Copilot"
          @click="$emit('toggle-copilot')"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span>AI Copilot</span>
        </button>

        <!-- Total P/L -->
        <span
          class="font-bold text-[12px] tabular-nums mr-3"
          :class="account.totalPl.value > 0 ? 'text-[#089981] dark:text-[#34d399]' : account.totalPl.value < 0 ? 'text-[#f23645] dark:text-[#f87171]' : 'text-[#0072fd] dark:text-[#38bdf8]'"
        >
          {{ (account.totalPl.value === 0 && account.positions.value.length === 0 ? '+0.00' : (account.totalPl.value > 0 ? '+' : '') + account.totalPl.value.toFixed(2)) }}
        </span>

        <!-- Speedometer -->
        <div class="w-[38px] flex items-center justify-center shrink-0 mr-1 select-none" title="Risk & Margin Level Speed Gauge">
          <svg width="30" height="15" viewBox="0 0 60 30" class="overflow-visible">
            <path d="M 6 28 A 24 24 0 0 1 20 8" fill="none" stroke="#089981" stroke-width="4.5" stroke-linecap="round" />
            <path d="M 23 7 A 24 24 0 0 1 37 7" fill="none" stroke="#f59e0b" stroke-width="4.5" />
            <path d="M 40 8 A 24 24 0 0 1 54 28" fill="none" stroke="#f23645" stroke-width="4.5" stroke-linecap="round" />
            <circle cx="30" cy="28" r="3.5" fill="#ffffff" />
            <circle cx="30" cy="28" r="1.5" fill="#131823" />
            <line x1="30" y1="28" x2="43" y2="13" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <!-- Collapse / Expand (⌄ / ⌃) -->
      <button
        type="button"
        class="w-7 h-full flex items-center justify-center text-[#555e6c] dark:text-[#787b86] hover:text-[#1a1d24] dark:hover:text-white cursor-pointer transition-colors active:scale-95"
        :title="height <= 45 ? 'Expand panel' : 'Collapse panel'"
        @click="$emit('toggle-collapse')"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5">
          <path :d="height <= 45 ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'"/>
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
          class="absolute right-0 bottom-full mb-1 z-50 bg-white dark:bg-[#131823] border border-[#e3e6eb] dark:border-[#1a2232]
                 rounded-md shadow-lg min-w-[210px] py-1 text-xs"
          @click.stop
        >
          <button
            v-for="item in bulkItems" :key="item.id"
            type="button"
            class="w-full text-left px-3.5 py-2 hover:bg-[#f6f8fb] dark:hover:bg-[#182030] flex items-center gap-2 border-b border-[#f0f2f5] dark:border-[#1a2232] last:border-b-0 cursor-pointer text-[#212529] dark:text-[#d1d4dc] font-normal transition-colors"
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
    <div class="flex-1 min-h-0 overflow-y-auto overflow-x-auto bg-white dark:bg-[#0d111a] transition-colors">
      <PositionsTable  v-show="active === 'positions'" />
      <PendingTable    v-show="active === 'pending'"   />
      <HistoryTable    v-show="active === 'history'"   />
      <CancelledTable  v-show="active === 'cancelled'" />
      <AnalyticsTab    v-show="active === 'analytics'" />
    </div>

    <!-- Account stats bar matching screenshot exactly -->
    <div class="border-t border-[#dcdfe4] dark:border-[#1a2232] pl-3 pr-0 py-1.5 flex items-center justify-between text-[11px] shrink-0 bg-white dark:bg-[#0b0f17] select-none transition-colors w-full overflow-hidden">
      <!-- Left: Perfectly Aligned Account Metric Stats -->
      <div class="flex items-center gap-3.5 shrink-0 py-0.5 text-[11px]">
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
          <b class="font-bold tabular-nums" :class="marginLevelClass">{{ (account.usedMargin.value <= 0 ? '0.00' : account.marginLevel.value.toFixed(2)) }}%</b>
        </div>
      </div>

      <!-- Spacer pushing P/L and Speedometer over -->
      <div class="flex-1 min-w-[12px]"></div>

      <!-- Right: Copilot trigger (left of P&L) + Total P/L + Speedometer -->
      <div class="flex items-center shrink-0">
        <!-- AI Copilot Trigger Button (directly in left of Total P/L) -->
        <button
          type="button"
          class="flex items-center gap-1.5 px-2.5 py-0.5 mr-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-sm hover:shadow transition-all cursor-pointer text-[10.5px] font-bold select-none active:scale-95 shrink-0"
          :class="copilotOpen ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-white dark:ring-offset-[#0b0f17]' : ''"
          title="Toggle AI Trade Copilot"
          @click="$emit('toggle-copilot')"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span>AI Copilot</span>
        </button>

        <!-- Total P/L: Sized w-[86px] px-1.5 text-right to mathematically match the PROFIT column header and cell badges -->
        <div class="w-[86px] min-w-[86px] max-w-[86px] px-1.5 text-right whitespace-nowrap shrink-0 flex items-center justify-end">
          <span
            class="font-bold text-[12px] tabular-nums"
            :class="account.totalPl.value > 0 ? 'text-[#089981] dark:text-[#34d399]' : account.totalPl.value < 0 ? 'text-[#f23645] dark:text-[#f87171]' : 'text-[#0072fd] dark:text-[#38bdf8]'"
          >
            {{ (account.totalPl.value === 0 && account.positions.value.length === 0 ? '+0.00' : (account.totalPl.value > 0 ? '+' : '') + account.totalPl.value.toFixed(2)) }}
          </span>
        </div>

        <!-- Speedometer / Margin Risk Gauge: Sized w-[36px] flex justify-center to mathematically match the Close [✕] column -->
        <div class="w-[36px] min-w-[36px] max-w-[36px] flex items-center justify-center shrink-0 select-none" title="Risk & Margin Level Speed Gauge">
          <svg width="34" height="17" viewBox="0 0 60 30" class="overflow-visible">
            <!-- Arc Background Segments -->
            <!-- Green Zone (Left) -->
            <path d="M 6 28 A 24 24 0 0 1 20 8" fill="none" stroke="#089981" stroke-width="4.5" stroke-linecap="round" />
            <!-- Yellow Zone (Center) -->
            <path d="M 23 7 A 24 24 0 0 1 37 7" fill="none" stroke="#f59e0b" stroke-width="4.5" />
            <!-- Red Zone (Right) -->
            <path d="M 40 8 A 24 24 0 0 1 54 28" fill="none" stroke="#f23645" stroke-width="4.5" stroke-linecap="round" />
            <!-- Center Pivot -->
            <circle cx="30" cy="28" r="3.5" fill="#ffffff" />
            <circle cx="30" cy="28" r="1.5" fill="#131823" />
            <!-- Needle -->
            <line
              x1="30" y1="28"
              x2="43" y2="13"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
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
import AnalyticsTab  from './positions/AnalyticsTab.vue';
import { usePositions } from '../stores/positions.js';

const props = defineProps({
  height: { type: Number, default: 200 },
  copilotOpen: { type: Boolean, default: false }
});
const emit = defineEmits(['toggle-collapse', 'toggle-copilot']);

const account = usePositions();
const active  = ref('positions');

function selectTab(id) {
  active.value = id;
  if (props.height <= 45) {
    emit('toggle-collapse');
  }
}

// ---- tab strip state ----
const tabs = computed(() => ([
  { id: 'positions', label: 'Positions',      count: account.positions.value.length },
  { id: 'pending',   label: 'Pending',        count: 0 },
  { id: 'history',   label: 'History 24H',    count: account.history.value.length },
  { id: 'cancelled', label: 'Cancelled 24H',  count: 0 },
  { id: 'analytics', label: 'Analytics',      count: '89%' }
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