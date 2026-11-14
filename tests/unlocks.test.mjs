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
const P = 'com.dancruz.biblestorypals';

// shop: { owned, buy: 'ok' | 'pending' | 'cancel' | 'fail' }, or null for the website.
async function open(hash, shop = {}, saved = {}) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 760 } });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.addInitScript(([shop, saved]) => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('bsp:v1', JSON.stringify({ lang: 'en', narration: false, sfx: false, stars: {}, ...saved }));
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
        if (method === 'products') return { prices: Object.fromEntries(options.ids.map((id) => [id, id.includes('.world.') ? '$1.99' : id.includes('.bundle.') ? '$6.49' : '$0.99'])) };
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
for (const id of ['creation', 'noah', 'moses']) assert.equal(await page.$(`.stop[data-id="${id}"].locked`), null, `${id} is free`);
assert.equal(await page.locator('.stop.locked').count(), 9, 'the other nine island stories show a padlock');
await page.click('.stop[data-id="noah"]');
await page.waitForSelector('.caption');
await page.close();

// 2. A locked story asks for a grown-up with both prices. The gate guards the purchase, and $1 opens that one story only.
page = await open('#/');
await page.click('.stop[data-id="daniel"]');
await page.waitForSelector('.unlock-wall');
await page.waitForFunction(() => /\$0\.99/.test(document.querySelector('[data-act=story]').textContent));
assert.match(await page.textContent('[data-act=world]'), /All 9 stories left in Story Island · \$1\.99/);
await page.click('[data-act=story]');
await page.click('.keypad [data-act=cancel]');
assert.equal(await page.$('.gate'), null, 'the gate can be closed');
assert.deepEqual(await bought(page), [], 'closing the gate must not buy');
await page.click('[data-act=story]');
await solveGate(page, true);
await page.waitForSelector('.caption');
assert.equal(await page.evaluate(() => location.hash), '#/story/daniel/0');
assert.deepEqual(await bought(page), [`${P}.story.daniel`]);
await page.goto(`${base}#/story/jonah/0`);
await page.waitForSelector('.unlock-wall');
await page.close();

// 3. $2 opens everything left in that world, and nothing in the other one.
page = await open('#/story/david/0');
await page.waitForSelector('.unlock-wall');
await page.click('[data-act=world]');
await solveGate(page);
await page.waitForSelector('.caption');
assert.deepEqual(await bought(page), [`${P}.world.island`]);
await page.goto(`${base}#/story/sheep/0`);
await page.waitForSelector('.caption');
await page.goto(`${base}#/story/samaritan/0`);
await page.waitForSelector('.unlock-wall');
assert.match(await page.textContent('[data-act=world]'), /All 3 stories left in Friendship Sea/);
await page.close();

// 4. World 2 has exactly three ports, all locked; the world price drops out when only one story is left.
page = await open('#/', { owned: [`${P}.story.bigcatch`, `${P}.story.samaritan`] }, { world: 'sea' });
await page.waitForSelector('.map.sea');
assert.deepEqual(await page.$$eval('.stop', (s) => s.map((x) => x.dataset.id)), ['bigcatch', 'samaritan', 'zacchaeus']);
assert.equal(await page.locator('.stop.locked').count(), 1);
await page.click('.stop[data-id="zacchaeus"]');
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
await page.evaluate((id) => { window.__shop.owned = [id]; }, `${P}.world.island`);
await page.click('[data-act=restore]');
await page.waitForSelector('.caption');
await page.close();
page = await open('#/story/jonah/0', { owned: [] }, { owned: [`${P}.world.island`] });
await page.waitForSelector('.unlock-wall');
await page.close();

// 8. The grown-ups area shows each world and sells what's left.
page = await open('#/parents', { owned: [`${P}.story.david`] });
await page.locator('.gate .hold').dispatchEvent('pointerdown'); // #/parents always asks for the hold
await page.waitForSelector('.world-offers [data-world=sea]');
const offers = await page.textContent('.world-offers');
assert.match(offers, /Story Island: 4 of 12 stories open/);
assert.match(offers, /Friendship Sea: 0 of 3 stories open/);
// The full privacy policy is readable in the app, without any link out of it.
await page.locator('.policy summary').click();
assert.match(await page.textContent('.policy'), /collects no data[\s\S]*Apple handles every purchase[\s\S]*negotiatorsondemand@gmail\.com/);
assert.equal(await page.locator('.policy a').count(), 0);
await page.click('.world-offers [data-world=sea]');
await solveGate(page);
await page.waitForFunction(() => /Friendship Sea: 3 of 3/.test(document.querySelector('.world-offers').textContent));
assert.equal(await page.$('.world-offers [data-world=sea]'), null);
await page.close();

// 9. The Everything Pack: offered while anything is locked, and one purchase opens every story and prayer.
page = await open('#/story/jonah/0');
await page.waitForSelector('.unlock-wall [data-act=bundle]');
await page.waitForFunction(() => /Everything Pack: every story and prayer · \$6\.49/.test(document.querySelector('[data-act=bundle]').textContent));
assert.match(await page.textContent('.unlock-wall .bundle-note'), /half of buying every story and prayer one by one/);
await page.click('[data-act=bundle]');
await solveGate(page);
await page.waitForSelector('.caption');
assert.deepEqual(await bought(page), [`${P}.bundle.everything`]);
for (const hash of ['#/story/samaritan/0', '#/story/zacchaeus/0', '#/pray/blessing/0']) {
  await page.goto(`${base}${hash}`);
  await page.waitForSelector('.caption');
  assert.equal(await page.$('.unlock-wall'), null, `${hash} opens with the Everything Pack`);
}
await page.goto(`${base}#/`);
await page.waitForSelector('.stop');
assert.equal(await page.locator('.stop.locked').count(), 0, 'no padlocks left on the island');
await page.close();
// The prayer's wall offers it too.
page = await open('#/pray/blessing/0');
await page.waitForSelector('.unlock-wall [data-act=bundle]');
await page.close();
// Once everything is owned some other way, it isn't offered.
page = await open('#/parents', { owned: [`${P}.world.island`, `${P}.world.sea`, `${P}.prayer.blessing`] });
await page.locator('.gate .hold').dispatchEvent('pointerdown');
await page.waitForSelector('.world-offers');
await page.waitForFunction(() => /Friendship Sea: 3 of 3/.test(document.querySelector('.world-offers').textContent));
assert.equal(await page.$('.world-offers [data-bundle]'), null);
await page.close();
// The grown-ups area sells it while something is locked.
page = await open('#/parents', { owned: [`${P}.world.island`] });
await page.locator('.gate .hold').dispatchEvent('pointerdown');
await page.waitForSelector('.world-offers [data-bundle]');
await page.click('.world-offers [data-bundle]');
await solveGate(page);
await page.waitForFunction(() => /Friendship Sea: 3 of 3/.test(document.querySelector('.world-offers').textContent));
assert.equal(await page.$('.world-offers [data-bundle]'), null);
await page.close();

// 10. The website has nothing to buy with, so nothing is ever locked.
page = await open('#/', null);
await page.waitForSelector('.stop');
assert.equal(await page.locator('.stop.locked').count(), 0);
await page.goto(`${base}#/story/zacchaeus/0`);
await page.waitForSelector('.caption');
assert.equal(await page.$('.unlock-wall'), null);
await page.close();

assert.deepEqual(errors, []);
await browser.close();
server.close();
console.log('✓ unlocks: 3 free stories, $1 a story, $2 a world, $6.49 Everything Pack, grown-up gate, Ask to Buy, restore, refunds, website stays free');
