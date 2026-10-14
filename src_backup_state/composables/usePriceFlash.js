import { ref, watch } from 'vue';
import { useNotifications } from '../stores/notifications.js';

// Tracks a numeric value and exposes a short-lived direction hint for flash animations
export function usePriceFlash(source, { duration = 400 } = {}) {
  const dir = ref(0); // +1 up, -1 down, 0 idle
  let prev = null;
  let timer = null;

  watch(source, (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return;
    if (prev !== null && n !== prev) {
      dir.value = n > prev ? 1 : -1;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { dir.value = 0; }, duration);
    }
    prev = n;
  }, { immediate: true });

  return { dir };
}

// Global toast emitter bridging directly with useNotifications store
export function pushToast({ title = '', body = '', kind = 'success', duration = 4000 } = {}) {
  const { notify } = useNotifications();
  const message = title ? (body ? `${title} · ${body}` : title) : body;
  notify({
    message,
    type: kind === 'warn' ? 'info' : kind,
    duration
  });
}
