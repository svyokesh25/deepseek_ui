import { ref, watch } from 'vue';

const STORAGE_KEY = 'xn:theme';
const initialTheme = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) || 'light';
export const theme = ref(initialTheme);
export const isDark = ref(initialTheme === 'dark');

function apply() {
  const dark = theme.value === 'dark';
  isDark.value = dark;
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme.value);
    root.classList.toggle('dark', dark);
    root.classList.toggle('light', !dark);
    // Also toggle on body for XtremeNext compatibility
    document.body?.classList.toggle('darkTheme', dark);
    document.body?.classList.toggle('lightTheme', !dark);
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, theme.value);
  }
}

apply();
watch(theme, apply);

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  }
  function setTheme(next) {
    if (next === 'light' || next === 'dark') {
      theme.value = next;
    }
  }
  function setDark(val) {
    theme.value = val ? 'dark' : 'light';
  }
  return { theme, isDark, toggle, setTheme, setDark };
}
