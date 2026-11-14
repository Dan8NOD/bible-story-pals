// Runs tools/voices.mjs against a fake ElevenLabs server: checks the budget is
// respected, clips land where the game looks for them, and re-runs skip them.
// Then loads the game and checks it plays a recorded clip instead of the device voice.
// Run: node tests/voices.test.mjs
import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, mkdir, readFile, readdir, rm, cp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { allPhrases, clipId } from '../js/phrases.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const run = promisify(execFile);
const calls = [];
// When set, the fake charges this many times the estimate in the character-cost header.
let charge = 0;
const fake = createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    if (req.headers['xi-api-key'] !== 'test-key') { res.writeHead(401); return res.end('bad key'); }
    if (req.url.startsWith('/v1/text-to-speech/')) {
      const call = { voice: req.url.split('/')[3].split('?')[0], ...JSON.parse(body) };
      calls.push(call);
      const headers = { 'content-type': 'audio/mpeg' };
      if (charge) headers['character-cost'] = String(Math.ceil(call.text.length * (/flash/.test(call.model_id) ? 0.5 : 1)) * charge);
      res.writeHead(200, headers);
      return res.end(Buffer.from('ID3fake-mp3'));
    }
    if (req.url === '/v1/models') {
      const speaks = (...ids) => ids.map((language_id) => ({ language_id }));
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify([
        { model_id: 'eleven_flash_v2_5', languages: speaks('en', 'es') },
        { model_id: 'eleven_multilingual_v2', languages: speaks('en', 'es') },
        { model_id: 'eleven_v3', languages: speaks('en', 'es', 'he') },
      ]));
    }
    if (req.url === '/v1/user/subscription') {
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ character_count: 100, character_limit: 10000 }));
    }
    res.writeHead(404); res.end();
  });
}).listen(0);

const out = await mkdtemp(join(tmpdir(), 'tsp-voices-'));
// The developer's own voice settings must not leak in: every voice is named here.
const env = { ...process.env, ELEVENLABS_API_KEY: 'test-key', ELEVENLABS_VOICE: '', ELEVENLABS_VOICE_HE: '', ELEVENLABS_VOICE_EN: 'voiceEN', ELEVENLABS_VOICE_ES: 'voiceES', ELEVENLABS_BASE_URL: `http://localhost:${fake.address().port}` };
const voices = (...a) => run('node', [join(root, 'tools/voices.mjs'), '--out', out, ...a], { env });
// A snapshot of an output folder: the manifest text and every clip file, to prove a run changed nothing.
const snapshot = async (dir) => {
  const files = {};
  for (const l of ['en', 'es', 'he']) files[l] = (await readdir(join(dir, l)).catch(() => [])).sort();
  return { manifest: await readFile(join(dir, 'manifest.json'), 'utf8'), files };
};

// 0. A mistyped budget is refused before anything is spent, never treated as "no cap" or the default.
for (const bad of [['--budget', 'abc'], ['--budget', '-5'], ['--budget', '0'], ['--budget', ''], ['--budget', 'Infinity'], ['--budget'], ['--budget=10'], ['--budget', '--dry-run']]) {
  await assert.rejects(voices(...bad), /budget|space/, `${bad.join(' ')} must be refused`);
}
assert.equal(calls.length, 0, 'a refused budget must not record anything');

// 1. Budget: never more credits than allowed, whole phrases only, in priority order.
await voices('--budget', '499');
// Default model is Flash: half a credit per character.
const credits = calls.reduce((n, c) => n + Math.ceil(c.text.length * 0.5), 0);
assert.ok(calls.every((c) => c.model_id === 'eleven_flash_v2_5' && c.language_code));
assert.ok(calls.every((c) => c.voice_settings.stability === 0.6));
assert.ok(credits <= 499, `spent ${credits} > 499`);
assert.ok(calls.length >= 2 && calls.length % 2 === 0, 'records whole en+es pairs');
const first = allPhrases()[0];
assert.deepEqual(calls.slice(0, 2).map((c) => [c.voice, c.text]), [['voiceEN', first.en], ['voiceES', first.es]]);
const manifest = JSON.parse(await readFile(join(out, 'manifest.json'), 'utf8'));
assert.ok(manifest.clips.en.includes(clipId(first.en)) && manifest.clips.es.includes(clipId(first.es)));
assert.equal((await readdir(join(out, 'en'))).length, manifest.clips.en.length);

