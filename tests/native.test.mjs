// Inside the iOS app (Capacitor), lines without a recorded clip are read by the
// native text-to-speech plugin, and the website-only service worker stays off.
// Run: node tests/native.test.mjs
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { byId } from '../js/stories.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(join(root, p)); res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
}).listen(0);

const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
// A stand-in for the bridge Capacitor injects into the iOS WebView.
await page.addInitScript(() => {
  localStorage.setItem('bsp:v1', JSON.stringify({ lang: 'en', narration: true, sfx: true, stars: {} }));
  window.__tts = [];
  window.Capacitor = {
    isNativePlatform: () => true,
    PluginHeaders: [{ name: 'TextToSpeech', methods: [{ name: 'speak', rtype: 'promise' }, { name: 'stop', rtype: 'promise' }] }],
    nativePromise: (plugin, method, options) => {
      window.__tts.push({ plugin, method, options });
      return new Promise((r) => setTimeout(r, 50));
    },
  };
});

const line = byId('daniel').pages[0].text.en;
await page.goto(`http://localhost:${server.address().port}/#/story/daniel/0`);
await page.waitForFunction((t) => window.__tts.some((c) => c.method === 'speak' && c.options.text === t), line, { timeout: 5000 });
const call = await page.evaluate((t) => window.__tts.find((c) => c.method === 'speak' && c.options.text === t), line);
assert.equal(call.plugin, 'TextToSpeech');
assert.equal(call.options.lang, 'en-US');
assert.equal(await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length), 0, 'service worker registered inside the app');
assert.deepEqual(errors, []);
await browser.close();
server.close();
console.log('✓ native app: unrecorded lines use the TextToSpeech plugin; no service worker');
