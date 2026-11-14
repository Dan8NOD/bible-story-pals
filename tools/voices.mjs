// Records the game's narration with ElevenLabs into audio/<lang>/<id>.mp3 and
// lists the clips in audio/manifest.json. Lines that are already recorded are
// skipped, and it never spends more than --budget credits in one run.
//
//   export ELEVENLABS_API_KEY=...            (elevenlabs.io → Profile → API keys)
//   node tools/voices.mjs --dry-run          shows what it would record and the cost (needs no key)
//   node tools/voices.mjs --budget 499       records, up to 499 credits
//
// The voice for each language comes from audio/manifest.json once that language has clips,
// so a later run can't switch voices by accident. To choose a voice the first time:
//   node tools/voices.mjs --list-voices
//   export ELEVENLABS_VOICE_EN=...  ELEVENLABS_VOICE_ES=...  ELEVENLABS_VOICE_HE=...
//
// Options:
//   --langs en,es     which languages to record (default: every language that has a voice)
//   --model <id>      model for English and Spanish (default eleven_flash_v2_5: half the credits;
//                     eleven_multilingual_v2 sounds richer)
//   --model-he <id>   model for Hebrew (default eleven_v3; Flash and Multilingual v2 don't speak Hebrew)
//   --out <dir>       where the clips go (default audio/)
//   --prune           delete clips no line uses any more (after editing or removing stories); needs no key
//   --redo            re-record everything, e.g. after changing voices (with --dry-run, only shows the plan)

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
const OUT = opt('out', join(root, 'audio'));
const ALL = ['en', 'es', 'he'];

const die = (msg) => { console.error(msg); process.exit(1); };
// "--budget=10" would be skipped silently and leave the default cap: insist on a space.
const glued = args.find((a) => /^--[^=]+=/.test(a));
if (glued) die(`Write ${glued.replace('=', ' ')} (a space, not "=").`);
// The spending cap must be a real, positive number: a typo must never lift or ignore it.
const budgetArg = opt('budget', '499');
const BUDGET = /^\d+(\.\d+)?$/.test(budgetArg ?? '') ? Number(budgetArg) : NaN;
if (!(BUDGET > 0)) die(`--budget needs a positive number of credits, e.g. --budget 499 (got ${budgetArg ?? 'nothing'}).`);
const api = (path, init = {}) => fetch(`${API}${path}`, { ...init, headers: { 'xi-api-key': KEY, ...init.headers } });
const needKey = () => { if (!KEY) die('Set ELEVENLABS_API_KEY first (elevenlabs.io → Profile → API keys).'); };

const manifestPath = join(OUT, 'manifest.json');
const blank = () => ({ model: null, models: {}, voices: {}, clips: Object.fromEntries(ALL.map((l) => [l, []])) });
let manifest = blank();
try { manifest = { ...blank(), ...JSON.parse(await readFile(manifestPath, 'utf8')) }; } catch { /* first run */ }
for (const l of ALL) manifest.clips[l] ||= [];
manifest.models ||= {};
// Older manifests have one `model` for every language: pin it per language, so that redoing
// one language with a new model can't silently switch another language's model (and rate).
for (const l of ALL) if (manifest.clips[l].length && !manifest.models[l] && manifest.model) manifest.models[l] = manifest.model;
const save = () => writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
// The model a language's existing clips were made with (older manifests have one `model` for all).
const recordedWith = (l) => manifest.models[l] || (manifest.clips[l].length ? manifest.model : null);

/* ---------------- --prune: drop clips no line uses any more ---------------- */
if (flag('prune')) {
  const phrases = allPhrases();
  const pretend = flag('dry-run');
  let gone = 0;
  for (const l of ALL) {
    const used = new Set(phrases.map((p) => clipId(p[l])));
    for (const id of manifest.clips[l].filter((x) => !used.has(x))) {
      if (pretend) console.log(`  would remove ${l}/${id}.mp3`);
      else await rm(join(OUT, l, `${id}.mp3`), { force: true });
      gone++;
    }
    manifest.clips[l] = manifest.clips[l].filter((x) => used.has(x));
  }
  if (!pretend) await save();
  console.log(`${pretend ? 'Would remove' : 'Removed'} ${gone} unused clips. ${pretend ? 'Would keep' : 'Kept'} ${ALL.map((l) => `${manifest.clips[l].length} ${l}`).join(', ')}.`);
  process.exit(0);
}

if (flag('list-voices')) {
  needKey();
  const r = await api('/v1/voices');
  if (!r.ok) die(`Could not list voices: ${r.status} ${await r.text()}`);
  for (const v of (await r.json()).voices) {
    const l = v.labels || {};
    console.log(`${v.voice_id}  ${v.name}  ${[l.gender, l.age, l.accent, l.description].filter(Boolean).join(', ')}`);
  }
  process.exit(0);
}

/* ---------------- which languages, voices and models ---------------- */
const redo = flag('redo');
const envVoice = (l) => process.env[`ELEVENLABS_VOICE_${l.toUpperCase()}`] || (l === 'he' ? null : process.env.ELEVENLABS_VOICE);
// A language keeps the voice its clips already have unless the environment names one.
const VOICES = Object.fromEntries(ALL.map((l) => [l, envVoice(l) || (!redo && manifest.voices?.[l]) || null]));
const MODELS = Object.fromEntries(ALL.map((l) => [l,
  opt(`model-${l}`, l === 'he' ? null : opt('model', null)) || (!redo && recordedWith(l)) || (l === 'he' ? 'eleven_v3' : 'eleven_flash_v2_5')]));
