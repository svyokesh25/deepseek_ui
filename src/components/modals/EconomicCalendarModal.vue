<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in" @click.self="$emit('close')">
      <div class="w-full max-w-3xl bg-[#0e1420] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] my-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between bg-gradient-to-r from-red-500/10 via-transparent to-transparent">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-xl text-red-400">
            📅
          </div>
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              Institutional Economic Calendar
              <span class="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-semibold border border-red-500/30">
                LIVE
              </span>
            </h2>
            <p class="text-xs text-gray-400">Track high-impact macroeconomic releases affecting global forex & indices</p>
          </div>
        </div>
        <button
          type="button"
          class="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Filters Strip -->
      <div class="px-6 py-3 bg-[#0a0f19] border-b border-[#1e293b] flex flex-wrap items-center justify-between gap-3">
        <!-- Impact filter buttons -->
        <div class="flex items-center gap-1.5">
          <span class="text-[11px] text-gray-400 font-semibold mr-1">Impact:</span>
          <button
            v-for="imp in ['all', 'high', 'medium', 'low']"
            :key="imp"
            type="button"
            class="px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer capitalize"
            :class="impactFilter === imp ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-gray-400 hover:text-white hover:bg-white/5'"
            @click="impactFilter = imp"
          >
            {{ imp === 'high' ? '🔴 High' : imp === 'medium' ? '🟡 Med' : imp === 'low' ? '🟢 Low' : 'All' }}
          </button>
        </div>

        <!-- Currency filter buttons -->
        <div class="flex items-center gap-1">
          <button
            v-for="curr in ['ALL', 'USD', 'EUR', 'GBP', 'JPY', 'CAD']"
            :key="curr"
            type="button"
            class="px-2 py-1 text-[11px] rounded-lg font-mono font-medium transition-colors cursor-pointer"
            :class="currFilter === curr ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-gray-400 hover:text-white'"
            @click="currFilter = curr"
          >
            {{ curr }}
          </button>
        </div>
      </div>

      <!-- Events Table -->
      <div class="overflow-y-auto flex-1 custom-scrollbar">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-[#1e293b] bg-[#0a0f19]/80 text-[11px] text-gray-400 sticky top-0 z-10">
              <th class="py-2.5 px-4 font-semibold">Time / Status</th>
              <th class="py-2.5 px-3 font-semibold">Cur</th>
              <th class="py-2.5 px-3 font-semibold">Imp</th>
              <th class="py-2.5 px-4 font-semibold">Event</th>
              <th class="py-2.5 px-3 font-semibold text-right font-mono">Actual</th>
              <th class="py-2.5 px-3 font-semibold text-right font-mono">Forecast</th>
              <th class="py-2.5 px-4 font-semibold text-right font-mono">Prior</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#162030]">
            <tr
              v-for="ev in filteredEvents"
              :key="ev.id"
              class="hover:bg-[#121a2b]/60 transition-colors"
            >
              <!-- Time / Countdown -->
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-gray-300">{{ ev.time }}</span>
                  <span
                    class="text-[10px] px-1.5 py-0.5 rounded font-mono"
                    :class="ev.status === 'Live' ? 'bg-red-500/20 text-red-400 font-bold animate-pulse' : 'bg-gray-800 text-gray-400'"
                  >
                    {{ ev.countdown }}
                  </span>
                </div>
              </td>

              <!-- Currency -->
              <td class="py-3 px-3 whitespace-nowrap font-mono font-bold text-white">
                {{ ev.currency }}
              </td>

              <!-- Impact -->
              <td class="py-3 px-3 whitespace-nowrap">
                <span
                  class="w-2.5 h-2.5 rounded-full inline-block"
                  :class="ev.impact === 'high' ? 'bg-red-500 shadow-sm shadow-red-500/50' : ev.impact === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'"
                  :title="ev.impact.toUpperCase() + ' Impact'"
                ></span>
              </td>

              <!-- Event name -->
              <td class="py-3 px-4 font-medium text-white max-w-[280px]">
                <div class="truncate">{{ ev.event }}</div>
                <div class="text-[10px] text-gray-500 mt-0.5">{{ ev.category }}</div>
              </td>

              <!-- Actual -->
              <td class="py-3 px-3 text-right font-mono font-bold whitespace-nowrap">
                <span
                  v-if="ev.actual"
                  :class="ev.actual > ev.forecast ? 'text-emerald-400' : ev.actual < ev.forecast ? 'text-red-400' : 'text-gray-300'"
                >
                  {{ ev.actual }}
                </span>
                <span v-else class="text-gray-500 italic">Pending</span>
              </td>

              <!-- Forecast -->
              <td class="py-3 px-3 text-right font-mono text-gray-400 whitespace-nowrap">
                {{ ev.forecast || '—' }}
              </td>

              <!-- Prior -->
              <td class="py-3 px-4 text-right font-mono text-gray-500 whitespace-nowrap">
                {{ ev.prior || '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3 border-t border-[#1e293b] flex items-center justify-between text-xs text-gray-400 bg-[#0a0f19]">
        <span>All times displayed in local trader timezone</span>
        <button
          type="button"
          class="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold cursor-pointer transition-colors"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';

defineEmits(['close']);

const impactFilter = ref('all');
const currFilter = ref('ALL');

const events = ref([
  {
    id: 1,
    time: '13:30',
    countdown: 'In 45m',
    status: 'Upcoming',
    currency: 'USD',
    impact: 'high',
    event: 'Core CPI (MoM) (Sep)',
    category: 'Inflation Data',
    actual: null,
    forecast: '0.3%',
    prior: '0.3%'
  },
  {
    id: 2,
    time: '13:30',
    countdown: 'In 45m',
    status: 'Upcoming',
    currency: 'USD',
    impact: 'high',
    event: 'CPI (YoY) (Sep)',
    category: 'Inflation Data',
    actual: null,
    forecast: '2.3%',
    prior: '2.5%'
  },
  {
    id: 3,
    time: '14:45',
    countdown: 'In 2h',
    status: 'Upcoming',
    currency: 'EUR',
    impact: 'high',
    event: 'ECB Interest Rate Decision',
    category: 'Central Bank',
    actual: null,
    forecast: '3.40%',
    prior: '3.65%'
  },
  {
    id: 4,
    time: '15:30',
    countdown: 'In 2h 45m',
    status: 'Upcoming',
    currency: 'USD',
    impact: 'medium',
    event: 'Crude Oil Inventories',
    category: 'Energy Commodities',
    actual: null,
    forecast: '1.40M',
    prior: '-2.19M'
  },
  {
    id: 5,
    time: '09:00',
    countdown: 'Past',
    status: 'Completed',
    currency: 'GBP',
    impact: 'high',
    event: 'GDP (MoM) (Aug)',
    category: 'Growth Data',
    actual: '0.2%',
    forecast: '0.1%',
    prior: '0.0%'
  },
  {
    id: 6,
    time: '08:30',
    countdown: 'Past',
    status: 'Completed',
    currency: 'JPY',
    impact: 'medium',
    event: 'PPI (YoY) (Sep)',
    category: 'Inflation Data',
    actual: '2.8%',
    forecast: '2.3%',
    prior: '2.6%'
  },
  {
    id: 7,
    time: 'Tomorrow',
    countdown: 'Tomorrow',
    status: 'Upcoming',
    currency: 'USD',
    impact: 'high',
    event: 'Non-Farm Payrolls (NFP)',
    category: 'Employment Data',
    actual: null,
    forecast: '145K',
    prior: '142K'
  },
  {
    id: 8,
    time: 'Tomorrow',
    countdown: 'Tomorrow',
    status: 'Upcoming',
    currency: 'USD',
    impact: 'high',
    event: 'Unemployment Rate (Sep)',
    category: 'Employment Data',
    actual: null,
    forecast: '4.2%',
    prior: '4.2%'
  }
]);

const filteredEvents = computed(() => {
  return events.value.filter(ev => {
    if (impactFilter.value !== 'all' && ev.impact !== impactFilter.value) return false;
    if (currFilter.value !== 'ALL' && ev.currency !== currFilter.value) return false;
    return true;
  });
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 9999px;
}
</style>
