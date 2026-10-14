<template>
  <Teleport to="body">
    <div
      v-if="isScannerOpen"
      class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none font-sans"
      @click.self="closeScanner"
    >
    <div class="relative w-full max-w-lg bg-[#0a0f1d] border border-blue-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,114,253,0.25)] overflow-hidden flex flex-col">
      <!-- Radar Sweep Line Animation during Scanning -->
      <div
        v-if="isScanning"
        class="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-center bg-[#0a0f1d]/90 backdrop-blur-sm"
      >
        <div class="relative w-28 h-28 rounded-full border border-blue-500/40 flex items-center justify-center overflow-hidden mb-4 shadow-[0_0_30px_rgba(0,114,253,0.3)]">
          <div class="absolute inset-2 rounded-full border border-blue-400/20"></div>
          <div class="absolute inset-8 rounded-full border border-blue-400/30"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></div>
          <!-- Rotating Radar Sweep Line -->
          <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/20 to-blue-400/60 rounded-full animate-spin"></div>
        </div>
        <div class="text-sm font-bold text-white flex items-center gap-2">
          <span>⚡ AI Scanning Chart Structure...</span>
        </div>
        <p class="text-xs text-blue-300/70 font-mono mt-1">Analyzing Order Blocks, FVGs & Liquidity Sweeps</p>
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-[#1e293b] bg-[#070b16]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm shadow-md">
            ⚡
          </div>
          <div>
            <h3 class="text-sm font-black text-white flex items-center gap-2">
              AI Smart Vision Scanner
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold border border-blue-500/30">
                PRO SMC
              </span>
            </h3>
            <p class="text-[11px] text-gray-400">1-Click Institutional Market Structure & Setup Breakdown</p>
          </div>
        </div>

        <button
          type="button"
          class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          @click="closeScanner"
        >
          ✕
        </button>
      </div>

      <!-- Scanner Content -->
      <div class="p-5 space-y-4">
        <!-- Symbol & Bias Hero Banner -->
        <div
          class="p-4 rounded-xl border relative overflow-hidden flex items-center justify-between"
          :class="scanResult.bias === 'BULLISH'
            ? 'bg-gradient-to-r from-emerald-950/40 to-[#0a141e] border-emerald-500/40 shadow-emerald-950/30'
            : 'bg-gradient-to-r from-rose-950/40 to-[#1e0a14] border-rose-500/40 shadow-rose-950/30'"
        >
          <div>
            <div class="flex items-center gap-2">
              <span class="text-base font-black text-white">{{ scanResult.symbol }}</span>
              <span class="text-xs font-mono text-gray-400">({{ scanResult.timeframe }})</span>
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
                :class="scanResult.bias === 'BULLISH'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'"
              >
                {{ scanResult.bias }} BIAS
              </span>
            </div>
            <p class="text-xs text-gray-300 font-medium mt-1">
              {{ scanResult.setupType }}
            </p>
          </div>

          <div class="text-right">
            <span class="text-[10px] text-gray-400 font-semibold block uppercase">Confluence Score</span>
            <span
              class="text-2xl font-black font-mono"
              :class="scanResult.bias === 'BULLISH' ? 'text-emerald-400' : 'text-rose-400'"
            >
              {{ scanResult.confidence }}%
            </span>
          </div>
        </div>

        <!-- SMC Levels Breakdown Grid -->
        <div class="grid grid-cols-2 gap-2.5 text-xs">
          <div class="p-3 rounded-xl bg-[#0f172a]/70 border border-[#1e293b]">
            <span class="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Fair Value Gap (FVG)</span>
            <span class="font-mono text-blue-300 font-semibold">{{ scanResult.fvgZone }}</span>
          </div>

          <div class="p-3 rounded-xl bg-[#0f172a]/70 border border-[#1e293b]">
            <span class="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Liquidity Sweep</span>
            <span class="font-mono text-amber-300 font-semibold">{{ scanResult.liquidityLevel }}</span>
          </div>
        </div>

        <!-- Trade Setup Box (Entry, SL, TP, RR) -->
        <div class="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
          <div class="flex items-center justify-between text-xs pb-1.5 border-b border-white/5">
            <span class="text-gray-400 font-medium">Risk-to-Reward Ratio</span>
            <span class="font-mono font-black text-emerald-400 text-sm bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {{ scanResult.rr }}
            </span>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div class="p-2 rounded-lg bg-[#0e1626]">
              <span class="text-[10px] text-gray-400 block">Entry Price</span>
              <span class="font-mono font-bold text-white text-xs tabular-nums">{{ scanResult.entry }}</span>
            </div>

            <div class="p-2 rounded-lg bg-[#1f1015]">
              <span class="text-[10px] text-rose-400 block">Stop Loss (SL)</span>
              <span class="font-mono font-bold text-rose-300 text-xs tabular-nums">{{ scanResult.sl }}</span>
            </div>

            <div class="p-2 rounded-lg bg-[#0b1f18]">
              <span class="text-[10px] text-emerald-400 block">Take Profit (TP)</span>
              <span class="font-mono font-bold text-emerald-300 text-xs tabular-nums">{{ scanResult.tp }}</span>
            </div>
          </div>

          <p class="text-[11px] text-gray-400 italic pt-1 leading-relaxed">
            "{{ scanResult.notes }}"
          </p>
        </div>
      </div>

      <!-- Action Buttons Footer -->
      <div class="p-4 bg-[#070b16] border-t border-[#1e293b] flex items-center justify-between gap-2.5">
        <button
          type="button"
          class="flex-1 py-2.5 px-3 rounded-xl bg-[#1e293b] hover:bg-[#2d3a4f] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          @click="plotSetupOnChart"
        >
          <span>🎯 Plot on Chart</span>
        </button>

        <button
          type="button"
          class="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-lg shadow-blue-500/25"
          @click="executeScannedTrade"
        >
          <span>⚡ Execute Trade (0.10)</span>
        </button>

        <button
          type="button"
          class="p-2.5 rounded-xl bg-[#141b29] hover:bg-[#1e273b] text-gray-300 hover:text-white transition-all cursor-pointer"
          title="Re-Scan Chart"
          @click="runAiScan(scanResult.symbol, scanResult.timeframe.replace('m',''), scanResult.currentPrice)"
        >
          🔄
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import {
  isScannerOpen,
  isScanning,
  scanResult,
  closeScanner,
  runAiScan,
  plotSetupOnChart,
  executeScannedTrade
} from '../../stores/aiScanner.js';
</script>