// Credits per character. Flash and Turbo models cost half.
const rate = (l) => (/flash|turbo/.test(MODELS[l]) ? 0.5 : 1);

const asked = opt('langs', null)?.split(',').map((x) => x.trim()).filter(Boolean);
if (asked?.some((l) => !ALL.includes(l))) die(`--langs takes ${ALL.join(', ')}.`);
const LANGS = asked || ALL.filter((l) => VOICES[l]);
const dry = flag('dry-run');
if (!dry) {
  needKey();
  if (!LANGS.length) die('Set ELEVENLABS_VOICE_EN, ELEVENLABS_VOICE_ES or ELEVENLABS_VOICE_HE (run with --list-voices to see ids).');
  for (const l of LANGS) if (!VOICES[l]) die(`Set ELEVENLABS_VOICE_${l.toUpperCase()} (run with --list-voices to see ids).`);
}
if (dry && !LANGS.length) LANGS.push(...ALL);

if (redo) {
  // Start over, but only for the languages being recorded. This only plans in memory:
  // nothing is deleted or saved until the run is real and the models have checked out (below).
  for (const l of LANGS) {
    manifest.clips[l] = [];
    delete manifest.models[l];
  }
} else {
  for (const l of LANGS) {
    if (!manifest.clips[l].length) continue;
    const sameVoice = !VOICES[l] || manifest.voices?.[l] === VOICES[l];
    if (!sameVoice || recordedWith(l) !== MODELS[l]) {
      die(`The ${l} clips were recorded with a different voice or model. Use the same settings, or add --redo to re-record that language.`);
    }
  }
}

/* ---------------- plan: whole phrases in priority order, stopping at the budget ---------------- */
const have = Object.fromEntries(ALL.map((l) => [l, new Set(manifest.clips[l])]));
const cost = (j) => Math.ceil(j.text.length * rate(j.lang));
const plan = [];
let planned = 0;
let left = 0;
let leftCost = 0;
for (const phrase of allPhrases()) {
  const jobs = LANGS.filter((l) => !have[l].has(clipId(phrase[l]))).map((l) => ({ lang: l, text: phrase[l] }));
  if (!jobs.length) continue;
  const c = jobs.reduce((n, j) => n + cost(j), 0);
  if (left || planned + c > BUDGET) { left++; leftCost += c; continue; }
  planned += c;
  plan.push(...jobs);
}

console.log(`${LANGS.map((l) => `${l}: ${MODELS[l]}`).join(' · ')} · ${plan.length} clips · about ${planned} credits (budget ${BUDGET})` +
  (left ? ` · ${left} more lines (about ${leftCost} credits) left for a later run` : ' · this finishes every line'));
if (KEY) {
  try {
    const s = await api('/v1/user/subscription');
    if (s.ok) {
      const j = await s.json();
      console.log(`Account: ${j.character_limit - j.character_count} of ${j.character_limit} credits left this period.`);
    }
  } catch { /* informational only */ }
}
if (dry) {
  plan.forEach((j) => console.log(`  [${j.lang}] ${j.text}`));
  process.exit(0);
}

// Stop before spending anything if a model can't speak a language we're about to record in it.
try {
  const r = await api('/v1/models');
  if (r.ok) {
    const models = await r.json();
    for (const l of new Set(plan.map((j) => j.lang))) {
      const m = models.find((x) => x.model_id === MODELS[l]);
      if (!m) die(`ElevenLabs has no model called ${MODELS[l]}. Pick another with --model${l === 'he' ? '-he' : ''}.`);
      const speaks = (x) => (x.languages || []).some((g) => g.language_id === l);
      if (m.languages?.length && !speaks(m)) {
        die(`${MODELS[l]} doesn't speak "${l}". Models that do: ${models.filter(speaks).map((x) => x.model_id).join(', ') || 'none'}. Pick one with --model${l === 'he' ? '-he' : ''}.`);
      }
    }
  }
} catch { /* the recording call below reports any real problem */ }

if (redo) {
  // Now it is real: drop the old clips. The manifest goes first, so it never lists a missing file.
  await save();
  for (const l of LANGS) await rm(join(OUT, l), { recursive: true, force: true });
}
for (const l of LANGS) await mkdir(join(OUT, l), { recursive: true });
let spent = 0;
let estimated = 0;
for (const [i, j] of plan.entries()) {
  const id = clipId(j.text);
  const model = MODELS[j.lang];
  // Hard stop on what ElevenLabs actually charges: the plan above is only an estimate,
  // so scale the next clip's estimate by how far off the estimates have been so far.
  const est = cost(j);
  const ratio = estimated ? Math.max(1, spent / estimated) : 1;
  if (spent + est * ratio > BUDGET) {
    console.log(`Stopping before clip ${i + 1}/${plan.length} to stay within ${BUDGET} credits (spent ${spent}).`);
    break;
  }
  // Eleven v3 (Hebrew) only takes stability 0.0, 0.5 or 1.0; the others take any value.
  const body = { text: j.text, model_id: model, voice_settings: { stability: /v3/.test(model) ? 0.5 : 0.6, similarity_boost: 0.75, style: 0.2 } };
  if (/flash|turbo|v3/.test(model)) body.language_code = j.lang;
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
  manifest.models[j.lang] = model;
  manifest.voices = { ...manifest.voices, [j.lang]: VOICES[j.lang] };
  if (j.lang !== 'he') manifest.model = model;
  await save();
  spent += Number(r.headers.get('character-cost')) || est;
  estimated += est;
  console.log(`  ${i + 1}/${plan.length} [${j.lang}] ${j.text}`);
}
console.log(`Done. About ${spent} credits used. Bump VERSION in sw.js, then commit the audio/ folder.`);
