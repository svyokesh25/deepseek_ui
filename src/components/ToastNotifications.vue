<template>
  <div class="absolute bottom-2.5 left-2.5 z-40 flex flex-col-reverse pointer-events-none select-none font-sans">
    <TransitionGroup name="toast">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="pointer-events-auto flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-[4px] shadow-lg text-white min-w-[275px] max-w-[380px] border border-black/10 transition-all duration-200"
        :class="getToastClass(n.type)"
      >
        <!-- Left Checkmark Icon Badge matching reference screenshot -->
        <div class="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center shrink-0">
          <svg class="w-2.5 h-2.5 text-white stroke-[3.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <!-- Notification Message -->
        <span class="text-[12px] font-bold text-white tracking-tight flex-1 truncate">
          {{ n.message }}
        </span>

        <!-- Close / Dismiss (✕) -->
        <button
          type="button"
          class="text-white/80 hover:text-white cursor-pointer text-xs font-bold p-0.5 transition-colors leading-none ml-1.5 shrink-0"
          title="Dismiss"
          @click="removeNotification(n.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useNotifications } from '../stores/notifications.js';

const { notifications, removeNotification } = useNotifications();

function getToastClass(type) {
  switch (type) {
    case 'error':
      return 'bg-[#bd362f]'; // Toastr error red
    case 'warning':
      return 'bg-[#f89406]'; // Toastr warning orange
    case 'info':
      return 'bg-[#2f96b4]'; // Toastr info blue
    case 'success':
    default:
      return 'bg-[#51a351]'; // Exact toastr success green from screenshot
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
</style>
