// Runs tools/voices.mjs against a fake ElevenLabs server: checks the budget is
// respected, clips land where the game looks for them, and re-runs skip them.
// Then loads the game and checks it plays a recorded clip instead of the device voice.
// Run: node tests/voices.test.mjs
import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, readdir, rm, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { allPhrases, clipId } from '../js/phrases.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const run = promisify(execFile);
const calls = [];
const fake = createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    if (req.headers['xi-api-key'] !== 'test-key') { res.writeHead(401); return res.end('bad key'); }
    if (req.url.startsWith('/v1/text-to-speech/')) {
      calls.push({ voice: req.url.split('/')[3].split('?')[0], ...JSON.parse(body) });
      res.writeHead(200, { 'content-type': 'audio/mpeg' });
      return res.end(Buffer.from('ID3fake-mp3'));
    }
    if (req.url === '/v1/user/subscription') {
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ character_count: 100, character_limit: 10000 }));
    }
    res.writeHead(404); res.end();
  });
}).listen(0);

const out = await mkdtemp(join(tmpdir(), 'bsp-voices-'));
const env = { ...process.env, ELEVENLABS_API_KEY: 'test-key', ELEVENLABS_VOICE_EN: 'voiceEN', ELEVENLABS_VOICE_ES: 'voiceES', ELEVENLABS_BASE_URL: `http://localhost:${fake.address().port}` };
const voices = (...a) => run('node', [join(root, 'tools/voices.mjs'), '--out', out, ...a], { env });

// 1. Budget: never more credits than allowed, whole phrases only, in priority order.
await voices('--budget', '499');
// Default model is Flash: half a credit per character.
const credits = calls.reduce((n, c) => n + Math.ceil(c.text.length * 0.5), 0);
assert.ok(calls.every((c) => c.model_id === 'eleven_flash_v2_5' && c.language_code));
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

// 4. Dry run spends nothing.
const n = calls.length;
await voices('--dry-run', '--budget', '100000');
assert.equal(calls.length, n);
fake.close();
console.log(`✓ voices script: ${before} clips for ${credits} credits on a 499 budget; resume, voice-change guard and dry run OK`);

// 5. The game plays the recorded clip for page 1 of the first story.
const site = await mkdtemp(join(tmpdir(), 'bsp-site-'));
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
await page.click('.card[data-id=creation]');
await page.waitForTimeout(800);
assert.ok(audioReqs.some((u) => u.endsWith(`/audio/en/${clipId(first.en)}.mp3`)), `expected clip request, got ${audioReqs}`);
await browser.close();
web.close();
await rm(out, { recursive: true, force: true });
await rm(site, { recursive: true, force: true });
console.log('✓ game plays the recorded clip');
