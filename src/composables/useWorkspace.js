import { watch } from 'vue'

const KEY = 'xn:workspace'

export function loadWorkspace() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

export function persistWorkspace(state) {
  const payload = {}
  for (const [k, v] of Object.entries(state)) {
    payload[k] = v && typeof v === 'object' && 'value' in v ? v.value : v
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(payload))
  } catch (e) {}
}

export function resetWorkspace() {
  try {
    localStorage.removeItem(KEY)
  } catch (e) {}
}

export function useWorkspacePersistence(state, { immediate = true } = {}) {
  watch(
    () => Object.fromEntries(
      Object.entries(state).map(([k, v]) => [k, v && typeof v === 'object' && 'value' in v ? v.value : v])
    ),
    () => persistWorkspace(state),
    { deep: true, immediate }
  )
}
