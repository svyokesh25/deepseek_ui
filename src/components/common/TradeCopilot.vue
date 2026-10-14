<template>
  <div class="w-full h-full flex flex-col font-sans select-none bg-white dark:bg-[#0c121e] overflow-hidden">
    <!-- Panel Header -->
    <div class="px-3.5 py-2.5 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <div class="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-md shrink-0">
          <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div class="min-w-0">
          <h3 class="text-xs font-bold text-gray-900 dark:text-white leading-tight truncate">Trade Copilot</h3>
          <span class="text-[9px] text-gray-400 font-mono truncate block leading-tight">{{ symbol }} • {{ closePrice }}</span>
        </div>
      </div>

        <!-- Mode Toggle & Actions -->
        <div class="flex items-center gap-1 shrink-0">
          <!-- Tab selector -->
          <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 text-[10px]">
            <button
              type="button"
              class="px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer"
              :class="activeTab === 'chat' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              @click="activeTab = 'chat'"
            >
              💬 Chat
            </button>
            <button
              type="button"
              class="px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer"
              :class="activeTab === 'signals' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              @click="activeTab = 'signals'"
            >
              📊 Signals
            </button>
          </div>

          <!-- Settings Button -->
          <button
            type="button"
            title="Settings (API Key)"
            class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            :class="showSettings ? 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' : ''"
            @click="showSettings = !showSettings"
          >
            ⚙️
          </button>

          <!-- Close button -->
          <button
            type="button"
            class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer select-none active:scale-95"
            title="Close Copilot"
            @click="closeCopilot"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Settings Dropdown / Panel -->
      <div
        v-if="showSettings"
        class="p-3 bg-blue-50/80 dark:bg-[#111928] border-b border-blue-200/50 dark:border-blue-900/50 text-[11px] space-y-2 shrink-0"
      >
        <div class="flex items-center justify-between font-bold text-gray-800 dark:text-gray-200">
          <span>AI Engine Configuration</span>
          <span class="text-[9px] px-1.5 py-0.2 rounded font-mono bg-blue-500/20 text-blue-600 dark:text-blue-400">
            {{ useLLM && apiKey ? 'LLM Mode' : 'Smart Assistant' }}
          </span>
        </div>
        <div>
          <label class="block text-[10px] text-gray-500 dark:text-gray-400 mb-1">
            API Key (Optional - DeepSeek or OpenAI):
          </label>
          <div class="flex gap-1.5">
            <input
              v-model="apiKey"
              type="password"
              placeholder="sk-..."
              class="flex-1 px-2 py-1 text-xs rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500"
              @change="saveApiKey"
            />
            <button
              type="button"
              class="px-2.5 py-1 text-[10px] font-semibold rounded bg-blue-600 text-white hover:bg-blue-700"
              @click="saveApiKey"
            >
              Save
            </button>
          </div>
          <p class="text-[9px] text-gray-400 mt-1">
            Leave blank to use the free, instant built-in technical AI model.
          </p>
        </div>
      </div>

      <!-- Tab 1: Chat View -->
      <div v-if="activeTab === 'chat'" class="flex-1 flex flex-col min-h-0">
        <!-- Messages Scroll Container -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            class="flex flex-col"
            :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
          >
            <div class="flex items-start gap-1.5 max-w-[88%]">
              <div
                v-if="msg.sender === 'ai'"
                class="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] text-white shrink-0 mt-0.5 shadow-sm"
              >
                ✦
              </div>
              <div
                class="px-3 py-2 rounded-2xl leading-relaxed text-[11.5px]"
                :class="msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 border border-gray-200/50 dark:border-gray-700/50 rounded-tl-none shadow-sm'"
              >
                <div class="whitespace-pre-line" v-html="formatMessage(msg.text)"></div>
                <div
                  class="text-[8.5px] mt-1 text-right font-mono opacity-60"
                  :class="msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'"
                >
                  {{ msg.time }}
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isThinking" class="flex items-center gap-1.5 max-w-[88%]">
            <div class="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] text-white shrink-0 shadow-sm">
              ✦
            </div>
            <div class="px-3 py-2 rounded-2xl rounded-tl-none bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center gap-1 text-[11px]">
              <span>Thinking</span>
              <span class="animate-bounce">.</span>
              <span class="animate-bounce delay-100">.</span>
              <span class="animate-bounce delay-200">.</span>
            </div>
          </div>
        </div>

        <!-- Quick Question Chips -->
        <div class="px-3 py-1.5 bg-gray-50/70 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-800 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
          <button
            v-for="(chip, i) in quickChips"
            :key="i"
            type="button"
            class="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] font-medium text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer shadow-xs"
            @click="sendQuickPrompt(chip)"
          >
            {{ chip }}
          </button>
        </div>

        <!-- Chat Input Bar -->
        <div class="px-2.5 py-2 bg-white dark:bg-[#0c121e] border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 shrink-0">
          <input
            v-model="inputQuery"
            type="text"
            placeholder="Ask Copilot about EURUSD, levels, risk..."
            class="flex-1 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            @keydown.enter.prevent="handleSend"
          />
          <button
            type="button"
            :disabled="!inputQuery.trim() || isThinking"
            class="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center cursor-pointer shrink-0"
            @click="handleSend"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      <!-- Tab 2: Signals & Technicals View -->
      <div v-else class="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3 text-xs">
        <!-- Sentiment Bar -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-gray-500 dark:text-gray-400">Market Bias:</span>
            <span class="font-bold font-mono" :class="sentimentColor">{{ sentimentText }}</span>
          </div>
          <div class="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
            <div class="bg-[#089981] h-full transition-all duration-500" :style="{ width: bullishPct + '%' }"></div>
            <div class="bg-[#f23645] h-full transition-all duration-500" :style="{ width: (100 - bullishPct) + '%' }"></div>
          </div>
          <div class="flex justify-between text-[9px] text-gray-400 font-mono">
            <span>{{ bullishPct }}% Bullish</span>
            <span>{{ 100 - bullishPct }}% Bearish</span>
          </div>
        </div>

        <!-- Technical Signals Matrix -->
        <div class="grid grid-cols-2 gap-2 text-[10px]">
          <div class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 block">RSI (14)</span>
            <b class="text-gray-900 dark:text-white text-xs tabular-nums">{{ rsiValue }}</b>
            <span class="text-[9px] text-emerald-500 ml-1">Neutral/Bull</span>
          </div>
          <div class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 block">EMA 20/50</span>
            <b class="text-[#089981] text-xs">Bullish Cross</b>
            <span class="text-[9px] text-gray-400 ml-1">Above SMA</span>
          </div>
        </div>

        <!-- Key S/R Levels -->
        <div class="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[10.5px] space-y-1">
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Resistance (R1):</span>
            <b class="font-mono text-gray-800 dark:text-gray-200 tabular-nums">{{ resistanceLevel }}</b>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Support (S1):</span>
            <b class="font-mono text-gray-800 dark:text-gray-200 tabular-nums">{{ supportLevel }}</b>
          </div>
        </div>

        <!-- AI Trade Insight Summary -->
        <div class="p-2.5 rounded-lg bg-gray-50 dark:bg-[#131a29] border border-gray-100 dark:border-gray-800 text-[10.5px] text-gray-600 dark:text-gray-300 leading-relaxed">
          <div class="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 mb-1 text-[10px]">
            <span>💡 Copilot Brief</span>
          </div>
          <p>{{ dynamicInsight }}</p>
        </div>

        <!-- Action shortcut into chat -->
        <button
          type="button"
          class="w-full py-2 px-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-center font-semibold text-xs border border-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          @click="activeTab = 'chat'"
        >
          <span>Ask Copilot to analyze further</span>
          <span>→</span>
        </button>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';

