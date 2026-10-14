<template>
  <Teleport to="body">
    <div
      v-if="isPnlModalOpen"
      class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none font-sans"
      @click.self="closePnlCard"
    >
    <div class="relative w-full max-w-lg bg-[#0e131f] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-[#1e293b] bg-[#090d15]">
        <div class="flex items-center gap-2">
          <span class="text-lg">📸</span>
          <div>
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              Viral P/L Flex Card
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
                Social Ready
              </span>
            </h3>
            <p class="text-[11px] text-gray-400">Share your verified returns to Discord, X (Twitter), or Telegram</p>
          </div>
        </div>
        <button
          type="button"
          class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          @click="closePnlCard"
        >
          ✕
        </button>
      </div>

      <!-- Theme Selector Bar -->
      <div class="px-5 py-2.5 bg-[#0a0f19] border-b border-[#1a2333] flex items-center justify-between text-xs">
        <span class="text-gray-400 font-medium">Card Style:</span>
        <div class="flex items-center gap-1.5">
          <button
            v-for="t in themes"
            :key="t.id"
            type="button"
            class="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
            :class="selectedTheme === t.id
              ? 'bg-[#0072fd] text-white shadow-md'
              : 'bg-[#141b29] text-gray-400 hover:text-gray-200'"
            @click="selectedTheme = t.id"
          >
            <span>{{ t.icon }}</span>
            <span>{{ t.name }}</span>
          </button>
        </div>
      </div>

      <!-- Card Preview Canvas / Display Area -->
      <div class="p-5 flex justify-center items-center bg-[#070a10]">
        <!-- The Visual PnL Card -->
        <div
          ref="cardContainerRef"
          class="w-full max-w-[420px] rounded-2xl p-6 relative overflow-hidden transition-all duration-300 shadow-2xl border"
          :class="themeClasses"
        >
          <!-- Background Chart Waveform Accent -->
          <svg
            class="absolute bottom-0 right-0 w-[280px] h-[160px] pointer-events-none opacity-20"
            viewBox="0 0 300 150"
            fill="none"
          >
            <path
              d="M0 130 C 50 120, 80 140, 120 90 C 160 40, 200 80, 240 30 C 270 -10, 290 10, 300 0 L 300 150 L 0 150 Z"
              :fill="activePnlTrade.pl >= 0 ? '#10b981' : '#f43f5e'"
            />
            <path
              d="M0 130 C 50 120, 80 140, 120 90 C 160 40, 200 80, 240 30 C 270 -10, 290 10, 300 0"
              :stroke="activePnlTrade.pl >= 0 ? '#10b981' : '#f43f5e'"
              stroke-width="3"
            />
          </svg>

          <!-- Card Top Bar: Logo & Verification -->
          <div class="flex items-center justify-between mb-5 relative z-10">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-xs shadow-md">
                XN
              </div>
              <div>
                <span class="text-xs font-black tracking-wider text-white uppercase block leading-none">
                  XtremeNext
                </span>
                <span class="text-[9px] font-mono text-gray-400 tracking-widest block uppercase mt-0.5">
                  Pro Terminal
                </span>
              </div>
            </div>

            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>VERIFIED FILL</span>
            </div>
          </div>

          <!-- Symbol & Trade Side -->
          <div class="flex items-center gap-2 mb-2 relative z-10">
            <span class="text-base font-black text-white tracking-wide">
              {{ activePnlTrade.symbol }}
            </span>
            <span
              class="px-2 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wider"
              :class="activePnlTrade.side === 'BUY'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'"
            >
              {{ activePnlTrade.side }} {{ activePnlTrade.leverage || '100x' }}
            </span>
            <span class="text-[11px] text-gray-400 font-mono">
              {{ activePnlTrade.lot }} Lot
            </span>
          </div>

          <!-- Big ROI % Display -->
          <div class="mb-4 relative z-10">
            <div
              class="text-4xl sm:text-5xl font-black font-mono tracking-tight leading-none"
              :class="activePnlTrade.pl >= 0
                ? 'text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]'
                : 'text-rose-400 drop-shadow-[0_0_20px_rgba(251,113,133,0.5)]'"
            >
              {{ (activePnlTrade.plPercent >= 0 ? '+' : '') + Number(activePnlTrade.plPercent).toFixed(2) }}%
            </div>
            <div class="flex items-center gap-2 mt-1.5">
              <span class="text-xs font-medium text-gray-400">Total Profit:</span>
              <span
                class="text-sm font-bold font-mono"
                :class="activePnlTrade.pl >= 0 ? 'text-emerald-300' : 'text-rose-300'"
              >
                {{ (activePnlTrade.pl >= 0 ? '+' : '') }}${{ Number(activePnlTrade.pl).toFixed(2) }} USD
              </span>
            </div>
          </div>

          <!-- Price Level Comparison Grid -->
          <div class="grid grid-cols-2 gap-3 p-3 rounded-xl bg-black/40 border border-white/5 backdrop-blur-sm mb-4 relative z-10 text-xs">
            <div>
              <span class="text-[10px] uppercase font-semibold text-gray-400 block mb-0.5">Entry Price</span>
              <span class="font-mono font-bold text-white text-xs tabular-nums">
                {{ Number(activePnlTrade.entry).toFixed(activePnlTrade.digits || 2) }}
              </span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-semibold text-gray-400 block mb-0.5">Mark / Exit Price</span>
              <span class="font-mono font-bold text-white text-xs tabular-nums">
                {{ Number(activePnlTrade.currentPrice).toFixed(activePnlTrade.digits || 2) }}
              </span>
            </div>
          </div>

          <!-- Card Footer: Trader Info & Date -->
          <div class="flex items-center justify-between pt-2 border-t border-white/10 relative z-10 text-[10px] text-gray-400">
            <div class="flex items-center gap-1.5 font-mono">
              <span class="text-emerald-400 font-bold">@{{ activePnlTrade.traderName || 'XtremeTrader' }}</span>
              <span>•</span>
              <span>{{ activePnlTrade.date }} {{ activePnlTrade.time }}</span>
            </div>
            <div class="font-mono text-[9px] text-gray-400 uppercase tracking-widest">
              xtremenext.terminal
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons Footer -->
      <div class="p-4 bg-[#090d15] border-t border-[#1e293b] flex items-center justify-between gap-2.5">
        <button
          type="button"
          class="flex-1 py-2.5 px-3 rounded-xl bg-[#1e293b] hover:bg-[#2d3a4f] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          @click="copyCardImage"
        >
          <span>{{ copied ? '✅ Copied!' : '📋 Copy Image' }}</span>
        </button>

        <button
          type="button"
          class="flex-1 py-2.5 px-3 rounded-xl bg-[#0072fd] hover:bg-[#005ed1] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-blue-500/20"
          @click="downloadCard"
        >
          <span>💾 Download PNG</span>
        </button>

        <button
          type="button"
          class="py-2.5 px-3 rounded-xl bg-black hover:bg-neutral-900 border border-neutral-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
          title="Share to X (Twitter)"
          @click="shareToTwitter"
        >
          <span>𝕏 Post</span>
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { isPnlModalOpen, activePnlTrade, closePnlCard } from '../../stores/pnlCard.js';

