// Every line the game can say aloud, plus the id each recorded clip is saved
// under. tools/voices.mjs records these; audio.js plays them.

import { STORIES } from './stories.js';
import { UI, PRAISE, countWord } from './i18n.js';

// Clips are named by a hash of their exact text, so editing a line simply
// makes it fall back to the device voice until it is recorded again.
export function clipId(text) {
  let h = 0x811c9dc5;
  for (const ch of String(text).trim()) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).padStart(7, '0');
}

// { en, es } entries in recording priority: whole stories first (so a small
// budget still gives one fully voiced story), then lines every game shares.
export function allPhrases() {
  const seen = new Set();
  const out = [];
  const add = (e) => {
    if (!e?.en || !e?.es) return;
    const key = `${e.en}\u0000${e.es}`;
    if (!seen.has(key)) { seen.add(key); out.push(e); }
  };
  const story = (s) => {
    s.pages.forEach((p) => add(p.text));
    add(s.game.prompt);
    (s.game.items || []).forEach((it) => add(it.word));
    (s.game.rounds || []).forEach((r) => add(r.say));
    add(s.lesson);
  };
  const shared = () => {
    PRAISE.forEach(add);
    for (let n = 1; n <= 10; n++) add(countWord(n));
    add(UI.tryAgain);
    add(UI.welcome);
  };
  story(STORIES[0]);
  shared();
  STORIES.slice(1).forEach(story);
  return out;
}
