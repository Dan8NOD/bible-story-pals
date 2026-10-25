// Records the game's narration with ElevenLabs into audio/<lang>/<id>.mp3 and
// lists the clips in audio/manifest.json. Lines that are already recorded are
// skipped, and it never spends more than --budget credits in one run.
//
//   export ELEVENLABS_API_KEY=...            (elevenlabs.io → Profile → API keys)
//   node tools/voices.mjs --list-voices      pick a voice id for each language
//   export ELEVENLABS_VOICE_EN=...  ELEVENLABS_VOICE_ES=...
//   node tools/voices.mjs --dry-run          shows what it would record and the cost
//   node tools/voices.mjs --budget 499       records, up to 499 credits
//
// Options: --model <id> (default eleven_flash_v2_5: half the credits; eleven_multilingual_v2
// sounds richer), --out <dir>,
// --redo (re-record everything, e.g. after changing voices).

import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allPhrases, clipId } from '../js/phrases.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const flag = (name) => args.includes(`--${name}`);

const API = process.env.ELEVENLABS_BASE_URL || 'https://api.elevenlabs.io';
const KEY = process.env.ELEVENLABS_API_KEY;
const MODEL = opt('model', 'eleven_flash_v2_5');
const BUDGET = Number(opt('budget', 499));
const OUT = opt('out', join(root, 'audio'));
const VOICES = {
  en: process.env.ELEVENLABS_VOICE_EN || process.env.ELEVENLABS_VOICE,
  es: process.env.ELEVENLABS_VOICE_ES || process.env.ELEVENLABS_VOICE,
};
// Credits per character. Flash and Turbo models cost half.
const RATE = /flash|turbo/.test(MODEL) ? 0.5 : 1;
const LANGS = ['en', 'es'];

const die = (msg) => { console.error(msg); process.exit(1); };
const api = (path, init = {}) => fetch(`${API}${path}`, { ...init, headers: { 'xi-api-key': KEY, ...init.headers } });

if (!KEY) die('Set ELEVENLABS_API_KEY first (elevenlabs.io → Profile → API keys).');

if (flag('list-voices')) {
  const r = await api('/v1/voices');
  if (!r.ok) die(`Could not list voices: ${r.status} ${await r.text()}`);
  for (const v of (await r.json()).voices) {
    const l = v.labels || {};
    console.log(`${v.voice_id}  ${v.name}  ${[l.gender, l.age, l.accent, l.description].filter(Boolean).join(', ')}`);
  }
  process.exit(0);
}

for (const l of LANGS) if (!VOICES[l]) die(`Set ELEVENLABS_VOICE_${l.toUpperCase()} (run with --list-voices to see ids).`);

const manifestPath = join(OUT, 'manifest.json');
let manifest = { model: MODEL, voices: VOICES, clips: { en: [], es: [] } };
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); } catch { /* first run */ }

const sameSetup = manifest.model === MODEL && LANGS.every((l) => manifest.voices?.[l] === VOICES[l]);
if (flag('redo')) {
  await rm(OUT, { recursive: true, force: true });
  manifest = { model: MODEL, voices: VOICES, clips: { en: [], es: [] } };
} else if (!sameSetup && (manifest.clips.en.length || manifest.clips.es.length)) {
  die('These clips were recorded with a different voice or model. Use the same settings, or add --redo to re-record everything.');
}

// Plan: whole phrases (both languages) in priority order, stopping at the budget.
const have = { en: new Set(manifest.clips.en), es: new Set(manifest.clips.es) };
const plan = [];
let cost = 0;
let left = 0;
for (const phrase of allPhrases()) {
  const jobs = LANGS.filter((l) => !have[l].has(clipId(phrase[l]))).map((l) => ({ lang: l, text: phrase[l] }));
  if (!jobs.length) continue;
  const c = jobs.reduce((n, j) => n + Math.ceil(j.text.length * RATE), 0);
  if (left || cost + c > BUDGET) { left++; continue; }
  cost += c;
  plan.push(...jobs);
}

console.log(`Model ${MODEL} · ${plan.length} clips · about ${cost} credits (budget ${BUDGET})` +
  (left ? ` · ${left} more lines left for a later run` : ' · this finishes every line'));
try {
  const s = await api('/v1/user/subscription');
  if (s.ok) {
    const j = await s.json();
    console.log(`Account: ${j.character_limit - j.character_count} of ${j.character_limit} credits left this period.`);
  }
} catch { /* informational only */ }
if (flag('dry-run')) {
  plan.forEach((j) => console.log(`  [${j.lang}] ${j.text}`));
  process.exit(0);
}

const save = () => writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
for (const l of LANGS) await mkdir(join(OUT, l), { recursive: true });
let spent = 0;
for (const [i, j] of plan.entries()) {
  const id = clipId(j.text);
  const body = { text: j.text, model_id: MODEL, voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.35 } };
  if (/flash|turbo/.test(MODEL)) body.language_code = j.lang;
  const r = await api(`/v1/text-to-speech/${VOICES[j.lang]}?output_format=mp3_44100_64`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    await save();
    die(`Stopped at clip ${i + 1}/${plan.length}: ${r.status} ${await r.text()}\nEverything recorded so far is saved; run again to continue.`);
  }
  await writeFile(join(OUT, j.lang, `${id}.mp3`), Buffer.from(await r.arrayBuffer()));
  manifest.clips[j.lang].push(id);
  manifest.model = MODEL;
  manifest.voices = VOICES;
  await save();
  spent += Number(r.headers.get('character-cost')) || Math.ceil(j.text.length * RATE);
  console.log(`  ${i + 1}/${plan.length} [${j.lang}] ${j.text}`);
}
console.log(`Done. About ${spent} credits used. Bump VERSION in sw.js, then commit the audio/ folder.`);
