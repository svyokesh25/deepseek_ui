<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[999] flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in" @click.self="$emit('close')">
    <div class="w-full max-w-md bg-[#0d121c] border-l border-[#1a2333] h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-slide-left">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-[#1a2333] flex items-center justify-between bg-[#0a0e17]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-base">
            📝
          </div>
          <div>
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
              Auto-Snapshot Trade Journal
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {{ journalEntries.length }} logged
              </span>
            </h2>
            <p class="text-[11px] text-gray-400">Execution snapshots, emotions & review</p>
          </div>
        </div>
        <button
          type="button"
          class="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
          @click="$emit('close')"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Quick Action / Tab Strip -->
      <div class="px-5 py-2.5 border-b border-[#1a2333] flex items-center justify-between bg-[#090d14]">
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer"
            :class="activeTab === 'history' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-gray-400 hover:text-white'"
            @click="activeTab = 'history'"
          >
            📖 Journal
          </button>
          <button
            type="button"
            class="px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer"
            :class="activeTab === 'new' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-gray-400 hover:text-white'"
            @click="activeTab = 'new'"
          >
            ➕ Manual Log
          </button>
        </div>

        <!-- 1-Click Instant Chart Snapshot Button -->
        <button
          type="button"
          class="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
          title="Capture instant chart snapshot right now"
          @click="takeInstantSnapshot"
        >
          <span>📸 Snap Chart</span>
        </button>
      </div>

      <!-- Main Body -->
      <div class="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-4">
        <!-- FORM TAB -->
        <template v-if="activeTab === 'new'">
          <!-- Symbol & Trade Picker -->
          <div>
            <label class="block text-[11px] font-semibold text-gray-300 mb-1">Asset Symbol</label>
            <input
              v-model="form.symbol"
              type="text"
              placeholder="e.g. XAUUSD"
              class="w-full px-3 py-2 bg-[#121927] border border-[#1e2a3f] rounded-xl text-xs text-white uppercase focus:outline-none focus:border-emerald-500"
            />
          </div>

          <!-- Strategy Tag -->
          <div>
            <label class="block text-[11px] font-semibold text-gray-300 mb-1">Strategy Setup</label>
            <div class="grid grid-cols-3 gap-1.5">
              <button
                v-for="s in ['Breakout', 'Trend', 'Scalp', 'Reversal', 'S/R Bounce', 'News Play']"
                :key="s"
                type="button"
                class="py-1.5 px-2 text-[11px] rounded-lg border font-medium cursor-pointer transition-colors text-center"
                :class="form.strategy === s ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-[#121927] text-gray-400 border-[#1e2a3f] hover:text-white'"
                @click="form.strategy = s"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <!-- Emotion / Mindset -->
          <div>
            <label class="block text-[11px] font-semibold text-gray-300 mb-1">Trader Mindset</label>
            <div class="grid grid-cols-3 gap-1.5">
              <button
                v-for="m in [
                  { label: 'Disciplined', icon: '🧘' },
                  { label: 'Focused', icon: '⚡' },
                  { label: 'Confident', icon: '💎' },
                  { label: 'FOMO', icon: '😬' },
                  { label: 'Hesitant', icon: '🤔' },
                  { label: 'Revenge', icon: '🔥' }
                ]"
                :key="m.label"
                type="button"
                class="py-1.5 px-2 text-[11px] rounded-lg border font-medium cursor-pointer transition-colors text-center flex items-center justify-center gap-1"
                :class="form.mindset === m.label ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-[#121927] text-gray-400 border-[#1e2a3f] hover:text-white'"
                @click="form.mindset = m.label"
              >
                <span>{{ m.icon }}</span>
                <span>{{ m.label }}</span>
              </button>
            </div>
          </div>

          <!-- Execution Quality Stars -->
          <div>
            <label class="block text-[11px] font-semibold text-gray-300 mb-1">Execution Quality (1-5)</label>
            <div class="flex items-center gap-2">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="text-xl cursor-pointer transition-transform hover:scale-125"
                @click="form.rating = star"
              >
                {{ star <= form.rating ? '⭐' : '☆' }}
              </button>
              <span class="text-xs text-gray-400 font-mono ml-2">{{ form.rating }}/5 stars</span>
            </div>
          </div>

          <!-- Entry Reason -->
          <div>
            <label class="block text-[11px] font-semibold text-gray-300 mb-1">Why did you take this trade?</label>
            <textarea
              v-model="form.reason"
              rows="2"
              placeholder="e.g. 15m breakout above Asian high with high volume confirmation..."
              class="w-full px-3 py-2 bg-[#121927] border border-[#1e2a3f] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <!-- Lessons Learned -->
          <div>
            <label class="block text-[11px] font-semibold text-gray-300 mb-1">Lesson / Takeaway</label>
            <textarea
              v-model="form.lesson"
              rows="2"
              placeholder="e.g. Good risk management. Trailed stop too early, let runners breathe..."
              class="w-full px-3 py-2 bg-[#121927] border border-[#1e2a3f] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <button
            type="button"
            class="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer transition-all flex items-center justify-center gap-2"
            @click="saveEntry"
          >
            <span>💾 Save Journal Entry</span>
          </button>
        </template>

        <!-- HISTORY TAB -->
        <template v-else>
          <!-- Filter Sub-strip -->
          <div class="flex items-center gap-1.5 text-[11px] pb-1">
            <button
              v-for="f in [
                { id: 'all', label: `All (${journalEntries.length})` },
                { id: 'auto', label: '📸 Snapshots' },
                { id: 'manual', label: '✍️ Notes' }
              ]"
              :key="f.id"
              type="button"
              class="px-2.5 py-0.5 rounded-full font-medium transition-colors cursor-pointer"
              :class="historyFilter === f.id ? 'bg-white/20 text-white font-bold' : 'text-gray-400 hover:text-gray-200'"
              @click="historyFilter = f.id"
            >
              {{ f.label }}
            </button>
          </div>

          <div v-if="filteredEntries.length === 0" class="text-center py-12 text-gray-500 text-xs">
            No matching entries found. Execute a trade or snap your chart to log automatically!
          </div>

          <div
            v-for="entry in filteredEntries"
            :key="entry.id"
            class="p-4 rounded-xl bg-[#121927] border border-[#1e2a3f] space-y-2.5 hover:border-emerald-500/30 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-white">{{ entry.symbol }}</span>
                <span
                  class="text-[10px] px-2 py-0.5 rounded-full font-semibold border"
                  :class="entry.isAuto
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'"
                >
                  {{ entry.isAuto ? '📸 ' + entry.strategy : entry.strategy }}
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                  {{ entry.mindset }}
                </span>
                <!-- Mistake Tags (Revenge, Oversizing) -->
                <span
                  v-for="m in (entry.mistakes || [])"
                  :key="m"
                  class="text-[9.5px] px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-300 border border-rose-500/40 font-bold"
                >
                  ⚠️ {{ m }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <!-- P/L Badge if available -->
                <span
                  v-if="entry.pl !== undefined && entry.pl !== null"
                  class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                  :class="entry.pl >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'"
                >
                  {{ entry.pl >= 0 ? '+' : '' }}${{ Number(entry.pl).toFixed(2) }}
                </span>

                <button
                  type="button"
                  class="text-gray-500 hover:text-red-400 p-1 cursor-pointer"
                  title="Delete entry"
                  @click="deleteJournalEntry(entry.id)"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Auto-Snapshot Chart Thumbnail Image -->
            <div v-if="entry.snapshot" class="relative rounded-lg overflow-hidden border border-[#1f2b3e] shadow-md group">
              <img :src="entry.snapshot" alt="Chart Snapshot" class="w-full h-auto block" />
              <div class="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-mono text-gray-300">
                Live Execution Snapshot
              </div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-gray-400">
              <span class="font-mono">{{ entry.date }}</span>
              <span>{{ '⭐'.repeat(entry.rating || 5) }}</span>
            </div>

            <!-- AI Improvement Suggestions -->
            <div
              v-if="entry.aiSuggestion"
              class="text-xs p-2.5 rounded-lg border leading-relaxed"
              :class="(entry.mistakes && entry.mistakes.length > 0)
                ? 'bg-rose-950/30 text-rose-300 border-rose-500/30'
                : 'bg-emerald-950/20 text-emerald-300 border-emerald-500/25'"
            >
              <strong class="font-bold block mb-0.5" :class="(entry.mistakes && entry.mistakes.length > 0) ? 'text-rose-400' : 'text-emerald-400'">
                AI Performance Feedback:
              </strong>
              <span>{{ entry.aiSuggestion }}</span>
            </div>

            <p v-if="entry.reason" class="text-xs text-gray-300 bg-[#0c111a] p-2.5 rounded-lg border border-[#182335]">
              <strong class="text-gray-400">Execution Thesis:</strong> {{ entry.reason }}
            </p>

            <p v-if="entry.lesson" class="text-xs text-emerald-300/90 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/20">
              <strong class="text-emerald-400">Lesson:</strong> {{ entry.lesson }}
            </p>
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div class="px-5 py-3 border-t border-[#1a2333] flex items-center justify-between text-xs text-gray-400 bg-[#0a0e17]">
        <button
          v-if="journalEntries.length > 0"
          type="button"
          class="text-emerald-400 hover:text-emerald-300 cursor-pointer"
          @click="exportJournal"
        >
          ⬇️ Export Journal
        </button>
        <span v-else>Consistent logging builds consistency</span>
        <button
          type="button"
          class="px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold cursor-pointer transition-colors"
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
import { useNotifications } from '../../stores/notifications.js';
import {
  journalEntries,
  addJournalEntry,
  deleteJournalEntry,
  generateChartSnapshot
} from '../../stores/tradeJournal.js';

const props = defineProps({
  currentSymbol: { type: String, default: 'XAUUSD' }
});

defineEmits(['close']);

const activeTab = ref('history');
const historyFilter = ref('all');

const filteredEntries = computed(() => {
  if (historyFilter.value === 'auto') {
    return journalEntries.value.filter(e => e.isAuto);
  }
  if (historyFilter.value === 'manual') {
    return journalEntries.value.filter(e => !e.isAuto);
  }
  return journalEntries.value;
});

const form = ref({
  symbol: props.currentSymbol || 'XAUUSD',
  strategy: 'Breakout',
  mindset: 'Disciplined',
  rating: 4,
  reason: '',
  lesson: ''
});

function takeInstantSnapshot() {
  const sym = props.currentSymbol || 'XAUUSD';
  const entry = {
    symbol: sym,
    side: 'BUY',
    lot: 0.10,
    price: 4172.50,
    strategy: 'Manual Snapshot',
    mindset: 'Focused',
    rating: 5,
    isAuto: true,
    snapshot: generateChartSnapshot(sym, 'BUY', 4172.50),
    reason: `Instant chart capture of ${sym} during active session.`,
    lesson: 'Tracking price development in real-time.'
  };
  addJournalEntry(entry);
  const { notify } = useNotifications();
  notify({ message: `📸 Instant snapshot saved for ${sym}`, type: 'success' });
}

function saveEntry() {
  if (!form.value.symbol) return;
  addJournalEntry({
    symbol: form.value.symbol.toUpperCase(),
    strategy: form.value.strategy,
    mindset: form.value.mindset,
    rating: form.value.rating,
    reason: form.value.reason.trim(),
    lesson: form.value.lesson.trim()
  });

  const { notify } = useNotifications();
  notify({ message: `📝 Journal entry saved for ${form.value.symbol}`, type: 'success' });

  form.value.reason = '';
  form.value.lesson = '';
  activeTab.value = 'history';
}

function exportJournal() {
  const json = JSON.stringify(journalEntries.value, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trade_journal_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
@keyframes slideLeft {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-slide-left {
  animation: slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1a2333;
  border-radius: 9999px;
}
</style>
