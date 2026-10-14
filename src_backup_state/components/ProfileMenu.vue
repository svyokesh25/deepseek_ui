<template>
  <div class="fixed inset-0 z-50 pointer-events-auto" @click.self="$emit('close')">
    <!-- Backdrop to close on click outside -->
    <div class="absolute inset-0 bg-black/10 transition-opacity" @click="$emit('close')"></div>

    <!-- Flyout Panel (#targetmenu) -->
    <div
      class="absolute left-[54px] top-3 w-[308px] bg-[#f8fafc] dark:bg-[#0d1322] rounded-2xl shadow-2xl border border-xn-border dark:border-[#162032] flex flex-col z-50 overflow-hidden text-xn-text dark:text-[#d1d4dc] animate-in fade-in slide-in-from-left-2 duration-150 transition-colors"
      @click.stop
    >
      <!-- Header -->
      <div class="p-4 pb-2 flex flex-col items-center">
        <!-- Logo -->
        <div class="flex items-center justify-center gap-2 mb-1">
          <div class="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            XN
          </div>
          <span class="font-bold text-base tracking-tight text-gray-900 dark:text-white">XtremeNext</span>
        </div>
        <div class="text-xs text-xn-dim dark:text-[#787b86] font-medium">
          Hi, <span class="font-semibold text-xn-text dark:text-white">{{ userName }}</span>
        </div>
      </div>

      <!-- 1. Balance Card -->
      <div class="mx-3 mb-2.5 p-3.5 bg-white dark:bg-[#080c14] rounded-xl shadow-sm border border-gray-100 dark:border-[#162032] flex flex-col transition-colors">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-[#787b86] font-medium">Balance</span>
          <span
            class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer select-none transition-colors"
            :class="isDemo ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'"
            @click="isDemo = !isDemo"
            title="Click to toggle Demo/Live"
          >
            <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="isDemo ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-emerald-600 dark:bg-emerald-400'"></span>
            {{ isDemo ? 'Demo' : 'Live' }}
          </span>
        </div>

        <div class="text-xl font-bold text-gray-900 dark:text-white my-1 tabular-nums">
          $ {{ isDemo ? '10,000.00' : currentAccount.balance }}
        </div>

        <div class="h-px bg-gray-100 dark:bg-[#162032] my-2"></div>

        <div class="flex items-center justify-between text-xs text-gray-600 dark:text-[#787b86]">
          <span>Type: <b class="text-gray-900 dark:text-white font-semibold">{{ isDemo ? 'Demo' : 'Standard' }}</b></span>
          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-1 font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              @click="accountDropdownOpen = !accountDropdownOpen"
            >
              <span>{{ currentAccount.number }}</span>
              <svg class="w-3 h-3 text-gray-400 transition-transform" :class="{ 'rotate-180': accountDropdownOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <!-- Account Switcher List -->
            <div
              v-if="accountDropdownOpen"
              class="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-[#0d1322] rounded-lg shadow-xl border border-gray-100 dark:border-[#162032] py-1 z-20 text-xs"
            >
              <div
                v-for="acc in accounts"
                :key="acc.number"
                class="px-3 py-1.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#121b2d] cursor-pointer transition-colors"
                :class="{ 'bg-blue-50/60 dark:bg-[#142340] font-semibold text-blue-600 dark:text-[#38bdf8]': acc.number === currentAccount.number }"
                @click="selectAccount(acc)"
              >
                <span class="text-gray-900 dark:text-[#d1d4dc]">{{ acc.number }}</span>
                <span class="text-gray-500 dark:text-[#787b86] font-normal">$ {{ acc.balance }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Menu Tile Card -->
      <div class="mx-3 mb-2.5 bg-white dark:bg-[#080c14] rounded-xl shadow-sm border border-gray-100 dark:border-[#162032] divide-y divide-gray-100 dark:divide-[#162032] text-xs transition-colors">
        <!-- Dashboard -->
        <div class="p-2.5 px-3.5 flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#121b2d] transition-colors">
          <svg class="w-4 h-4 text-gray-700 dark:text-[#a0a5b0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
          <span class="font-medium text-gray-800 dark:text-[#d1d4dc]">Dashboard</span>
        </div>

        <!-- Settings -->
        <div class="p-2.5 px-3.5 flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#121b2d] transition-colors">
          <svg class="w-4 h-4 text-gray-700 dark:text-[#a0a5b0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M10 5H3" /><path d="M12 19H3" /><path d="M14 3v4" /><path d="M16 17v4" /><path d="M21 12h-9" /><path d="M21 19h-5" /><path d="M21 5h-7" /><path d="M8 10v4" /><path d="M8 12H3" />
          </svg>
          <span class="font-medium text-gray-800 dark:text-[#d1d4dc]">Settings</span>
        </div>

        <!-- Client Portal -->
        <div class="p-2.5 px-3.5 flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#121b2d] transition-colors">
          <svg class="w-4 h-4 text-gray-700 dark:text-[#a0a5b0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            <rect width="20" height="14" x="2" y="6" rx="2" />
          </svg>
          <span class="font-medium text-gray-800 dark:text-[#d1d4dc]">Client Portal</span>
        </div>

        <!-- Language Selector -->
        <div class="p-2.5 px-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#121b2d] transition-colors">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-gray-700 dark:text-[#a0a5b0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span class="font-medium text-gray-800 dark:text-[#d1d4dc]">Language</span>
          </div>
          <select v-model="selectedLanguage" class="bg-transparent text-gray-600 dark:text-[#d1d4dc] font-medium outline-none cursor-pointer text-xs">
            <option value="en" class="dark:bg-[#0d1322]">English</option>
            <option value="ar" class="dark:bg-[#0d1322]">العربية</option>
            <option value="thai" class="dark:bg-[#0d1322]">ไทย</option>
            <option value="pers" class="dark:bg-[#0d1322]">فارسی</option>
          </select>
        </div>

        <!-- Theme Toggle -->
        <div class="p-2.5 px-3.5 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-gray-700 dark:text-[#a0a5b0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 18a6 6 0 0 0 0-12v12z" />
            </svg>
            <span class="font-medium text-gray-800 dark:text-[#d1d4dc]">Theme</span>
          </div>
          <!-- Toggle switch knob -->
          <div
            class="w-11 h-6 rounded-full bg-gray-200 dark:bg-gray-700 relative p-0.5 cursor-pointer transition-colors"
            :class="{ 'bg-blue-600 dark:bg-blue-600': isDarkTheme }"
            @click="toggleTheme"
          >
            <div
              class="w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
              :class="{ 'translate-x-5': isDarkTheme }"
            ></div>
          </div>
        </div>

        <!-- Switch Charts (Black Trader / Trading View) -->
        <div class="p-2.5 px-3.5 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-gray-700 dark:text-[#a0a5b0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M3 3v16a2 2 0 0 0 2 2h16" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
            <span class="font-medium text-gray-800 dark:text-[#d1d4dc]">Switch Charts</span>
          </div>
          <div class="flex items-center rounded-full bg-gray-100 dark:bg-[#0d1322] p-0.5 border border-transparent dark:border-[#162032]">
            <button
              type="button"
              class="px-2 py-0.5 rounded-full font-bold text-[10px] transition-colors"
              :class="activeChart === 'BT' ? 'bg-white dark:bg-[#142340] shadow-xs text-gray-900 dark:text-white' : 'text-gray-500 dark:text-[#787b86]'"
              @click="activeChart = 'BT'"
            >
              BT
            </button>
            <button
              type="button"
              class="px-2 py-0.5 rounded-full font-bold text-[10px] transition-colors"
              :class="activeChart === 'TV' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-500 dark:text-[#787b86]'"
              @click="activeChart = 'TV'"
            >
              TV
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Logout Card -->
      <div class="mx-3 mb-3">
        <button
          type="button"
          class="w-full p-2.5 px-3.5 bg-white dark:bg-[#080c14] rounded-xl shadow-sm border border-gray-100 dark:border-[#162032] flex items-center gap-2.5 text-xs text-red-600 hover:bg-red-50/60 dark:hover:bg-[#2e1014] font-semibold cursor-pointer transition-colors"
          @click="$emit('close')"
        >
          <svg class="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme.js'

defineEmits(['close'])

const userName = ref('fake')
const isDemo = ref(false)
const selectedLanguage = ref('en')
const { isDark: isDarkTheme, toggle: toggleTheme } = useTheme()
const activeChart = ref('TV')
const accountDropdownOpen = ref(false)

const accounts = ref([
  { number: '10102', balance: '7,486.05' },
  { number: '10656', balance: '9,980.97' },
  { number: '10720', balance: '0.00' },
  { number: '10722', balance: '10,000.00' }
])

const currentAccount = ref(accounts.value[0])

function selectAccount(acc) {
  currentAccount.value = acc
  accountDropdownOpen.value = false
}
</script>
