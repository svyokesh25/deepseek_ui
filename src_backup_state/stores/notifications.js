// Reactive Toast / Notification store
import { ref } from 'vue';

const notifications = ref([]);
let nextId = 1;

export function useNotifications() {
  function notify({ message, type = 'success', duration = 4500 }) {
    const id = nextId++;
    const item = { id, message, type };
    notifications.value.push(item);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    return id;
  }

  function removeNotification(id) {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }

  function notifyOrder(side, symbol, lot, price, digits) {
    const formattedLot = typeof lot === 'number' ? lot.toFixed(2) : lot;
    const dg = digits != null ? digits : 2;
    const formattedPrice = typeof price === 'number' ? price.toFixed(dg) : price;
    return notify({
      message: `${side} for X:${symbol}, ${formattedLot} Lots at ${formattedPrice}`,
      type: 'success',
      duration: 4500
    });
  }

  function notifyClose(id, symbol) {
    return notify({
      message: `Closed position #${id} for ${symbol}`,
      type: 'info',
      duration: 3500
    });
  }

  return {
    notifications,
    notify,
    notifyOrder,
    notifyClose,
    removeNotification
  };
}
