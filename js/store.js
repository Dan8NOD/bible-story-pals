// Tiny persistent settings + progress. Storage can be blocked (private mode,
// some kid-tablet profiles), so every access is guarded and we fall back to memory.

const KEY = 'tsp:v1';

// Every language the game can show and speak, in the order they are shown.
export const LANGS = ['en', 'es', 'he'];

function defaults() {
  const nav = ((typeof navigator !== 'undefined' && navigator.language) || 'en').toLowerCase();
  // "iw" is the old code some Android devices still report for Hebrew.
  const lang = nav.startsWith('es') ? 'es' : (nav.startsWith('he') || nav.startsWith('iw')) ? 'he' : 'en';
  // world: the map on screen. owned: App Store products bought, as last reported (see unlocks.js).
  return { lang, narration: true, sfx: true, stars: {}, world: 'torah', owned: [] };
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

// `lang` holds one language ('he') or two joined by a plus ('en+he'), in the order they were picked.
const picked = () => String(state.lang || '').split('+').filter((l, i, a) => LANGS.includes(l) && a.indexOf(l) === i);

// Which languages to show and speak: one or two of them, always in LANGS order.
export const langs = () => {
  const on = picked();
  const list = LANGS.filter((l) => on.includes(l)).slice(0, 2);
  return list.length ? list : ['en'];
};

// Turns a language on or off. One always stays on, and at most two are on at once:
// picking a third drops the one that was picked first.
export function toggleLang(l) {
  if (!LANGS.includes(l)) return;
  let on = picked();
  if (on.includes(l)) {
    if (on.length > 1) on = on.filter((x) => x !== l);
  } else {
    on = [...on, l].slice(-2);
  }
  store.set('lang', on.join('+') || 'en');
}