const cardContainerRef = ref(null);
const copied = ref(false);

const themes = [
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌌' },
  { id: 'gold',      name: 'Gold Foil', icon: '👑' },
  { id: 'binance',   name: 'Binance',   icon: '🟢' },
  { id: 'ice',       name: 'Hologram',  icon: '💎' }
];

const selectedTheme = ref('cyberpunk');

const themeClasses = computed(() => {
  switch (selectedTheme.value) {
    case 'gold':
      return 'bg-gradient-to-br from-[#1c1810] via-[#120f0a] to-[#0a0805] border-amber-500/30 shadow-amber-950/40';
    case 'binance':
      return 'bg-gradient-to-br from-[#12161f] via-[#0e121a] to-[#080b10] border-emerald-500/30 shadow-emerald-950/40';
    case 'ice':
      return 'bg-gradient-to-br from-[#0c1829] via-[#09101d] to-[#040810] border-cyan-500/30 shadow-cyan-950/40';
    case 'cyberpunk':
    default:
      return 'bg-gradient-to-br from-[#0b1329] via-[#080d1c] to-[#040710] border-blue-500/30 shadow-blue-950/40';
  }
});

/**
 * High-resolution HTML5 Canvas generator for instant PNG download or clipboard copy
 */
function renderCardToCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 840; // 2x retina
  canvas.height = 540;
  const ctx = canvas.getContext('2d');

  const isProfit = activePnlTrade.pl >= 0;
  const theme = selectedTheme.value;

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 840, 540);
  if (theme === 'gold') {
    grad.addColorStop(0, '#1f1a10');
    grad.addColorStop(0.6, '#120f0a');
    grad.addColorStop(1, '#080604');
  } else if (theme === 'binance') {
    grad.addColorStop(0, '#121824');
    grad.addColorStop(0.6, '#0d131d');
    grad.addColorStop(1, '#070a10');
  } else if (theme === 'ice') {
    grad.addColorStop(0, '#0c1a2e');
    grad.addColorStop(0.6, '#081120');
    grad.addColorStop(1, '#030710');
  } else {
    grad.addColorStop(0, '#0b142c');
    grad.addColorStop(0.6, '#070d1e');
    grad.addColorStop(1, '#030610');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 840, 540);

  // Outer Border
  ctx.strokeStyle = theme === 'gold' ? '#d97706' : (isProfit ? '#10b981' : '#f43f5e');
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 820, 520);

  // Background wave path
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = isProfit ? '#10b981' : '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(300, 540);
  ctx.bezierCurveTo(450, 480, 550, 360, 680, 240);
  ctx.bezierCurveTo(740, 160, 800, 220, 840, 180);
  ctx.lineTo(840, 540);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Header Logo & Brand
  ctx.fillStyle = '#0072fd';
  ctx.fillRect(40, 36, 44, 44);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px -apple-system, sans-serif';
  ctx.fillText('XN', 48, 66);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 22px -apple-system, sans-serif';
  ctx.fillText('XTREMENEXT', 96, 56);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px -apple-system, sans-serif';
  ctx.fillText('PRO TRADING TERMINAL', 96, 74);

  // Verified Badge
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  ctx.fillRect(630, 40, 170, 34);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(630, 40, 170, 34);
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('● VERIFIED FILL', 655, 62);

  // Symbol & Side
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 32px -apple-system, sans-serif';
  ctx.fillText(activePnlTrade.symbol, 40, 140);

  ctx.fillStyle = activePnlTrade.side === 'BUY' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)';
  ctx.fillRect(210, 114, 110, 32);
  ctx.fillStyle = activePnlTrade.side === 'BUY' ? '#34d399' : '#fb7171';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText(`${activePnlTrade.side} 100x`, 225, 136);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 16px monospace';
  ctx.fillText(`${activePnlTrade.lot} Lot`, 335, 136);

  // Big ROI Text
  ctx.fillStyle = isProfit ? '#34d399' : '#fb7171';
  ctx.font = '900 78px monospace';
  const pctStr = (activePnlTrade.plPercent >= 0 ? '+' : '') + Number(activePnlTrade.plPercent).toFixed(2) + '%';
  ctx.fillText(pctStr, 40, 240);

  // Profit Dollar Amount
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 18px -apple-system, sans-serif';
  ctx.fillText('Net Profit: ', 40, 285);
  ctx.fillStyle = isProfit ? '#a7f3d0' : '#fecdd3';
  ctx.font = 'bold 22px monospace';
  const usdStr = (activePnlTrade.pl >= 0 ? '+' : '') + '$' + Number(activePnlTrade.pl).toFixed(2) + ' USD';
  ctx.fillText(usdStr, 140, 285);

  // Price Info Box
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(40, 320, 760, 90);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.strokeRect(40, 320, 760, 90);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 13px -apple-system, sans-serif';
  ctx.fillText('ENTRY PRICE', 60, 352);
  ctx.fillText('EXIT / MARK PRICE', 420, 352);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px monospace';
  ctx.fillText(Number(activePnlTrade.entry).toFixed(activePnlTrade.digits || 2), 60, 388);
  ctx.fillText(Number(activePnlTrade.currentPrice).toFixed(activePnlTrade.digits || 2), 420, 388);

  // Footer
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 14px monospace';
  ctx.fillText(`@${activePnlTrade.traderName || 'XtremeTrader'}`, 40, 480);
  ctx.fillStyle = '#64748b';
  ctx.font = '500 14px -apple-system, sans-serif';
  ctx.fillText(`• ${activePnlTrade.date} ${activePnlTrade.time}`, 180, 480);

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('XTREMENEXT.TERMINAL', 640, 480);

  return canvas;
}

function downloadCard() {
  const canvas = renderCardToCanvas();
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `pnl_${activePnlTrade.symbol}_${Date.now()}.png`;
  a.click();
}

async function copyCardImage() {
  try {
    const canvas = renderCardToCanvas();
    canvas.toBlob(async (blob) => {
      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2500);
      } else {
        downloadCard();
      }
    });
  } catch (err) {
    downloadCard();
  }
}

function shareToTwitter() {
  const isProfit = activePnlTrade.pl >= 0;
  const sign = isProfit ? '+' : '';
  const text = encodeURIComponent(
    `Just closed ${sign}$${Number(activePnlTrade.pl).toFixed(2)} (${sign}${Number(activePnlTrade.plPercent).toFixed(2)}%) on ${activePnlTrade.symbol} using @XtremeNext terminal! 🚀📈\n\n#Forex #Trading #Crypto`
  );
  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
}
</script>