// 2. Re-running continues where it left off instead of re-buying clips.
const before = calls.length;
await voices('--budget', '499');
const second = calls.slice(before).map((c) => c.text);
assert.ok(second.length > 0 && !second.some((t) => calls.slice(0, before).some((c) => c.text === t)), 'second run only records new lines');

// 3. A different voice is refused unless --redo.
await assert.rejects(run('node', [join(root, 'tools/voices.mjs'), '--out', out], { env: { ...env, ELEVENLABS_VOICE_EN: 'other' } }));

// 4. Dry run spends nothing, and needs no key.
const n = calls.length;
await voices('--dry-run', '--budget', '100000');
const { ELEVENLABS_API_KEY: _key, ...noKey } = env;
const dry = await run('node', [join(root, 'tools/voices.mjs'), '--out', out, '--dry-run', '--langs', 'en,es,he', '--budget', '100000'], { env: noKey });
assert.match(dry.stdout, /he: eleven_v3/);
assert.equal(calls.length, n);

// 5. Hebrew has its own voice and model (Eleven v3, a credit a character), and --langs records it alone.
//    The English and Spanish voices come from the manifest, so only Hebrew's needs naming.
const heEnv = { ...noKey, ELEVENLABS_API_KEY: 'test-key', ELEVENLABS_VOICE_EN: '', ELEVENLABS_VOICE_ES: '', ELEVENLABS_VOICE_HE: 'voiceHE' };
await assert.rejects(run('node', [join(root, 'tools/voices.mjs'), '--out', out, '--langs', 'he', '--model-he', 'eleven_flash_v2_5'], { env: heEnv }), /doesn't speak "he"/);
assert.equal(calls.length, n, 'a model that cannot speak Hebrew must not be charged');
await run('node', [join(root, 'tools/voices.mjs'), '--out', out, '--langs', 'he', '--budget', '300'], { env: heEnv });
const he = calls.slice(n);
assert.ok(he.length > 0 && he.every((c) => c.voice === 'voiceHE' && c.model_id === 'eleven_v3' && c.language_code === 'he'));
assert.ok(he.reduce((sum, c) => sum + c.text.length, 0) <= 300, 'Hebrew costs a credit a character');
assert.equal(he[0].text, first.he);
// Eleven v3 accepts only stability 0.0, 0.5 or 1.0.
assert.ok(he.every((c) => c.voice_settings.stability === 0.5), 'Hebrew (v3) stability must be 0.5');
const after = JSON.parse(await readFile(join(out, 'manifest.json'), 'utf8'));
assert.equal(after.models.he, 'eleven_v3');
assert.equal(after.voices.en, 'voiceEN');
assert.ok(after.clips.he.includes(clipId(first.he)));

// 6. --prune removes clips no line uses any more, and nothing else.
after.clips.en.push('0stale0');
await writeFile(join(out, 'manifest.json'), JSON.stringify(after));
await writeFile(join(out, 'en', '0stale0.mp3'), 'old');
await run('node', [join(root, 'tools/voices.mjs'), '--out', out, '--prune'], { env: noKey });
const pruned = JSON.parse(await readFile(join(out, 'manifest.json'), 'utf8'));
assert.ok(!pruned.clips.en.includes('0stale0') && !(await readdir(join(out, 'en'))).includes('0stale0.mp3'));
assert.equal(pruned.clips.en.length, after.clips.en.length - 1);
assert.equal(pruned.clips.he.length, after.clips.he.length);

// 6b. --prune --dry-run only reports.
pruned.clips.en.push('0stale1');
await writeFile(join(out, 'manifest.json'), JSON.stringify(pruned));
await writeFile(join(out, 'en', '0stale1.mp3'), 'old');
const beforePruneDry = await snapshot(out);
const pruneDry = await run('node', [join(root, 'tools/voices.mjs'), '--out', out, '--prune', '--dry-run'], { env: noKey });
assert.match(pruneDry.stdout, /Would remove 1 unused clips/);
assert.deepEqual(await snapshot(out), beforePruneDry, '--prune --dry-run must not delete or save');
await run('node', [join(root, 'tools/voices.mjs'), '--out', out, '--prune'], { env: noKey });

// 7. --redo with --dry-run plans a full re-record but deletes and saves nothing.
const beforeRedo = await snapshot(out);
const redoDry = await voices('--redo', '--dry-run', '--langs', 'en', '--budget', '100000');
assert.match(redoDry.stdout, /this finishes every line/);
assert.deepEqual(await snapshot(out), beforeRedo, '--redo --dry-run must not touch clips or the manifest');

// 8. --redo with a model that can't speak the language stops before deleting anything.
const m = calls.length;
await assert.rejects(run('node', [join(root, 'tools/voices.mjs'), '--out', out, '--redo', '--langs', 'he', '--model-he', 'eleven_flash_v2_5'], { env: heEnv }), /doesn't speak "he"/);
assert.equal(calls.length, m);
assert.deepEqual(await snapshot(out), beforeRedo, 'a refused --redo must not touch clips or the manifest');

// 9. An older manifest (one `model` for all languages): redoing English with a new model
//    keeps Spanish on the model its clips were made with.
const legacy = await mkdtemp(join(tmpdir(), 'tsp-legacy-'));
const legacyRun = (...a) => run('node', [join(root, 'tools/voices.mjs'), '--out', legacy, ...a], { env });
for (const l of ['en', 'es']) {
  await mkdir(join(legacy, l), { recursive: true });
  await writeFile(join(legacy, l, `${clipId(first[l])}.mp3`), 'old');
}
await writeFile(join(legacy, 'manifest.json'), JSON.stringify({
  model: 'eleven_flash_v2_5', voices: { en: 'voiceEN', es: 'voiceES' },
  clips: { en: [clipId(first.en)], es: [clipId(first.es)], he: [] },
}));
const k = calls.length;
await legacyRun('--redo', '--langs', 'en', '--model', 'eleven_multilingual_v2', '--budget', '200');
const redone = calls.slice(k);
assert.ok(redone.length > 0 && redone.every((c) => c.model_id === 'eleven_multilingual_v2' && c.voice === 'voiceEN'));
assert.equal(redone[0].text, first.en, '--redo re-records the first line too');
let lm = JSON.parse(await readFile(join(legacy, 'manifest.json'), 'utf8'));
assert.equal(lm.models.en, 'eleven_multilingual_v2');
assert.equal(lm.models.es, 'eleven_flash_v2_5', 'Spanish keeps its recorded model');
assert.deepEqual(lm.clips.es, [clipId(first.es)]);
assert.deepEqual(await readdir(join(legacy, 'es')), [`${clipId(first.es)}.mp3`], 'Spanish clips are untouched');
assert.equal((await readFile(join(legacy, 'en', `${clipId(first.en)}.mp3`), 'utf8')).startsWith('ID3'), true, 'the old English clip was replaced');
const k2 = calls.length;
await legacyRun('--langs', 'es', '--budget', '60');
assert.ok(calls.slice(k2).length > 0 && calls.slice(k2).every((c) => c.model_id === 'eleven_flash_v2_5'), 'Spanish goes on with Flash');
await rm(legacy, { recursive: true, force: true });

// 10. The budget holds against what ElevenLabs actually charges (the character-cost header),
//     even when that is far above the estimate.
const charged = await mkdtemp(join(tmpdir(), 'tsp-charged-'));
charge = 3;
const c0 = calls.length;
const chargedRun = await run('node', [join(root, 'tools/voices.mjs'), '--out', charged, '--budget', '200'], { env });
charge = 0;
const paid = calls.slice(c0).reduce((sum, c) => sum + Math.ceil(c.text.length * 0.5) * 3, 0);
assert.ok(calls.length > c0, 'records something');
assert.ok(paid <= 200, `charged ${paid} > 200`);
assert.match(chargedRun.stdout, /Stopping before clip/);
await rm(charged, { recursive: true, force: true });

fake.close();
console.log(`✓ voices script: ${before} clips for ${credits} credits on a 499 budget; budget typos, resume, voice-change guard, dry run, Hebrew, prune, redo, legacy models and real charges OK`);

// 5. The game plays the recorded clip for page 1 of the first story.
const site = await mkdtemp(join(tmpdir(), 'tsp-site-'));
await cp(root, site, { recursive: true, filter: (p) => !p.includes('node_modules') && !p.endsWith('/audio') });
await cp(out, join(site, 'audio'), { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const web = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(join(site, p)); res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
}).listen(0);
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
const audioReqs = [];
page.on('request', (r) => { if (r.url().includes('/audio/en/')) audioReqs.push(r.url()); });
await page.goto(`http://localhost:${web.address().port}/#/`);
await page.click('.chip[data-lang=en]');
await page.click('.stop[data-id=creation]');
await page.waitForTimeout(800);
assert.ok(audioReqs.some((u) => u.endsWith(`/audio/en/${clipId(first.en)}.mp3`)), `expected clip request, got ${audioReqs}`);
await browser.close();
web.close();
await rm(out, { recursive: true, force: true });
await rm(site, { recursive: true, force: true });
console.log('✓ game plays the recorded clip');
