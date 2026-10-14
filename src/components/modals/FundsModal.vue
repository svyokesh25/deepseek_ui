<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none font-sans" @click="$emit('close')">
      <div
        class="bg-white dark:bg-[#0a0a0a] border border-[#e3e6eb] dark:border-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transition-colors my-auto"
        @click.stop
      >
      <!-- Header -->
      <div class="px-5 py-3.5 border-b border-[#f0f2f5] dark:border-[#1a1a1a] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-[#0072fd] dark:text-[#38bdf8]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-bold text-[#1a1d24] dark:text-white leading-tight">Funds & Account Wallets</h2>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">Institutional settlement & instant transfers</p>
          </div>
        </div>
        <button
          class="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1f1f1f] flex items-center justify-center cursor-pointer transition-colors"
          @click="$emit('close')"
        >✕</button>
      </div>

      <!-- Quick Balance Cards -->
      <div class="grid grid-cols-3 gap-3 p-4 bg-gray-50/50 dark:bg-[#000000] border-b border-[#f0f2f5] dark:border-[#1a1a1a]">
        <div class="p-2.5 rounded-lg bg-white dark:bg-[#141414] border border-[#e3e6eb] dark:border-[#1a1a1a]">
          <div class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Balance</div>
          <div class="text-sm font-bold text-[#1a1d24] dark:text-white tabular-nums mt-0.5">${{ balance.toFixed(2) }}</div>
        </div>
        <div class="p-2.5 rounded-lg bg-white dark:bg-[#141414] border border-[#e3e6eb] dark:border-[#1a1a1a]">
          <div class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Trading Equity</div>
          <div class="text-sm font-bold text-[#0072fd] dark:text-[#38bdf8] tabular-nums mt-0.5">${{ equity.toFixed(2) }}</div>
        </div>
        <div class="p-2.5 rounded-lg bg-white dark:bg-[#141414] border border-[#e3e6eb] dark:border-[#1a1a1a]">
          <div class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Free Margin</div>
          <div class="text-sm font-bold text-[#089981] dark:text-[#26a69a] tabular-nums mt-0.5">${{ freeMargin.toFixed(2) }}</div>
        </div>
      </div>

      <!-- Tabs: Deposit | Withdraw | History -->
      <div class="flex border-b border-[#f0f2f5] dark:border-[#1a1a1a] px-4 pt-2 gap-4 text-xs font-semibold">
        <button
          v-for="t in ['deposit', 'withdraw', 'wallets']"
          :key="t"
          class="pb-2 cursor-pointer transition-colors capitalize border-b-2"
          :class="activeTab === t
            ? 'text-[#0072fd] dark:text-[#38bdf8] border-[#0072fd] dark:border-[#38bdf8]'
            : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-white'"
          @click="activeTab = t"
        >{{ t }}</button>
      </div>

      <!-- Tab Body -->
      <div class="p-5 max-h-[380px] overflow-y-auto">
        <!-- Deposit -->
        <div v-if="activeTab === 'deposit'" class="space-y-4">
          <div>
            <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Select Network</label>
            <div class="grid grid-cols-3 gap-2 text-xs">
              <button
                v-for="net in ['USDT (TRC20)', 'USDT (ERC20)', 'BTC']"
                :key="net"
                type="button"
                class="py-1.5 px-2 rounded-md border text-center font-medium cursor-pointer transition-colors"
                :class="selectedNet === net
                  ? 'border-[#0072fd] bg-blue-50/60 dark:bg-blue-950/60 text-[#0072fd] dark:text-[#38bdf8] font-bold'
                  : 'border-gray-200 dark:border-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1f1f1f]'"
                @click="selectedNet = net"
              >{{ net }}</button>
            </div>
          </div>

          <!-- Deposit Address with QR -->
          <div class="p-3.5 rounded-lg border border-gray-200 dark:border-[#1a1a1a] bg-gray-50 dark:bg-[#121212] flex items-center gap-4">
            <!-- Simulated QR code SVG -->
            <div class="w-20 h-20 bg-white p-1 rounded-md border border-gray-200 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-full h-full text-gray-900" fill="currentColor">
                <path d="M2 2h8v8H2zm2 2v4h4V4zm-4 8h8v8H2zm2 2v4h4v-4zm10-12h8v8h-8zm2 2v4h4V4zm-2 10h2v2h-2zm4 0h4v2h-4zm-4 4h4v2h-4zm6-2h2v4h-2zm0-6h2v2h-2z" />
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <span class="text-[10px] font-bold text-gray-500 uppercase">Deposit Address</span>
              <div class="text-[11px] font-mono break-all text-gray-800 dark:text-gray-200 mt-1 select-all bg-white dark:bg-[#0a0a0a] p-1.5 rounded border border-gray-200 dark:border-[#1a1a1a]">
                {{ depositAddress }}
              </div>
              <button
                type="button"
                class="mt-2 text-[10px] font-bold text-[#0072fd] dark:text-[#38bdf8] hover:underline cursor-pointer flex items-center gap-1"
                @click="copyAddress"
              >
                <span>{{ copied ? '✓ Copied to clipboard!' : 'Copy Address' }}</span>
              </button>
            </div>
          </div>

          <div class="text-[11px] text-gray-500 leading-relaxed">
            * Instant crediting after 1 network confirmation. Minimum deposit $20.00.
          </div>
        </div>

        <!-- Withdraw -->
        <div v-else-if="activeTab === 'withdraw'" class="space-y-3.5">
          <div>
            <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Destination Address</label>
            <input
              v-model="withdrawAddress"
              type="text"
              placeholder="Paste recipient TRC20 / ERC20 address..."
              class="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#1a1a1a] rounded-md px-3 py-1.5 text-xs outline-none focus:border-[#0072fd] text-[#1a1d24] dark:text-white"
            />
          </div>

          <div>
            <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Withdraw Amount (USD)</label>
            <div class="relative">
              <input
                v-model.number="withdrawAmount"
                type="number"
                min="10"
                :max="freeMargin"
                placeholder="0.00"
                class="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#1a1a1a] rounded-md px-3 py-1.5 text-xs outline-none focus:border-[#0072fd] text-[#1a1d24] dark:text-white tabular-nums"
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#0072fd] hover:underline cursor-pointer"
                @click="withdrawAmount = freeMargin"
              >MAX</button>
            </div>
            <span class="text-[10px] text-gray-500 mt-0.5 block">Available to withdraw: ${{ freeMargin.toFixed(2) }}</span>
          </div>

          <button
            type="button"
            class="w-full py-2 rounded-lg bg-[#0072fd] hover:bg-[#005cd0] text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
            @click="submitWithdraw"
          >
            Submit Withdrawal Request
          </button>
        </div>

        <!-- Wallets -->
        <div v-else class="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
          <div
            v-for="w in wallets"
            :key="w.asset"
            class="py-2.5 flex items-center justify-between"
          >
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#1f1f1f] flex items-center justify-center font-bold text-xs text-gray-800 dark:text-white">
                {{ w.icon }}
              </div>
              <div>
                <div class="font-bold text-xs text-[#1a1d24] dark:text-white">{{ w.asset }}</div>
                <div class="text-[10px] text-gray-500">{{ w.network }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold text-xs tabular-nums text-[#1a1d24] dark:text-white">{{ w.amount }}</div>
              <div class="text-[10px] text-gray-500 tabular-nums">≈ ${{ w.usd }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { usePositions } from '../../stores/positions.js';
import { useNotifications } from '../../stores/notifications.js';

defineEmits(['close']);

const { balance, equity, freeMargin } = usePositions();
const { notify } = useNotifications();

const activeTab = ref('deposit');
const selectedNet = ref('USDT (TRC20)');
const depositAddress = ref('TJ9Pq8V9d2L6kNmK7bF1XQ4wErTs2Y8u9A');
const copied = ref(false);

const withdrawAddress = ref('');
const withdrawAmount = ref('');

const wallets = [
  { asset: 'Tether USD', icon: '₮', network: 'Tron (TRC-20)', amount: '5,240.00', usd: '5,240.00' },
  { asset: 'US Dollar', icon: '$', network: 'Fiat Treasury', amount: '2,244.29', usd: '2,244.29' },
  { asset: 'Bitcoin', icon: '₿', network: 'Bitcoin Mainnet', amount: '0.0482', usd: '3,284.10' }
];

function copyAddress() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(depositAddress.value).catch(() => {});
  }
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}

function submitWithdraw() {
  if (!withdrawAmount.value || withdrawAmount.value <= 0) {
    notify({ message: 'Please enter a valid withdrawal amount', type: 'error' });
    return;
  }
  notify({ message: `Withdrawal request for $${withdrawAmount.value} submitted successfully`, type: 'info' });
  withdrawAmount.value = '';
  withdrawAddress.value = '';
}
</script>
