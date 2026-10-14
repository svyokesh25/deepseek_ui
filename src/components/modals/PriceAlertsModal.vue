<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in" @click.self="$emit('close')">
      <div class="w-full max-w-xl bg-[#0e1420] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] my-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between bg-gradient-to-r from-blue-500/10 via-transparent to-transparent">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-xl text-blue-400">
            🔔
          </div>
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              Smart Price Alerts
              <span class="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                {{ activeAlerts.length }} active
              </span>
            </h2>
            <p class="text-xs text-gray-400">Set real-time visual and acoustic triggers on any asset</p>
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

      <!-- Add Alert Form -->
      <div class="p-6 bg-[#0a0f19] border-b border-[#1e293b] space-y-4">
        <div class="text-xs font-bold uppercase tracking-wider text-gray-400">Create New Alert</div>
        
        <div class="grid grid-cols-2 gap-3">
          <!-- Symbol select -->
          <div>
            <label class="block text-[11px] text-gray-400 mb-1">Symbol</label>
            <select
              v-model="newSymbol"
              class="w-full px-3 py-2 bg-[#121a2b] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option v-for="s in availableSymbols" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>

          <!-- Condition select -->
          <div>
            <label class="block text-[11px] text-gray-400 mb-1">Condition</label>
            <select
              v-model="newCondition"
              class="w-full px-3 py-2 bg-[#121a2b] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="crosses">Price Crosses Level</option>
              <option value="above">Price Rises Above (≥)</option>
              <option value="below">Price Drops Below (≤)</option>
            </select>
          </div>
        </div>

        <!-- Target Price & Quick Delta -->
        <div>
          <div class="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span>Target Price</span>
            <span v-if="currentSymPrice" class="font-mono text-gray-400">Current: <span class="text-white font-bold">{{ currentSymPrice }}</span></span>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="newPrice"
              type="number"
              step="any"
              placeholder="0.00000"
              class="flex-1 px-3 py-2 bg-[#121a2b] border border-[#1e293b] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              class="px-2.5 py-2 bg-[#182238] hover:bg-[#202d4a] border border-[#263554] text-[11px] rounded-xl text-blue-300 font-mono cursor-pointer transition-colors"
              @click="adjustPrice(0.001)"
            >
              +10 pips
            </button>
            <button
              type="button"
              class="px-2.5 py-2 bg-[#182238] hover:bg-[#202d4a] border border-[#263554] text-[11px] rounded-xl text-blue-300 font-mono cursor-pointer transition-colors"
              @click="adjustPrice(-0.001)"
            >
              -10 pips
            </button>
          </div>
        </div>

        <!-- Note / memo -->
        <div>
          <label class="block text-[11px] text-gray-400 mb-1">Note (Optional)</label>
          <input
            v-model="newNote"
            type="text"
            placeholder="e.g. Breakout retest / Take profit target"
            class="w-full px-3 py-2 bg-[#121a2b] border border-[#1e293b] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="button"
          class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer transition-all flex items-center justify-center gap-2"
          @click="submitAlert"
        >
          <span>➕ Set Price Alert</span>
        </button>
      </div>

      <!-- Alerts List -->
      <div class="p-6 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Active Alerts ({{ activeAlerts.length }})</span>
          <button
            v-if="triggeredAlerts.length > 0"
            type="button"
            class="text-[11px] text-gray-400 hover:text-red-400 cursor-pointer transition-colors"
            @click="clearTriggered"
          >
            Clear Triggered ({{ triggeredAlerts.length }})
          </button>
        </div>

        <div v-if="alerts.length === 0" class="text-center py-8 text-gray-500 text-xs">
          No alerts created yet. Enter a price above to set your first alert!
        </div>

        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors"
          :class="alert.triggered
            ? 'bg-amber-500/5 border-amber-500/20 opacity-70'
            : 'bg-[#121a2b] border-[#1e293b] hover:border-blue-500/30'"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
              :class="alert.triggered ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'"
            >
              {{ alert.triggered ? '✓' : '🔔' }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-white">{{ alert.symbol }}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                  {{ alert.condition === 'above' ? '≥' : alert.condition === 'below' ? '≤' : '⇄' }} {{ alert.price }}
                </span>
                <span v-if="alert.triggered" class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                  Triggered
                </span>
              </div>
              <p v-if="alert.note" class="text-[11px] text-gray-400 mt-0.5">{{ alert.note }}</p>
            </div>
          </div>

          <button
            type="button"
            class="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
            title="Delete alert"
            @click="removeAlert(alert.id)"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3 border-t border-[#1e293b] flex items-center justify-between text-xs text-gray-400 bg-[#0a0f19]">
        <button
          type="button"
          class="text-blue-400 hover:text-blue-300 flex items-center gap-1.5 cursor-pointer"
          @click="testSound"
        >
          <span>🔊</span> Test Alert Sound
        </button>
        <button
          type="button"
          class="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold cursor-pointer transition-colors"
          @click="$emit('close')"
        >
          Done
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePriceAlerts } from '../../stores/priceAlerts.js';
import { SYMBOLS } from '../../data/marketData.js';
import { playAlertSound } from '../../utils/soundFx.js';

const props = defineProps({
  currentSymbol: { type: String, default: 'XAUUSD' }
});

defineEmits(['close']);

const { alerts, activeAlerts, triggeredAlerts, addAlert, removeAlert, clearTriggered } = usePriceAlerts();

const availableSymbols = Object.keys(SYMBOLS);
const newSymbol = ref(props.currentSymbol || 'XAUUSD');
const newCondition = ref('crosses');
const newPrice = ref('');
const newNote = ref('');

const currentSymPrice = computed(() => {
  const symData = SYMBOLS[newSymbol.value];
  return symData?.defaultPrice || '';
});

function adjustPrice(delta) {
  const base = parseFloat(newPrice.value) || parseFloat(currentSymPrice.value) || 1.0;
  newPrice.value = (base + delta).toFixed(5);
}

function submitAlert() {
  const val = parseFloat(newPrice.value) || parseFloat(currentSymPrice.value);
  if (!val || isNaN(val)) return;

  addAlert({
    symbol: newSymbol.value,
    price: val,
    condition: newCondition.value,
    note: newNote.value.trim()
  });

  newPrice.value = '';
  newNote.value = '';
}

function testSound() {
  playAlertSound();
}
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
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
