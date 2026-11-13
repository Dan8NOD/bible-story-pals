// What's open in the App Store build: three free stories, then $1 a story or $2 a world,
// bought by a grown-up behind a times-table gate. Runs against a stand-in for the native
// Unlocks plugin, so no App Store is involved. The website stays free.
// Run: node tests/unlocks.test.mjs
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
const P = 'com.dancruz.torahstorypals';

// shop: { owned, buy: 'ok' | 'pending' | 'cancel' | 'fail' }, or null for the website.
async function open(hash, shop = {}, saved = {}) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 760 } });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.addInitScript(([shop, saved]) => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('tsp:v1', JSON.stringify({ lang: 'en', narration: false, sfx: false, stars: {}, ...saved }));
      sessionStorage.setItem('seeded', '1');
    }
    if (!shop) return;
    window.__shop = { calls: [], owned: shop.owned || [], buy: shop.buy || 'ok' };
    window.Capacitor = {
      isNativePlatform: () => true,
      PluginHeaders: [{ name: 'Unlocks', methods: ['status', 'products', 'buy', 'restore'].map((name) => ({ name, rtype: 'promise' })) }],
      nativePromise: async (plugin, method, options) => {
        const s = window.__shop;
        s.calls.push({ method, ...options });
        if (method === 'products') return { prices: Object.fromEntries(options.ids.map((id) => [id, id.includes('.world.') ? '$1.99' : '$0.99'])) };
        if (method === 'buy') {
          if (s.buy === 'pending') return { pending: true };
          if (s.buy === 'cancel') return { cancelled: true };
          if (s.buy === 'fail') throw new Error('This isn’t available from the App Store yet.');
          s.owned = [...s.owned, options.id];
        }
        return { owned: s.owned };
      },
    };
  }, [shop, saved]);
  // These tests are about the paywall, so it is on here whatever config.js says today.
  const config = (await readFile(join(root, 'js/config.js'), 'utf8')).replace(/OPEN_FOR_TESTERS = (true|false)/, `OPEN_FOR_TESTERS = ${!!shop?.testers}`);
  await page.route('**/js/config.js', (route) => route.fulfill({ contentType: 'text/javascript', body: config }));
  await page.goto(base + hash);
  return page;
}

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
const bought = (page) => page.evaluate(() => window.__shop.calls.filter((c) => c.method === 'buy').map((c) => c.id));

// 1. The first three stories just open, and show no padlock.
let page = await open('#/');
await page.waitForSelector('.stop');
for (const id of ['creation', 'noah', 'abraham']) assert.equal(await page.$(`.stop[data-id="${id}"].locked`), null, `${id} is free`);
assert.equal(await page.locator('.stop.locked').count(), 4, 'the other four Torah Trail stories show a padlock');
await page.click('.stop[data-id="noah"]');
await page.waitForSelector('.caption');
await page.close();

// 2. A locked story asks for a grown-up with both prices. The gate guards the purchase, and $1 opens that one story only.
page = await open('#/');
await page.click('.stop[data-id="joseph"]');
await page.waitForSelector('.unlock-wall');
await page.waitForFunction(() => /\$0\.99/.test(document.querySelector('[data-act=story]').textContent));
assert.match(await page.textContent('[data-act=world]'), /All 4 stories left in Torah Trail · \$1\.99/);
await page.click('[data-act=story]');
await page.click('.keypad [data-act=cancel]');
assert.equal(await page.$('.gate'), null, 'the gate can be closed');
assert.deepEqual(await bought(page), [], 'closing the gate must not buy');
await page.click('[data-act=story]');
await solveGate(page, true);
await page.waitForSelector('.caption');
assert.equal(await page.evaluate(() => location.hash), '#/story/joseph/0');
assert.deepEqual(await bought(page), [`${P}.story.joseph`]);
await page.goto(`${base}#/story/moses/0`);
await page.waitForSelector('.unlock-wall');
await page.close();

// 3. $2 opens everything left in that world, and nothing in the other one.
page = await open('#/story/moses/0');
await page.waitForSelector('.unlock-wall');
await page.click('[data-act=world]');
await solveGate(page);
await page.waitForSelector('.caption');
assert.deepEqual(await bought(page), [`${P}.world.torah`]);
await page.goto(`${base}#/story/manna/0`);
await page.waitForSelector('.caption');
await page.goto(`${base}#/story/esther/0`);
await page.waitForSelector('.unlock-wall');
assert.match(await page.textContent('[data-act=world]'), /All 8 stories left in Kings and Prophets/);
await page.close();

// 4. World 2 has eight stops in the Hebrew Bible's order, all locked; the world price drops out when only one story is left.
const world2 = ['samuel', 'david', 'elijah', 'jonah', 'psalm23', 'ruth', 'esther', 'daniel'];
page = await open('#/', { owned: world2.slice(0, 7).map((id) => `${P}.story.${id}`) }, { world: 'prophets' });
await page.waitForSelector('.map.prophets');
assert.deepEqual(await page.$$eval('.stop', (s) => s.map((x) => x.dataset.id)), world2);
assert.equal(await page.locator('.stop.locked').count(), 1);
await page.click('.stop[data-id="daniel"]');
await page.waitForSelector('.unlock-wall');
assert.equal(await page.$('[data-act=world]'), null);
await page.close();

