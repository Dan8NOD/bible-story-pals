// Inside the Android app (Capacitor): the hardware Back button steps up to the menu and
// leaves from home, the grown-ups area carries the full privacy policy with no purchases,
// and going to the background hushes the voice and pauses a prayer.
// Runs against a stand-in for the Android bridge. Run: node tests/android.test.mjs
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(join(root, p)); res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
}).listen(0);
const base = `http://localhost:${server.address().port}/`;

const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const errors = [];

// The Android build has the TextToSpeech and App plugins, and no Unlocks plugin (no purchases).
async function open(hash, saved = {}) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 760 } });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.addInitScript((saved) => {
    localStorage.setItem('bsp:v1', JSON.stringify({ lang: 'en', narration: true, sfx: false, stars: {}, ...saved }));
    window.__calls = [];
    window.__listeners = {};
    window.Capacitor = {
      isNativePlatform: () => true,
      getPlatform: () => 'android',
      PluginHeaders: [
        { name: 'TextToSpeech', methods: [{ name: 'speak', rtype: 'promise' }, { name: 'stop', rtype: 'promise' }] },
        { name: 'App', methods: [{ name: 'minimizeApp', rtype: 'promise' }, { name: 'exitApp', rtype: 'promise' }] },
      ],
      addListener: (plugin, event, cb) => { window.__listeners[`${plugin}.${event}`] = cb; return { remove() {} }; },
      nativePromise: (plugin, method, options) => {
        window.__calls.push({ plugin, method, options });
        return new Promise((r) => setTimeout(r, method === 'speak' ? 400 : 0));
      },
    };
    window.__back = () => window.__listeners['App.backButton']();
  }, saved);
  await page.goto(base + hash);
  return page;
}
const hash = (page) => page.evaluate(() => location.hash);

// 1. Back steps up to the menu instead of replaying the trail, and leaves the app from home.
let page = await open('#/');
await page.waitForSelector('#parents');
assert.equal(await page.evaluate(() => typeof window.__listeners['App.backButton']), 'function', 'no Back listener on Android');
await page.goto(base + '#/story/noah/2');
await page.waitForSelector('.caption');
await page.evaluate(() => window.__back());
await page.waitForSelector('#parents');
assert.equal(await hash(page), '#/');
await page.evaluate(() => window.__back());
await page.waitForFunction(() => window.__calls.some((c) => c.plugin === 'App' && c.method === 'minimizeApp'));
// From a prayer, Back goes to the prayer list.
await page.goto(base + '#/pray/blessing/1');
await page.waitForSelector('.praying');
await page.evaluate(() => window.__back());
await page.waitForSelector('.prayer-list');
assert.equal(await hash(page), '#/prayers');
// With the grown-ups gate open, Back closes just the gate.
await page.goto(base + '#/');
await page.click('#parents');
await page.waitForSelector('.gate');
await page.evaluate(() => window.__back());
assert.equal(await page.locator('.gate').count(), 0);
assert.equal(await hash(page), '#/');
await page.close();
console.log('✓ android Back: up to the menu, prayers to the prayer list, closes the gate, leaves from home');

// 2. The grown-ups area has the full policy, with no App Store purchase wording.
page = await open('#/parents');
await page.locator('.gate .hold').dispatchEvent('pointerdown');
await page.waitForSelector('.parents h2', { timeout: 6000 });
assert.match(await page.textContent('.parents'), /no purchases, no accounts, no tracking/);
assert.doesNotMatch(await page.textContent('.parents'), /After the first visit/);
await page.locator('.policy summary').click();
const policy = await page.textContent('.policy');
assert.match(policy, /collects no data[\s\S]*has no purchases[\s\S]*negotiatorsondemand@gmail\.com/);
assert.doesNotMatch(policy, /Apple|App Store|unlocked|question for grown-ups/);
assert.equal(await page.locator('.policy a').count(), 0);
await page.close();
console.log('✓ android grown-ups area: full privacy policy, no purchases');

// 3. Going to the background stops the voice and pauses a prayer where it was.
// Narration off keeps each step's timing short and fixed (read time + "your turn" wait).
page = await open('#/pray/blessing/0', { narration: false });
await page.waitForSelector('.praying');
await page.waitForTimeout(300);
const stops = () => page.evaluate(() => window.__calls.filter((c) => c.method === 'stop').length);
const before = await stops();
const hide = (hidden) => page.evaluate((h) => {
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => h });
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (h ? 'hidden' : 'visible') });
  document.dispatchEvent(new Event('visibilitychange'));
}, hidden);
await hide(true);
assert.ok((await stops()) > before, 'voice kept talking in the background');
await page.waitForTimeout(16000); // longer than any step's read time + "your turn" wait
assert.equal(await hash(page), '#/pray/blessing/0', 'prayer moved on in the background');
await hide(false);
await page.waitForSelector('.praying.paused [data-act=pause][aria-pressed=true]');
await page.close();
console.log('✓ android background: voice stops, prayer stays paused on its step');

// 4. The Google Play upload key stays out of this repo, which GitHub Pages publishes whole:
// Gradle reads the key settings from outside it, and git ignores key files.
const gradle = await readFile(join(root, 'android/app/build.gradle'), 'utf8');
assert.match(gradle, /BSP_KEYSTORE_PROPERTIES/, 'release signing no longer reads its settings from outside the repo');
assert.doesNotMatch(gradle, /(storePassword|keyPassword)\s+['"]/, 'a signing password is written into build.gradle');
const ignored = (await readFile(join(root, '.gitignore'), 'utf8')).split(/\r?\n/);
for (const rule of ['*.jks', '*.keystore', 'keystore.properties']) assert.ok(ignored.includes(rule), `.gitignore no longer ignores ${rule}`);
console.log('✓ android release: the upload key and its settings stay outside the repo');

assert.deepEqual(errors, []);
await browser.close();
server.close();
