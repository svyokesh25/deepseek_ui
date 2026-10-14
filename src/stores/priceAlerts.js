// Price Alerts Store — reactive store for smart price alerts
import { ref, computed } from 'vue';
import { playAlertSound } from '../utils/soundFx.js';
import { useNotifications } from './notifications.js';

const alerts = ref((() => {
  try {
    const raw = localStorage.getItem('xn_price_alerts');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
})());

let nextAlertId = alerts.value.length ? Math.max(...alerts.value.map(a => a.id)) + 1 : 1;

function persist() {
  try { localStorage.setItem('xn_price_alerts', JSON.stringify(alerts.value)); } catch {}
}

export function usePriceAlerts() {
  function addAlert({ symbol, price, condition = 'crosses', note = '' }) {
    const id = nextAlertId++;
    alerts.value.push({
      id,
      symbol,
      price: +price,
      condition, // 'crosses', 'above', 'below'
      note,
      triggered: false,
      createdAt: new Date().toISOString()
    });
    persist();
    return id;
  }

  function removeAlert(id) {
    alerts.value = alerts.value.filter(a => a.id !== id);
    persist();
  }

  function clearTriggered() {
    alerts.value = alerts.value.filter(a => !a.triggered);
    persist();
  }

  function checkAlerts(symbol, currentPrice) {
    const { notify } = useNotifications();
    alerts.value.forEach(alert => {
      if (alert.triggered || alert.symbol !== symbol) return;

      let shouldTrigger = false;
      if (alert.condition === 'above' && currentPrice >= alert.price) shouldTrigger = true;
      if (alert.condition === 'below' && currentPrice <= alert.price) shouldTrigger = true;
      if (alert.condition === 'crosses') {
        // Check if price crosses the alert level (simplified)
        if (Math.abs(currentPrice - alert.price) / alert.price < 0.0002) shouldTrigger = true;
      }

      if (shouldTrigger) {
        alert.triggered = true;
        playAlertSound();
        notify({
          message: `🔔 Alert! ${symbol} hit ${alert.price.toFixed(5)} (${alert.condition})`,
          type: 'warning',
          duration: 8000
        });
        persist();
      }
    });
  }

  const activeAlerts = computed(() => alerts.value.filter(a => !a.triggered));
  const triggeredAlerts = computed(() => alerts.value.filter(a => a.triggered));

  return {
    alerts,
    activeAlerts,
    triggeredAlerts,
    addAlert,
    removeAlert,
    clearTriggered,
    checkAlerts
  };
}
