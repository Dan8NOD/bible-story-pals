// Tiny persistent settings + progress. Storage can be blocked (private mode,
// some kid-tablet profiles), so every access is guarded and we fall back to memory.

const KEY = 'bsp:v1';

function defaults() {
  const nav = (typeof navigator !== 'undefined' && navigator.language) || 'en';
  return { lang: nav.toLowerCase().startsWith('es') ? 'es' : 'en', narration: true, sfx: true, stars: {} };
}

let state = defaults();
try {
  const raw = localStorage.getItem(KEY);
  if (raw) state = { ...state, ...JSON.parse(raw) };
} catch { /* storage unavailable */ }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export const store = {
  get: (k) => state[k],
  set(k, v) { state[k] = v; save(); },
  hasStar: (id) => !!state.stars[id],
  giveStar(id) { state.stars = { ...state.stars, [id]: true }; save(); },
  starCount: () => Object.keys(state.stars).length,
  reset() { state = { ...state, stars: {} }; save(); },
};

// Which languages to show/speak for the current setting: 'en', 'es' or 'both'.
export const langs = () => (state.lang === 'both' ? ['en', 'es'] : [state.lang]);
