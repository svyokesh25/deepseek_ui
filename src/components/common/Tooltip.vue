<template>
  <span class="xn-tt-wrap">
    <slot />
    <span v-if="text" class="xn-tt" :class="position === 'bottom' ? 'xn-tt-bottom' : 'xn-tt-top'">
      {{ text }}
    </span>
  </span>
</template>

<script setup>
defineProps({
  text:     { type: String, required: true },
  position: { type: String, default: 'top' }
});
</script>

<style scoped>
.xn-tt-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.xn-tt {
  position: absolute;
  background: #1a1d24;
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  padding: 4px 8px;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(20, 24, 33, 0.25);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease 0.15s, transform 0.15s ease 0.15s;
  z-index: 1000;
  left: 50%;
}
.xn-tt-top    { bottom: calc(100% + 6px); transform: translateX(-50%) translateY(2px); }
.xn-tt-bottom { top:    calc(100% + 6px); transform: translateX(-50%) translateY(-2px); }
.xn-tt-wrap:hover .xn-tt { opacity: 1; transform: translateX(-50%) translateY(0); }
:global(.dark) .xn-tt, :global(.darkTheme) .xn-tt {
  background: #2a333f;
  color: #f1f5f9;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