// 5. Ask to Buy: the story opens by itself once a parent approves.
page = await open('#/story/jonah/0', { buy: 'pending' });
await page.click('[data-act=story]');
await solveGate(page);
await page.waitForFunction(() => /Waiting for a parent/.test(document.querySelector('.unlock-note').textContent));
await page.evaluate((id) => { window.__shop.owned = [id]; }, `${P}.story.jonah`);
await page.waitForSelector('.caption', { timeout: 8000 });
await page.close();

// 6. A cancelled sheet says nothing; a store that can't sell says so.
page = await open('#/story/jonah/0', { buy: 'cancel' });
await page.click('[data-act=story]');
await solveGate(page);
await page.waitForFunction(() => window.__shop.calls.some((c) => c.method === 'buy'));
assert.equal((await page.textContent('.unlock-note')).trim(), '');
await page.evaluate(() => { window.__shop.buy = 'fail'; });
await page.click('[data-act=story]');
await solveGate(page);
await page.waitForFunction(() => /isn’t available/.test(document.querySelector('.unlock-note').textContent));
assert.ok(await page.$('.unlock-wall'));
await page.close();

// 7. Restore brings back a purchase, and a refund locks the story again.
page = await open('#/story/jonah/0');
await page.waitForSelector('.unlock-wall');
await page.evaluate((id) => { window.__shop.owned = [id]; }, `${P}.world.prophets`);
await page.click('[data-act=restore]');
await page.waitForSelector('.caption');
await page.close();
page = await open('#/story/jonah/0', { owned: [] }, { owned: [`${P}.world.prophets`] });
await page.waitForSelector('.unlock-wall');
await page.close();

// 8. The grown-ups area shows each world and sells what's left.
page = await open('#/parents', { owned: [`${P}.story.david`] });
await page.locator('.gate .hold').dispatchEvent('pointerdown'); // #/parents always asks for the hold
await page.waitForSelector('.world-offers [data-world=prophets]');
const offers = await page.textContent('.world-offers');
assert.match(offers, /Torah Trail: 3 of 7 stories open/);
assert.match(offers, /Kings and Prophets: 1 of 8 stories open/);
// The full privacy policy is readable in the app, without any link out of it.
await page.locator('.policy summary').click();
assert.match(await page.textContent('.policy'), /collects no data[\s\S]*Apple handles every purchase[\s\S]*negotiatorsondemand@gmail\.com/);
assert.equal(await page.locator('.policy a').count(), 0);
await page.click('.world-offers [data-world=prophets]');
await solveGate(page);
await page.waitForFunction(() => /Kings and Prophets: 8 of 8/.test(document.querySelector('.world-offers').textContent));
assert.equal(await page.$('.world-offers [data-world=prophets]'), null);
await page.close();

// 9. The website has nothing to buy with, so nothing is ever locked.
page = await open('#/', null);
await page.waitForSelector('.stop');
assert.equal(await page.locator('.stop.locked').count(), 0);
await page.goto(`${base}#/story/esther/0`);
await page.waitForSelector('.caption');
assert.equal(await page.$('.unlock-wall'), null);
await page.close();

// 10. A tester build (OPEN_FOR_TESTERS in config.js) opens everything inside the app and sells nothing.
page = await open('#/', { testers: true });
await page.waitForSelector('.stop');
assert.equal(await page.locator('.stop.locked').count(), 0);
await page.goto(`${base}#/story/daniel/0`);
await page.waitForSelector('.caption');
await page.goto(`${base}#/pray/blessing/0`);
await page.waitForSelector('.praying');
await page.goto(`${base}#/parents`);
await page.locator('.gate .hold').dispatchEvent('pointerdown');
await page.waitForSelector('.parents .tester-note', { timeout: 6000 });
assert.equal(await page.$('.world-offers'), null);
assert.deepEqual(await bought(page), []);
await page.close();

// 11. In Hebrew the wall, the prices and the grown-up question are in Hebrew, and the answer still buys.
page = await open('#/story/joseph/0', {}, { lang: 'he' });
await page.waitForSelector('.unlock-wall');
await page.waitForFunction(() => /\$0\.99/.test(document.querySelector('[data-act=story]').textContent));
assert.match(await page.textContent('.unlock-wall h2'), /למבוגר/);
assert.match(await page.textContent('[data-act=story]'), /הסיפור הזה/);
assert.match(await page.textContent('[data-act=world]'), /כל 4 הסיפורים שנשארו/);
await page.click('[data-act=story]');
await page.waitForSelector('.gate .keypad');
{
  const [a, b] = (await page.textContent('#gate-q')).match(/[\u05d0-\u05ea]+(?= כפול)|(?<=כפול )[\u05d0-\u05ea]+/g).map((w) => COUNT.he.indexOf(w) + 1);
  for (const d of String(a * b)) await page.click(`.keypad [data-n="${d}"]`);
}
await page.waitForSelector('.caption');
assert.deepEqual(await bought(page), [`${P}.story.joseph`]);
await page.close();

assert.deepEqual(errors, []);
await browser.close();
server.close();
console.log('✓ unlocks: 3 free stories, $1 a story, $2 a world, grown-up gate (also in Hebrew), Ask to Buy, restore, refunds, website stays free');
