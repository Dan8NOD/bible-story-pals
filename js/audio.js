// Narration and little synthesized sound effects (Web Audio).
// Narration plays recorded ElevenLabs clips from audio/ (made by tools/voices.mjs)
// and falls back to the device's own text-to-speech for any line without a clip.

import { store, langs } from './store.js';
import { clipId } from './phrases.js';

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
const LOCALES = { en: ['en-US', 'en-GB', 'en'], es: ['es-MX', 'es-US', 'es-419', 'es-ES', 'es'] };
const NICE = /(Samantha|Paulina|Monica|Mónica|Google|Siri|Natural|Enhanced|Premium)/i;
let voices = [];
let speakToken = 0;
const listeners = new Set();

function loadVoices() {
  if (synth) voices = synth.getVoices();
}
if (synth) {
  loadVoices();
  synth.addEventListener?.('voiceschanged', loadVoices);
}

function voiceFor(lang) {
  for (const loc of LOCALES[lang]) {
    const matches = voices.filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith(loc.toLowerCase()));
    if (matches.length) return matches.find((v) => NICE.test(v.name)) || matches[0];
  }
  return null;
}

export const onSpeaking = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
const emit = (on) => listeners.forEach((fn) => fn(on));

/* ---------------- recorded clips ---------------- */

let clips = { en: new Set(), es: new Set() };
const clipsReady = typeof fetch === 'undefined' ? Promise.resolve() : fetch('audio/manifest.json')
  .then((r) => (r.ok ? r.json() : null))
  .then((m) => { if (m) clips = { en: new Set(m.clips?.en || []), es: new Set(m.clips?.es || []) }; })
  .catch(() => { /* no recordings yet */ });

// One reusable element: once unlocked by a tap, iOS lets it play later clips too.
const player = typeof Audio !== 'undefined' ? new Audio() : null;
let stopClip = null;

function playClip(src, token) {
  return new Promise((resolve) => {
    if (token !== speakToken || !player) return resolve();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(t);
      player.onended = player.onerror = null;
      stopClip = null;
      resolve();
    };
    const t = setTimeout(finish, 20000);
    stopClip = () => { player.pause(); finish(); };
    player.onended = finish;
    player.onerror = finish;
    player.src = src;
    player.play().catch(finish);
  });
}

function sayOne(text, lang, token) {
  const id = clipId(text);
  if (clips[lang].has(id)) return playClip(`audio/${lang}/${id}.mp3`, token);
  if (!synth) return new Promise((r) => setTimeout(r, 350));
  return new Promise((resolve) => {
    if (token !== speakToken) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LOCALES[lang][0];
    const v = voiceFor(lang);
    if (v) u.voice = v;
    u.rate = 0.88;
    u.pitch = 1.1;
    let done = false;
    const finish = () => { if (!done) { done = true; clearTimeout(t); resolve(); } };
    // Some engines never fire `end` (or have no voices at all); never hang the game.
    const t = setTimeout(finish, 1200 + text.length * 95);
    u.onend = finish;
    u.onerror = finish;
    synth.speak(u);
  });
}

function silence() {
  if (synth) synth.cancel();
  if (stopClip) stopClip();
}

// Speak an { en, es } entry, or a list of them, in the chosen language(s):
// all English lines first, then all Spanish ones. Resolves when finished.
export async function speak(entries, { force = false } = {}) {
  const token = ++speakToken;
  silence();
  const list = [].concat(entries || []);
  if (!list.length) return;
  if (!store.get('narration') && !force) {
    await new Promise((r) => setTimeout(r, 350));
    return;
  }
  await clipsReady;
  if (token !== speakToken) return;
  emit(true);
  for (const lang of langs()) {
    for (const entry of list) {
      if (token !== speakToken) return;
      await sayOne(entry[lang], lang, token);
    }
  }
  if (token === speakToken) emit(false);
}

export function stopSpeaking() {
  speakToken++;
  silence();
  emit(false);
}

/* ---------------- sound effects ---------------- */

let ctx = null;
function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, { type = 'sine', vol = 0.25, to = null } = {}) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + start;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

function noise(start, dur, { vol = 0.2, from = 2000, to = 400 } = {}) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + start;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.setValueAtTime(from, t0);
  f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(c.destination);
  src.start(t0);
}

const NOTES = [523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319];

export const sfx = {
  pop() { tone(500, 0, 0.12, { to: 1100, vol: 0.3 }); },
  tap() { tone(700, 0, 0.07, { type: 'triangle', vol: 0.18 }); },
  count(n) { tone(NOTES[Math.min(n, NOTES.length - 1)], 0, 0.25, { type: 'triangle', vol: 0.3 }); },
  ding() { tone(880, 0, 0.18, { type: 'triangle' }); tone(1320, 0.1, 0.3, { type: 'triangle' }); },
  boing() { tone(330, 0, 0.3, { to: 160, vol: 0.22 }); },
  whoosh() { noise(0, 0.35, { from: 3000, to: 300, vol: 0.15 }); },
  splash() { noise(0, 0.5, { from: 1500, to: 200, vol: 0.25 }); },
  bump() { tone(140, 0, 0.18, { type: 'square', vol: 0.08, to: 90 }); },
  tada() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.35, { type: 'triangle', vol: 0.28 }));
    tone(1319, 0.5, 0.7, { type: 'triangle', vol: 0.25 });
  },
  page() { noise(0, 0.18, { from: 4000, to: 1500, vol: 0.06 }); },
};

// Wrap so muting is respected in one place.
for (const k of Object.keys(sfx)) {
  const fn = sfx[k];
  sfx[k] = (...a) => { if (store.get('sfx')) { try { fn(...a); } catch { /* audio blocked */ } } };
}

// Mobile browsers only allow audio after a user gesture: unlock both systems on first touch.
export function unlockAudio() {
  const unlock = () => {
    try { ac(); } catch { /* ignore */ }
    if (synth) {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      synth.speak(u);
    }
    if (player && !player.src) {
      // A tiny silent WAV, played inside the tap, unlocks the clip player on iOS.
      player.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
      player.play().catch(() => {});
    }
    window.removeEventListener('pointerdown', unlock, true);
  };
  window.addEventListener('pointerdown', unlock, true);
}
