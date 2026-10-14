<template>
  <div class="w-11 bg-white dark:bg-[#070a10] border-r border-[#e3e6eb] dark:border-[#162032] flex flex-col items-center py-2 gap-0.5 shrink-0 transition-colors">
    <div class="xn-tool" :class="{ active: active === 'cursor' }" @click="active = 'cursor'" title="Cursor">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'trend' }" @click="active = 'trend'" title="Trend line">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20 20 4"/><circle cx="4" cy="20" r="1.5"/><circle cx="20" cy="4" r="1.5"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'h-line' }" @click="active = 'h-line'" title="Horizontal line">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 12h18"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'rect' }" @click="active = 'rect'" title="Rectangle">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="5" width="16" height="14" rx="1"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'brush' }" @click="active = 'brush'" title="Brush">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20c2-2 4-3 4-6 0-2 2-4 4-4"/><path d="m14 4 6 6-9 9H5v-6z"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'text' }" @click="active = 'text'" title="Text">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 7V5h14v2M12 5v14M9 19h6"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'fib' }" @click="active = 'fib'" title="Fibonacci">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5h16M4 10h16M4 15h16M4 20h16"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'measure' }" @click="active = 'measure'" title="Measure">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 9 9 3l12 12-6 6z"/><path d="m7 7 2 2M10 4l2 2M13 7l2 2M16 10l2 2"/></svg>
    </div>
    <div class="flex-1"></div>
    <div class="xn-tool" :class="{ active: active === 'smile' }" @click="active = 'smile'" title="Notes">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'zoom-in' }" @click="active = 'zoom-in'" title="Zoom in">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/></svg>
    </div>
    <div class="xn-tool" :class="{ active: active === 'trash' }" @click="active = 'trash'" title="Clear">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const active = ref('cursor')
</script>
