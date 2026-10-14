<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in" @click.self="$emit('close')">
      <div class="w-full max-w-xl bg-[#0e1420] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] my-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between bg-gradient-to-r from-purple-500/10 via-transparent to-transparent">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-xl text-purple-400">
            🎨
          </div>
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              Chart Theme Studio
              <span class="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                PRO
              </span>
            </h2>
            <p class="text-xs text-gray-400">Customize candlestick colors, canvas tones, and terminal aesthetics</p>
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

      <!-- Body -->
      <div class="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
        <!-- Live Preview Canvas Box -->
        <div class="p-4 rounded-xl border border-[#1e293b] flex flex-col items-center justify-center relative overflow-hidden" :style="{ backgroundColor: currentTheme.bg }">
          <div class="text-[10px] text-gray-400 absolute top-2 left-3 font-mono font-bold uppercase tracking-wider">Preview Canvas</div>
          <div class="flex items-center gap-4 py-6">
            <!-- Simulated candles -->
            <div class="flex items-center gap-2">
              <!-- Candle 1: Up -->
              <div class="flex flex-col items-center">
                <div class="w-[1px] h-3" :style="{ backgroundColor: currentTheme.up }"></div>
                <div class="w-3.5 h-8 rounded-[1px]" :style="{ backgroundColor: currentTheme.up }"></div>
                <div class="w-[1px] h-2" :style="{ backgroundColor: currentTheme.up }"></div>
              </div>
              <!-- Candle 2: Down -->
              <div class="flex flex-col items-center">
                <div class="w-[1px] h-2" :style="{ backgroundColor: currentTheme.down }"></div>
                <div class="w-3.5 h-6 rounded-[1px]" :style="{ backgroundColor: currentTheme.down }"></div>
                <div class="w-[1px] h-4" :style="{ backgroundColor: currentTheme.down }"></div>
              </div>
              <!-- Candle 3: Up -->
              <div class="flex flex-col items-center">
                <div class="w-[1px] h-4" :style="{ backgroundColor: currentTheme.up }"></div>
                <div class="w-3.5 h-12 rounded-[1px]" :style="{ backgroundColor: currentTheme.up }"></div>
                <div class="w-[1px] h-2" :style="{ backgroundColor: currentTheme.up }"></div>
              </div>
              <!-- Candle 4: Down -->
              <div class="flex flex-col items-center">
                <div class="w-[1px] h-3" :style="{ backgroundColor: currentTheme.down }"></div>
                <div class="w-3.5 h-7 rounded-[1px]" :style="{ backgroundColor: currentTheme.down }"></div>
                <div class="w-[1px] h-2" :style="{ backgroundColor: currentTheme.down }"></div>
              </div>
              <!-- Candle 5: Up -->
              <div class="flex flex-col items-center">
                <div class="w-[1px] h-2" :style="{ backgroundColor: currentTheme.up }"></div>
                <div class="w-3.5 h-10 rounded-[1px]" :style="{ backgroundColor: currentTheme.up }"></div>
                <div class="w-[1px] h-3" :style="{ backgroundColor: currentTheme.up }"></div>
              </div>
            </div>
          </div>
          <div class="text-[11px] font-mono text-gray-400">
            Up: <span :style="{ color: currentTheme.up }" class="font-bold font-mono">{{ currentTheme.up }}</span> &nbsp;|&nbsp;
            Down: <span :style="{ color: currentTheme.down }" class="font-bold font-mono">{{ currentTheme.down }}</span>
          </div>
        </div>

        <!-- Preset Palettes -->
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Color Presets</div>
          <div class="grid grid-cols-2 gap-2.5">
            <button
              v-for="preset in presets"
              :key="preset.id"
              type="button"
              class="p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer"
              :class="activePresetId === preset.id ? 'bg-purple-500/10 border-purple-500/50 shadow-sm' : 'bg-[#121927] border-[#1e293b] hover:border-gray-600'"
              @click="selectPreset(preset)"
            >
              <div>
                <div class="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{{ preset.icon }}</span>
                  <span>{{ preset.name }}</span>
                </div>
                <div class="text-[10px] text-gray-400 mt-0.5">{{ preset.desc }}</div>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <span class="w-3 h-3 rounded-full border border-black/30" :style="{ backgroundColor: preset.up }"></span>
                <span class="w-3 h-3 rounded-full border border-black/30" :style="{ backgroundColor: preset.down }"></span>
                <span class="w-3 h-3 rounded-full border border-white/20" :style="{ backgroundColor: preset.bg }"></span>
              </div>
            </button>
          </div>
        </div>

        <!-- Custom Color Inputs -->
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Fine-Tune Colors</div>
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-[#121927] border border-[#1e293b] p-3 rounded-xl">
              <label class="block text-[11px] text-gray-400 mb-2">Bullish Candle</label>
              <div class="flex items-center gap-2">
                <input v-model="currentTheme.up" type="color" class="w-7 h-7 rounded border-0 cursor-pointer bg-transparent" />
                <span class="text-xs font-mono text-white uppercase">{{ currentTheme.up }}</span>
              </div>
            </div>
            <div class="bg-[#121927] border border-[#1e293b] p-3 rounded-xl">
              <label class="block text-[11px] text-gray-400 mb-2">Bearish Candle</label>
              <div class="flex items-center gap-2">
                <input v-model="currentTheme.down" type="color" class="w-7 h-7 rounded border-0 cursor-pointer bg-transparent" />
                <span class="text-xs font-mono text-white uppercase">{{ currentTheme.down }}</span>
              </div>
            </div>
            <div class="bg-[#121927] border border-[#1e293b] p-3 rounded-xl">
              <label class="block text-[11px] text-gray-400 mb-2">Background</label>
              <div class="flex items-center gap-2">
                <input v-model="currentTheme.bg" type="color" class="w-7 h-7 rounded border-0 cursor-pointer bg-transparent" />
                <span class="text-xs font-mono text-white uppercase">{{ currentTheme.bg }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3 border-t border-[#1e293b] flex items-center justify-between text-xs text-gray-400 bg-[#0a0f19]">
        <button
          type="button"
          class="text-gray-400 hover:text-white cursor-pointer"
          @click="resetToDefault"
        >
          Reset Default
        </button>
        <button
          type="button"
          class="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold cursor-pointer transition-all shadow-md shadow-purple-500/20"
          @click="applyTheme"
        >
          ✓ Apply Theme
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { useNotifications } from '../../stores/notifications.js';

const emit = defineEmits(['close', 'apply']);

const presets = [
  { id: 'tv_classic', name: 'TradingView Classic', icon: '📊', desc: 'Emerald green & rose red', up: '#26a69a', down: '#ef5350', bg: '#090d15' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', icon: '🌌', desc: 'Electric cyan & neon magenta', up: '#00f3ff', down: '#ff007f', bg: '#05070e' },
  { id: 'bloomberg', name: 'Bloomberg Terminal', icon: '💼', desc: 'Amber gold & cyan glow', up: '#f59e0b', down: '#06b6d4', bg: '#000000' },
  { id: 'forest', name: 'Forest Emerald', icon: '🌲', desc: 'Mint green & coral red', up: '#10b981', down: '#f43f5e', bg: '#081014' },
  { id: 'synthwave', name: 'Midnight Synth', icon: '🔮', desc: 'Vibrant purple & neon orange', up: '#a855f7', down: '#f97316', bg: '#0a0614' },
  { id: 'ice', name: 'Ice Glacier', icon: '💎', desc: 'Arctic blue & violet', up: '#38bdf8', down: '#ec4899', bg: '#070b14' },
];

const savedTheme = (() => {
  try {
    const raw = localStorage.getItem('xn_chart_theme');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
})();

const activePresetId = ref(savedTheme?.id || 'tv_classic');
const currentTheme = ref({
  up: savedTheme?.up || '#26a69a',
  down: savedTheme?.down || '#ef5350',
  bg: savedTheme?.bg || '#090d15',
  id: savedTheme?.id || 'tv_classic'
});

function selectPreset(preset) {
  activePresetId.value = preset.id;
  currentTheme.value = {
    id: preset.id,
    up: preset.up,
    down: preset.down,
    bg: preset.bg
  };
}

function resetToDefault() {
  selectPreset(presets[0]);
}

function applyTheme() {
  try {
    localStorage.setItem('xn_chart_theme', JSON.stringify(currentTheme.value));
  } catch {}

  const { notify } = useNotifications();
  notify({ message: `🎨 Chart theme updated!`, type: 'success' });
  emit('apply', currentTheme.value);
  emit('close');
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
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 9999px;
}
</style>