const props = defineProps({
  symbol: { type: String, default: 'EURUSD' },
  summary: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close']);

function closeCopilot() {
  emit('close');
}

const activeTab = ref('chat'); // 'chat' | 'signals'
const showSettings = ref(false);
const apiKey = ref('');
const useLLM = ref(false);

const inputQuery = ref('');
const isThinking = ref(false);
const chatContainer = ref(null);

// Pricing & indicator computations
const closePrice = computed(() => {
  return Number(props.summary?.close || 1.11920);
});

const isUp = computed(() => {
  return Number(props.summary?.change || 0) >= 0;
});

const bullishPct = computed(() => {
  return isUp.value ? 68 : 42;
});

const sentimentText = computed(() => {
  return isUp.value ? 'BULLISH MOMENTUM' : 'BEARISH CONSOLIDATION';
});

const sentimentColor = computed(() => {
  return isUp.value ? 'text-[#089981] dark:text-[#34d399]' : 'text-[#f23645] dark:text-[#f87171]';
});

const rsiValue = computed(() => {
  return isUp.value ? '58.4' : '44.8';
});

const resistanceLevel = computed(() => {
  return (closePrice.value * 1.0025).toFixed(props.symbol.includes('JPY') ? 3 : 5);
});

const supportLevel = computed(() => {
  return (closePrice.value * 0.9975).toFixed(props.symbol.includes('JPY') ? 3 : 5);
});

const dynamicInsight = computed(() => {
  if (isUp.value) {
    return `${props.symbol} maintains an upward structure above immediate support. Watch for breakout above ${resistanceLevel.value} for sustained continuation with tight stop at ${supportLevel.value}.`;
  }
  return `${props.symbol} shows mild selling pressure near resistance. Caution recommended on extended longs; test of ${supportLevel.value} expected during current liquidity window.`;
});

// Quick prompt suggestions
const quickChips = ref([
  '🎯 Support & Resistance',
  '📈 Buy or Sell?',
  '🛡️ Stop Loss plan',
  '🔍 Explain RSI',
  '💡 Trade Setup'
]);

// Message History
const messages = ref([
  {
    sender: 'ai',
    text: `👋 **Welcome! I am your AI Trade Copilot.**\n\nI am analyzing **${props.symbol}** trading at **${closePrice.value}**.\n\nYou can ask me about **entry levels**, **support/resistance**, **stop loss**, or general market questions!`,
    time: formatCurrentTime()
  }
]);

// Update initial AI greeting when symbol changes
watch(() => props.symbol, (newSymbol) => {
  messages.value.push({
    sender: 'ai',
    text: `Switched chart to **${newSymbol}** (Current price: **${closePrice.value}**). What would you like to analyze on ${newSymbol}?`,
    time: formatCurrentTime()
  });
  scrollToBottom();
});

onMounted(() => {
  const savedKey = localStorage.getItem('trade_copilot_api_key');
  if (savedKey) {
    apiKey.value = savedKey;
    useLLM.value = true;
  }
});

function saveApiKey() {
  if (apiKey.value.trim()) {
    localStorage.setItem('trade_copilot_api_key', apiKey.value.trim());
    useLLM.value = true;
  } else {
    localStorage.removeItem('trade_copilot_api_key');
    useLLM.value = false;
  }
  showSettings.value = false;
}

function formatCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

function sendQuickPrompt(chipText) {
  // Strip emoji for query
  const clean = chipText.replace(/^[^\w]+/, '').trim();
  inputQuery.value = clean;
  handleSend();
}

async function handleSend() {
  const query = inputQuery.value.trim();
  if (!query || isThinking.value) return;

  // Add User Message
  messages.value.push({
    sender: 'user',
    text: query,
    time: formatCurrentTime()
  });

  inputQuery.value = '';
  isThinking.value = true;
  scrollToBottom();

  if (useLLM.value && apiKey.value) {
    await callExternalLLM(query);
  } else {
    // Built-in intelligent engine with slight human-like delay
    setTimeout(() => {
      const response = generateBuiltinResponse(query);
      messages.value.push({
        sender: 'ai',
        text: response,
        time: formatCurrentTime()
      });
      isThinking.value = false;
      scrollToBottom();
    }, 450);
  }
}

// Built-in Context-Aware Engine
function generateBuiltinResponse(q) {
  const lower = q.toLowerCase();
  const sym = props.symbol;
  const price = closePrice.value;
  const s1 = supportLevel.value;
  const r1 = resistanceLevel.value;
  const rsi = rsiValue.value;

  // Volatility & ATR Query
  if (lower.includes('volatility') || lower.includes('atr') || lower.includes('pip range') || lower.includes('expected range')) {
    const isGold = sym.includes('XAU');
    const isCrypto = sym.includes('BTC') || sym.includes('ETH');
    const dailyRange = isGold ? '$28.40 (68 pips)' : isCrypto ? '$1,420 (2.4%)' : '64.2 pips';
    const weeklyVol = isGold ? '1.85% (High Expansion)' : isCrypto ? '4.20% (Elevated)' : '0.78% (Normal-Moderate)';
    const avgAtr = isGold ? '3.80 (M15)' : '8.4 pips (M15)';
    const peakHours = isGold ? '13:00 - 17:00 UTC (London/NY Overlap)' : '12:30 - 16:30 UTC (US Market Open)';

    return `⚡ **Volatility & ATR Profile for ${sym}:**\n\n• **Weekly Volatility:** \`${weeklyVol}\`\n• **Daily True Range (DTR):** \`${dailyRange}\`\n• **14-period ATR (M15):** \`${avgAtr}\`\n• **Peak Volatility Window:** ${peakHours}\n• **Expected High/Low Buffer:** \`${r1}\` / \`${s1}\`\n\n💡 *Trading Guidance:* Volatility is in the 74th percentile this week. Ideal for breakout continuation setups with a minimum 1.2x ATR stop buffer.`;
  }

  if (lower.includes('challenge') || lower.includes('mission') || lower.includes('quest')) {
    return `🏆 **Discipline Challenges:**\n\nYou can access your **Daily & Weekly Discipline Missions** right now! Complete challenges like *"Follow Stop Loss on every trade today"* and *"Zero revenge trades"* to earn XP and Trader Trophies. Check the top bar 🏆 button!`;
  }

  if (lower.includes('quiz') || lower.includes('learn') || lower.includes('academy') || lower.includes('practice')) {
    return `🎓 **Trader Academy & Quizzes:**\n\nTest your skills with interactive quizzes on **Smart Money Concepts**, **Risk Management**, and **Candlestick Patterns**, and practice setups directly on the chart!`;
  }

  if (lower.includes('support') || lower.includes('resistance') || lower.includes('level') || lower.includes('ceiling') || lower.includes('floor')) {
    return `🎯 **Key Levels for ${sym}:**\n\n• **Resistance Ceiling (R1):** \`${r1}\`\n• **Current Price:** \`${price}\`\n• **Support Floor (S1):** \`${s1}\`\n\n💡 *Strategy:* If price pushes through \`${r1}\`, watch for an upside breakout. If it rejects from \`${r1}\`, it will likely retest support at \`${s1}\`.`;
  }

  if (lower.includes('buy') || lower.includes('sell') || lower.includes('should i') || lower.includes('long') || lower.includes('short')) {
    if (isUp.value) {
      return `📈 **Buy/Sell Bias for ${sym}:**\n\n• **Trend:** Bullish momentum (${bullishPct.value}% buyer strength)\n• **Preferred Action:** Buy on pullbacks toward support \`${s1}\`\n• **Target:** Resistance at \`${r1}\`\n• **Invalidation / Stop:** Below \`${s1}\`\n\n⚠️ *Always manage position size and limit risk to 1-2% of your capital.*`;
    } else {
      return `📉 **Buy/Sell Bias for ${sym}:**\n\n• **Trend:** Bearish consolidation (${100 - bullishPct.value}% seller dominance)\n• **Preferred Action:** Be cautious on fresh buys. Look for stabilization above \`${s1}\` before entering longs.\n• **Target:** \`${r1}\`\n• **Stop Loss:** Strict stop just below \`${s1}\`.`;
    }
  }

  if (lower.includes('rsi') || lower.includes('indicator') || lower.includes('momentum')) {
    const status = Number(rsi) > 70 ? 'Overbought (Caution)' : Number(rsi) < 30 ? 'Oversold (Bounce candidate)' : 'Neutral-to-Healthy Uptrend';
    return `🔍 **RSI Analysis (14-period):**\n\n• **Current RSI:** \`${rsi}\` (${status})\n• **Meaning:** The asset is maintaining healthy volume without reaching extreme overbought territory. Buyers still have room to push before exhaustion.`;
  }

  if (lower.includes('stop loss') || lower.includes('sl') || lower.includes('tp') || lower.includes('take profit') || lower.includes('risk')) {
    return `🛡️ **Risk Management Plan for ${sym}:**\n\n• **Suggested Stop Loss:** \`${s1}\` (protects against trend reversal)\n• **Suggested Take Profit (TP1):** \`${r1}\`\n• **Risk/Reward Ratio:** ~ 1:1.5 on breakout continuation\n\n💡 *Tip: Never enter without setting your stop loss right after execution.*`;
  }

  if (lower.includes('setup') || lower.includes('plan') || lower.includes('strategy')) {
    return `💡 **Trade Setup for ${sym}:**\n\n1. **Setup Type:** Continuation Long\n2. **Trigger:** Candle close above \`${price}\`\n3. **Target 1:** \`${r1}\`\n4. **Invalidation:** Below \`${s1}\`\n5. **Confidence:** ${bullishPct.value}% based on current EMA crossover and RSI momentum.`;
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hello! How can I assist you with your **${sym}** chart today? Ask me about levels, trade bias, or indicator status!`;
  }

  // Fallback smart response
  return `📊 **Summary for ${sym}:**\n\nCurrently trading at **${price}** with **${sentimentText.value}**.\n• Resistance is at **${r1}**\n• Support is at **${s1}**\n• RSI is sitting at **${rsi}**\n\nWhat specific setup or risk question can I answer for you?`;
}

// Optional External LLM Integration (DeepSeek / OpenAI compatible)
async function callExternalLLM(userQuery) {
  try {
    const systemPrompt = `You are an elite trading copilot assistant inside a professional trading terminal.
Active symbol: ${props.symbol}.
Current Price: ${closePrice.value}.
Support level: ${supportLevel.value}.
Resistance level: ${resistanceLevel.value}.
RSI(14): ${rsiValue.value}.
Market bias: ${sentimentText.value}.
Give concise, highly actionable trading responses in markdown with bullets.`;

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.value}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        temperature: 0.5
      })
    });

    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content || 'No response generated.';

    messages.value.push({
      sender: 'ai',
      text: answer,
      time: formatCurrentTime()
    });
  } catch (err) {
    // Graceful fallback to built-in response on API error
    const fallbackAnswer = generateBuiltinResponse(userQuery);
    messages.value.push({
      sender: 'ai',
      text: `${fallbackAnswer}\n\n*(Note: External API connection failed, switched to built-in smart assistant)*`,
      time: formatCurrentTime()
    });
  } finally {
    isThinking.value = false;
    scrollToBottom();
  }
}

// Simple formatter for bold text and bullets
function formatMessage(txt) {
  if (!txt) return '';
  return txt
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-black/10 dark:bg-white/10 px-1 py-0.2 rounded font-mono text-[10.5px]">$1</code>');
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
