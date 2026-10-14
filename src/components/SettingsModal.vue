<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[200] flex items-center justify-center p-4 select-none font-sans"
    @click.self="$emit('close')"
  >
    <div class="absolute inset-0 bg-black/40 backdrop-blur-2xs" @click="$emit('close')"></div>

    <div class="relative bg-white dark:bg-[#0a0a0a] border border-[#e3e6eb] dark:border-[#1a1a1a] rounded-xl shadow-2xl w-[480px] max-w-[94vw] overflow-hidden text-xs transition-colors">
      <!-- Header -->
      <div class="px-5 py-3.5 border-b border-[#f0f2f5] dark:border-[#1a1a1a] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-[#0072fd]">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span class="font-bold text-gray-900 dark:text-white text-sm">Chart & Workspace Settings</span>
        </div>
        <button
          type="button"
          class="w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-[#1f1f1f] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer transition-colors"
          @click="$emit('close')"
        >✕</button>
      </div>

      <!-- Body -->
      <div class="p-5 space-y-4">
        <!-- Theme appearance -->
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium text-gray-800 dark:text-[#d1d4dc]">Theme Appearance</div>
            <div class="text-[11px] text-gray-400 dark:text-[#787b86]">Switch between Whole White and Whole Black</div>
          </div>
          <div class="flex items-center bg-[#f0f2f5] dark:bg-[#121212] p-1 rounded-lg border border-[#e3e6eb] dark:border-[#1a1a1a]">
            <button
              v-for="opt in themeOptions"
              :key="opt.value"
              type="button"
              class="px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              :class="theme === opt.value
                ? (theme === 'dark' ? 'bg-[#1f1f1f] text-[#38bdf8] shadow-xs font-bold' : 'bg-white text-gray-900 shadow-xs font-bold')
                : 'text-gray-500 dark:text-[#787b86] hover:text-gray-900 dark:hover:text-white'"
              @click="setTheme(opt.value)"
            >
              <svg v-if="opt.value === 'light'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="text-amber-500">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
              <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="text-blue-400">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              <span>{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <!-- Grid Lines -->
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium text-gray-800 dark:text-[#d1d4dc]">Grid Lines</div>
            <div class="text-[11px] text-gray-400 dark:text-[#787b86]">Chart coordinate background grid</div>
          </div>
          <button
            type="button"
            class="relative w-[38px] h-[22px] rounded-full transition-colors cursor-pointer"
            :class="gridLines ? 'bg-[#0072fd]' : 'bg-[#d0d4dc] dark:bg-[#1a1a1a]'"
            @click="gridLines = !gridLines"
          >
            <span
              class="absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform"
              :class="gridLines ? 'left-[18px]' : 'left-[2px]'"
            ></span>
          </button>
        </div>

        <!-- Execution Sounds -->
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium text-gray-800 dark:text-[#d1d4dc]">Execution Sounds</div>
            <div class="text-[11px] text-gray-400 dark:text-[#787b86]">Audio feedback for orders and profit alerts</div>
          </div>
          <button
            type="button"
            class="relative w-[38px] h-[22px] rounded-full transition-colors cursor-pointer"
            :class="soundActive ? 'bg-[#0072fd]' : 'bg-[#d0d4dc] dark:bg-[#1a1a1a]'"
            @click="toggleSound"
          >
            <span
              class="absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform"
              :class="soundActive ? 'left-[18px]' : 'left-[2px]'"
            ></span>
          </button>
        </div>

        <!-- Timezone -->
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium text-gray-800 dark:text-[#d1d4dc]">Timezone</div>
            <div class="text-[11px] text-gray-400 dark:text-[#787b86]">Scale timestamps format</div>
          </div>
          <select
            v-model="timezone"
            class="text-xs bg-[#f4f6f9] dark:bg-[#121212] border border-[#e3e6eb] dark:border-[#1a1a1a] rounded px-2.5 py-1 outline-none text-[#212529] dark:text-[#d1d4dc] cursor-pointer"
          >
            <option value="utc">UTC (Universal Time)</option>
            <option value="local">Local time</option>
            <option value="ny">America / New York</option>
            <option value="ldn">Europe / London</option>
            <option value="tok">Asia / Tokyo</option>
          </select>
        </div>

        <!-- Reset Layout -->
        <div class="flex items-center justify-between pt-3 border-t border-[#f0f2f5] dark:border-[#1a1a1a]">
          <div>
            <div class="font-medium text-gray-800 dark:text-[#d1d4dc]">Reset layout</div>
            <div class="text-[11px] text-gray-400 dark:text-[#787b86]">
              Clears saved symbol, timeframe, engine, and panel sizes
            </div>
          </div>
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
            @click="onReset"
          >Reset</button>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-5 py-3 bg-[#f8fafc] dark:bg-[#000000] border-t border-[#f0f2f5] dark:border-[#1a1a1a] flex justify-end">
        <button
          type="button"
          class="px-4 py-1.5 rounded-lg bg-[#0072fd] hover:bg-[#005cd0] active:scale-95 text-white text-xs font-medium transition-all cursor-pointer"
          @click="$emit('close')"
        >Apply & Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme.js'
import { resetWorkspace } from '../composables/useWorkspace.js'
import { useNotifications } from '../stores/notifications.js'
import { isSoundEnabled, setSoundEnabled } from '../utils/soundFx.js'

defineProps({ open: { type: Boolean, default: false } })
defineEmits(['close'])

const { theme, setTheme } = useTheme()

const themeOptions = [
  { value: 'light', label: 'Whole White' },
  { value: 'dark',  label: 'Whole Black' }
]

const gridLines = ref(true)
const timezone  = ref('utc')
const soundActive = ref(isSoundEnabled())
const { showToast } = useNotifications()

function toggleSound() {
  soundActive.value = !soundActive.value
  setSoundEnabled(soundActive.value)
}

function onReset() {
  resetWorkspace()
  showToast('Workspace reset to defaults. Reloading...')
  setTimeout(() => {
    window.location.reload()
  }, 400)
}
</script>
