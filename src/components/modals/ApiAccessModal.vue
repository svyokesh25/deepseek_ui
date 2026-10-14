<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none font-sans" @click="$emit('close')">
      <div
        class="bg-white dark:bg-[#0a0a0a] border border-[#e3e6eb] dark:border-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-xl overflow-hidden transition-colors my-auto"
        @click.stop
      >
      <!-- Header -->
      <div class="px-5 py-3.5 border-b border-[#f0f2f5] dark:border-[#1a1a1a] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m16 18 6-6-6-6" />
              <path d="m8 6-6 6 6 6" />
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-bold text-[#1a1d24] dark:text-white leading-tight">API Access & TradingView Webhooks</h2>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">Automate order execution directly from TradingView alerts & custom bots</p>
          </div>
        </div>
        <button
          class="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1f1f1f] flex items-center justify-center cursor-pointer transition-colors"
          @click="$emit('close')"
        >✕</button>
      </div>

      <!-- Body -->
      <div class="p-5 max-h-[440px] overflow-y-auto space-y-4">
        <!-- 1. API Key -->
        <div>
          <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Live Terminal API Key</label>
          <div class="flex items-center gap-2">
            <input
              type="text"
              readonly
              :value="apiKey"
              class="flex-1 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#1a1a1a] rounded-md px-3 py-1.5 text-xs font-mono outline-none text-[#1a1d24] dark:text-white select-all"
            />
            <button
              type="button"
              class="px-3 py-1.5 rounded-md bg-[#0072fd] hover:bg-[#005cd0] text-white text-xs font-bold cursor-pointer transition-colors"
              @click="copyText(apiKey, 'apiKey')"
            >
              {{ copiedField === 'apiKey' ? '✓ Copied' : 'Copy' }}
            </button>
            <button
              type="button"
              class="px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#1f1f1f] text-gray-700 dark:text-gray-300 text-xs cursor-pointer transition-colors"
              title="Regenerate Key"
              @click="regenerateKey"
            >
              ↻
            </button>
          </div>
        </div>

        <!-- 2. TradingView Webhook URL -->
        <div>
          <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">TradingView Alert Webhook URL</label>
          <div class="flex items-center gap-2">
            <input
              type="text"
              readonly
              :value="webhookUrl"
              class="flex-1 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#1a1a1a] rounded-md px-3 py-1.5 text-xs font-mono outline-none text-[#1a1d24] dark:text-white select-all"
            />
            <button
              type="button"
              class="px-3 py-1.5 rounded-md bg-[#0072fd] hover:bg-[#005cd0] text-white text-xs font-bold cursor-pointer transition-colors"
              @click="copyText(webhookUrl, 'webhook')"
            >
              {{ copiedField === 'webhook' ? '✓ Copied' : 'Copy' }}
            </button>
          </div>
          <p class="text-[10.5px] text-gray-500 mt-1">Paste this into TradingView's Alert Message "Webhook URL" field.</p>
        </div>

        <!-- 3. Alert JSON Payload Template -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="text-[11px] font-semibold text-gray-700 dark:text-gray-300">TradingView Alert Message (JSON)</label>
            <button
              type="button"
              class="text-[10px] font-bold text-[#0072fd] hover:underline cursor-pointer"
              @click="copyText(jsonTemplate, 'json')"
            >
              {{ copiedField === 'json' ? '✓ Copied' : 'Copy JSON Template' }}
            </button>
          </div>
          <pre class="bg-gray-900 text-gray-100 text-[11px] font-mono p-3 rounded-lg overflow-x-auto border border-gray-800 leading-relaxed">{{ jsonTemplate }}</pre>
        </div>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

defineEmits(['close']);

const apiKey = ref('xn_live_948f20b84c8a417da5c34e792');
const webhookUrl = ref('https://api.xtremenext.terminal/v1/webhook/tradingview');
const copiedField = ref('');

const jsonTemplate = `{
  "action": "{{strategy.order.action}}",
  "symbol": "{{ticker}}",
  "lot": 0.01,
  "apiKey": "xn_live_948f20b84c8a417da5c34e792"
}`;

function copyText(val, field) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(val).catch(() => {});
  }
  copiedField.value = field;
  setTimeout(() => { copiedField.value = ''; }, 2000);
}

function regenerateKey() {
  const rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  apiKey.value = 'xn_live_' + rand;
}
</script>
