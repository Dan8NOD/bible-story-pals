// Play time in the App Store build: 20 free minutes, then a 12-hour pass that a
// grown-up buys behind a times-table gate. Runs against a stand-in for the native
// Pass plugin, so no App Store is involved. The website stays free.
// Run: node tests/pass.test.mjs
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { COUNT } from '../js/i18n.js';

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
const HOUR = 3600e3;

// played: free seconds already used. pass: { until, buy: 'ok' | 'pending' | 'cancel' | 'fail' }, or null for the website.
async function open(hash, played, pass = {}) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 760 } });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.addInitScript(([played, pass]) => {
    localStorage.setItem('bsp:v1', JSON.stringify({ lang: 'en', narration: false, sfx: false, stars: {}, played }));
    if (!pass) return;
    window.__pass = { calls: [], until: pass.until || 0, buy: pass.buy || 'ok' };
    window.Capacitor = {
      isNativePlatform: () => true,
      PluginHeaders: [{ name: 'Pass', methods: ['status', 'product', 'buy', 'restore'].map((name) => ({ name, rtype: 'promise' })) }],
      nativePromise: async (plugin, method) => {
        const s = window.__pass;
        s.calls.push(method);
        if (method === 'product') return { available: true, price: '$1.99' };
        if (method === 'buy') {
          if (s.buy === 'pending') return { pending: true };
          if (s.buy === 'cancel') return { cancelled: true };
          if (s.buy === 'fail') throw new Error('The 12-hour pass isn’t available from the App Store yet.');
          s.until = Date.now() + 12 * 3600e3;
        }
        return { until: s.until };
      },
    };
  }, [played, pass]);
  await page.goto(base + hash);
  return page;
}

const played = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('bsp:v1')).played);

// Answers the gate's question ("What is seven times four?") on its keypad.
async function solveGate(page, wrongFirst = false) {
  await page.waitForSelector('.gate .keypad');
  const answer = async () => {
    const [a, b] = (await page.textContent('#gate-q')).match(/[a-z]+(?= times)|(?<=times )[a-z]+/g).map((w) => COUNT.en.indexOf(w) + 1);
    return String(a * b);
  };
  if (wrongFirst) {
    for (const _ of await answer()) await page.click('.keypad [data-n="0"]');
    assert.ok(await page.$('.gate'), 'a wrong answer must not open the purchase');
  }
  for (const d of await answer()) await page.click(`.keypad [data-n="${d}"]`);
}

// 1. Inside the free minutes, stories just open.
let page = await open('#/story/daniel/0', 0, {});
await page.waitForSelector('.caption');
assert.equal(await page.$('.pass-wall'), null);
await page.close();

// 2. Out of free time: the map still works, a story asks for a grown-up, and buying opens it.
page = await open('#/', 1200, {});
await page.click('.stop[data-id="noah"]');
await page.waitForSelector('.pass-wall');
assert.match(await page.textContent('.pass-wall'), /20 free minutes are used up.*\$1\.99/s);
await page.click('[data-act=unlock]');
await page.click('.keypad [data-act=cancel]');
assert.equal(await page.$('.gate'), null, 'the gate can be closed');
assert.ok(!(await page.evaluate(() => window.__pass.calls)).includes('buy'), 'closing the gate must not buy');
await page.click('[data-act=unlock]');
await solveGate(page, true);
await page.waitForSelector('.caption');
assert.equal(await page.evaluate(() => location.hash), '#/story/noah/0');
await page.goto(`${base}#/parents`);
await page.waitForSelector('.pass-status');
await page.waitForFunction(() => /Unlocked until/.test(document.querySelector('.pass-status').textContent));
assert.match(await page.textContent('[data-act=unlock]'), /Add 12 more hours · \$1\.99/);
await page.close();

// 3. Ask to Buy: the story opens by itself once a parent approves.
page = await open('#/story/jonah/0', 1200, { buy: 'pending' });
await page.click('[data-act=unlock]');
await solveGate(page);
await page.waitForFunction(() => /Waiting for a parent/.test(document.querySelector('.pass-note').textContent));
await page.evaluate(() => { window.__pass.until = Date.now() + 12 * 3600e3; });
await page.waitForSelector('.caption', { timeout: 8000 });
await page.close();

// 4. A cancelled sheet says nothing; a store that can't sell says so.
page = await open('#/story/jonah/0', 1200, { buy: 'cancel' });
await page.click('[data-act=unlock]');
await solveGate(page);
await page.waitForFunction(() => window.__pass.calls.includes('buy'));
assert.equal((await page.textContent('.pass-note')).trim(), '');
await page.evaluate(() => { window.__pass.buy = 'fail'; });
await page.click('[data-act=unlock]');
await solveGate(page);
await page.waitForFunction(() => /isn’t available/.test(document.querySelector('.pass-note').textContent));
assert.ok(await page.$('.pass-wall'));
await page.close();

// 5. Free minutes run only inside stories and games, never on the map.
page = await open('#/', 1192, {});
await page.waitForTimeout(5600);
assert.equal(await played(page), 1192, 'time on the map must not count');
await page.goto(`${base}#/story/daniel/0`);
await page.waitForFunction(() => JSON.parse(localStorage.getItem('bsp:v1')).played >= 1200, null, { timeout: 12000 });
await page.click('[data-act=next]');
await page.waitForSelector('.pass-wall');
await page.close();

// 6. While a pass is running, stories open and free minutes are left alone.
page = await open('#/story/daniel/0', 1200, { until: Date.now() + HOUR });
await page.waitForSelector('.caption');
await page.waitForTimeout(5600);
assert.equal(await played(page), 1200);
await page.close();

// 7. The website has nothing to buy with, so it never stops play.
page = await open('#/story/daniel/0', 99999, null);
await page.waitForSelector('.caption');
assert.equal(await page.$('.pass-wall'), null);
await page.close();

assert.deepEqual(errors, []);
await browser.close();
server.close();
console.log('✓ 12-hour pass: 20 free minutes, grown-up gate, purchase, Ask to Buy, failures, website stays free');
