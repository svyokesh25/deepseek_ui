import { ref } from 'vue';

export const activeTool = ref('cursor');
export const activeSubtools = ref({
  cursors: 'cursor',
  trend: 'trend',
  fib: 'fib-retracement',
  shapes: 'rectangle',
  annotation: 'text',
  patterns: 'head-shoulders',
  prediction: 'long-pos',
  stickers: 'smile'
});

export const magnetMode = ref(false); // false | 'weak' | 'strong'
export const stayInDrawingMode = ref(false);
export const drawingsLocked = ref(false);
export const drawingsHidden = ref(false);
export const showFavoritesBar = ref(false);

export const favoriteTools = ref([
  'trend',
  'h-line',
  'rectangle',
  'fib-retracement',
  'long-pos',
  'short-pos',
  'brush'
]);

export const drawings = ref([
  // Sample initial drawings for visual richness
  {
    id: 'demo-trend-1',
    type: 'trend',
    symbol: 'XAUUSD',
    x1: 220, y1: 280,
    x2: 480, y2: 170,
    color: '#0072fd',
    width: 2
  },
  {
    id: 'demo-rect-1',
    type: 'rectangle',
    symbol: 'XAUUSD',
    x1: 320, y1: 140,
    x2: 560, y2: 195,
    color: '#089981',
    fill: 'rgba(8, 153, 129, 0.12)'
  }
]);

export const replayActive = ref(false);
export const replayIndex = ref(0);
export const replayPlaying = ref(false);
export const replaySpeed = ref(1);

export function setActiveTool(toolId, groupId) {
  activeTool.value = toolId;
  if (groupId && activeSubtools.value[groupId]) {
    activeSubtools.value[groupId] = toolId;
  }
}

export function toggleFavorite(toolId) {
  const idx = favoriteTools.value.indexOf(toolId);
  if (idx >= 0) {
    favoriteTools.value.splice(idx, 1);
  } else {
    favoriteTools.value.push(toolId);
  }
}

export function isFavorite(toolId) {
  return favoriteTools.value.includes(toolId);
}

export function addDrawing(item) {
  if (drawingsLocked.value) return;
  drawings.value.push({
    id: 'draw-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    ...item
  });
}

export function removeDrawing(id) {
  if (drawingsLocked.value) return;
  drawings.value = drawings.value.filter(d => d.id !== id);
}

export function clearDrawings(scope = 'drawings') {
  if (drawingsLocked.value) return;
  if (scope === 'drawings' || scope === 'all') {
    drawings.value = [];
  }
}

export function toggleHideDrawings() {
  drawingsHidden.value = !drawingsHidden.value;
}

export function toggleLockDrawings() {
  drawingsLocked.value = !drawingsLocked.value;
}
