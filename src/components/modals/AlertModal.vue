<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none font-sans"
      @click.self="$emit('close')"
    >
      <div class="bg-white dark:bg-[#0a0a0a] rounded-xl shadow-2xl border border-[#e3e6eb] dark:border-[#1a1a1a] w-full max-w-[480px] overflow-hidden transition-colors my-auto">
      <!-- Header -->
      <div class="px-5 py-3.5 border-b border-[#f0f2f5] dark:border-[#1a1a1a] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-[#0072fd] dark:text-[#38bdf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span class="font-bold text-gray-900 dark:text-white text-sm">Create Alert on {{ symbol }}</span>
        </div>
        <button
          type="button"
          class="w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-[#1f1f1f] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer transition-colors"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="p-5 space-y-4 text-xs">
        <!-- Condition row -->
        <div>
          <label class="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Condition</label>
          <div class="grid grid-cols-2 gap-2">
            <div class="px-3 py-2 bg-[#f4f6f9] dark:bg-[#121212] border border-[#e3e6eb] dark:border-[#1a1a1a] rounded-lg font-medium text-gray-800 dark:text-gray-200">
              {{ symbol }}
            </div>
            <select
              v-model="condition"
              class="px-3 py-2 bg-[#f4f6f9] dark:bg-[#121212] border border-[#e3e6eb] dark:border-[#1a1a1a] rounded-lg outline-none font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              <option value="crossing">Crossing</option>
              <option value="crossing-up">Crossing Up</option>
              <option value="crossing-down">Crossing Down</option>
              <option value="greater-than">Greater Than</option>
              <option value="less-than">Less Than</option>
            </select>
          </div>
        </div>

        <!-- Target Price -->
        <div>
          <label class="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Target Value / Price</label>
          <input
            v-model.number="targetPrice"
            type="number"
            step="0.001"
            class="w-full px-3 py-2 bg-[#f4f6f9] dark:bg-[#121212] border border-[#e3e6eb] dark:border-[#1a1a1a] rounded-lg outline-none focus:border-[#0072fd] text-gray-800 dark:text-gray-200 font-mono"
            placeholder="e.g. 4175.50"
          />
        </div>

        <!-- Trigger Frequency -->
        <div>
          <label class="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Trigger</label>
          <div class="flex gap-2">
            <button
              type="button"
              class="flex-1 py-1.5 px-3 rounded-lg border text-center transition-colors font-medium cursor-pointer"
              :class="triggerType === 'once'
                ? 'bg-[#0072fd] border-[#0072fd] text-white'
                : 'border-[#e3e6eb] dark:border-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#151515]'"
              @click="triggerType = 'once'"
            >
              Only Once
            </button>
            <button
              type="button"
              class="flex-1 py-1.5 px-3 rounded-lg border text-center transition-colors font-medium cursor-pointer"
              :class="triggerType === 'every'
                ? 'bg-[#0072fd] border-[#0072fd] text-white'
                : 'border-[#e3e6eb] dark:border-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#151515]'"
              @click="triggerType = 'every'"
            >
              Every Time
            </button>
          </div>
        </div>

        <!-- Notification Options -->
        <div class="pt-2 border-t border-[#f0f2f5] dark:border-[#1a1a1a] space-y-2">
          <label class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
            <input v-model="playAudio" type="checkbox" class="accent-[#0072fd] rounded" />
            <span>Play sound alert</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
            <input v-model="sendAppToast" type="checkbox" class="accent-[#0072fd] rounded" />
            <span>Show in-app notification popup</span>
          </label>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-5 py-3.5 bg-[#f8fafc] dark:bg-[#000000] border-t border-[#f0f2f5] dark:border-[#1a1a1a] flex justify-end gap-2">
        <button
          type="button"
          class="px-4 py-1.5 border border-[#e3e6eb] dark:border-[#1a1a1a] text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-5 py-1.5 bg-[#0072fd] hover:bg-blue-600 active:scale-95 text-white font-semibold rounded-lg transition-all cursor-pointer shadow-sm"
          @click="saveAlert"
        >
          Create Alert
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { useNotifications } from '../../stores/notifications.js';

const props = defineProps({
  open:   { type: Boolean, default: false },
  symbol: { type: String, default: 'XAUUSD' },
  price:  { type: [Number, String], default: 4168.84 }
});

const emit = defineEmits(['close']);

const condition = ref('crossing');
const targetPrice = ref(props.price);
const triggerType = ref('once');
const playAudio = ref(true);
const sendAppToast = ref(true);

const { addToast } = useNotifications();

function saveAlert() {
  addToast({
    type: 'success',
    title: `Alert Created on ${props.symbol}`,
    message: `Trigger when price ${condition.value} ${targetPrice.value}`
  });
  emit('close');
}
</script>
