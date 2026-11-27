// What's open in the store builds: three free stories, then a world's stories as a pack or the
// Everything Pack, bought by a grown-up behind a times-table gate (docs/product-sheet.md).
// Runs against a stand-in for the native Unlocks plugin, so no store is involved. The website
// stays free.
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

// shop: { owned, buy: 'ok' | 'pending' | 'cancel' | 'fail', platform: 'ios' | 'android' }, or null for the website.
async function open(hash, shop = {}, saved = {}, viewport = { width: 1180, height: 760 }) {
  const page = await browser.newPage({ viewport });
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
      getPlatform: () => shop.platform || 'ios',
      PluginHeaders: [{ name: 'Unlocks', methods: ['status', 'products', 'buy', 'restore'].map((name) => ({ name, rtype: 'promise' })) }],
      nativePromise: async (plugin, method, options) => {
        const s = window.__shop;
        s.calls.push({ method, ...options });
        if (method === 'products') return { prices: Object.fromEntries(options.ids.map((id) => [id, { 'world.island': '$4.99', 'world.sea': '$2.99', 'bundle.everything': '$6.49' }[id.split('.').slice(3).join('.')] || '$2.00'])) };
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

// 2. A locked story asks for a grown-up and offers its world as a pack. Single stories are not
// sold. The gate guards the purchase, and the pack opens that world only.
page = await open('#/');
await page.click('.stop[data-id="daniel"]');
await page.waitForSelector('.unlock-wall');
await page.waitForFunction(() => /\$4\.99/.test(document.querySelector('[data-act=world]').textContent));
assert.match(await page.textContent('[data-act=world]'), /All 9 stories left in Story Island · \$4\.99/);
assert.equal(await page.$('[data-act=story]'), null, 'single stories are below the $2 floor and are not offered');
assert.deepEqual(await page.evaluate(() => window.__shop.calls.filter((c) => c.method === 'products').flatMap((c) => c.ids).filter((id) => id.includes('.story.'))), [], 'no single-story price is asked for');
await page.click('[data-act=world]');
await page.click('.keypad [data-act=cancel]');
assert.equal(await page.$('.gate'), null, 'the gate can be closed');
assert.deepEqual(await bought(page), [], 'closing the gate must not buy');
await page.click('[data-act=world]');
await solveGate(page, true);
await page.waitForSelector('.caption');
assert.equal(await page.evaluate(() => location.hash), '#/story/daniel/0');
assert.deepEqual(await bought(page), [`${P}.world.island`]);
await page.goto(`${base}#/story/sheep/0`);
await page.waitForSelector('.caption');

// 3. The island pack opens nothing in the other world, which has its own pack.
await page.goto(`${base}#/story/samaritan/0`);
await page.waitForSelector('.unlock-wall');
await page.waitForFunction(() => /All 3 stories left in Friendship Sea · \$2\.99/.test(document.querySelector('[data-act=world]').textContent));
await page.close();

// 4. World 2 has exactly three ports. A single story bought before they were withdrawn stays
// open (product ids are permanent), and the pack is still offered for the one that is left.
page = await open('#/', { owned: [`${P}.story.bigcatch`, `${P}.story.samaritan`] }, { world: 'sea' });
await page.waitForSelector('.map.sea');
assert.deepEqual(await page.$$eval('.stop', (s) => s.map((x) => x.dataset.id)), ['bigcatch', 'samaritan', 'zacchaeus']);
assert.equal(await page.locator('.stop.locked').count(), 1);
await page.click('.stop[data-id="zacchaeus"]');
await page.waitForSelector('.unlock-wall');
assert.match(await page.textContent('[data-act=world]'), /The story left in Friendship Sea/);
await page.close();

// 5. Ask to Buy: the story opens by itself once a parent approves, and not before.
page = await open('#/story/jonah/0', { buy: 'pending' });
await page.click('[data-act=world]');
await solveGate(page);
await page.waitForFunction(() => /Waiting for a parent/.test(document.querySelector('.unlock-note').textContent));
assert.ok(await page.$('.unlock-wall'), 'a pending purchase opens nothing');
await page.evaluate((id) => { window.__shop.owned = [id]; }, `${P}.world.island`);
await page.waitForSelector('.caption', { timeout: 8000 });
await page.close();

// 6. A cancelled sheet says nothing; a store that can't sell says so.
page = await open('#/story/jonah/0', { buy: 'cancel' });
await page.click('[data-act=world]');
await solveGate(page);
await page.waitForFunction(() => window.__shop.calls.some((c) => c.method === 'buy'));
assert.equal((await page.textContent('.unlock-note')).trim(), '');
await page.evaluate(() => { window.__shop.buy = 'fail'; });
await page.click('[data-act=world]');
await solveGate(page);
await page.waitForFunction(() => /The App Store isn’t available/.test(document.querySelector('.unlock-note').textContent));
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
assert.match(await page.textContent('.unlock-wall .bundle-note'), /both worlds and every prayer, for less than buying them separately/);
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

// 10. Google Play build: the same products, worded for Google Play. A payment Google is still
// waiting for (cash, pay later) opens nothing until it goes through.
page = await open('#/story/jonah/0', { platform: 'android', buy: 'pending' });
await page.waitForSelector('.unlock-wall [data-act=bundle]');
await page.click('[data-act=world]');
await solveGate(page);
await page.waitForFunction(() => /Google Play is still waiting for this payment\. Nothing is unlocked yet/.test(document.querySelector('.unlock-note').textContent));
assert.ok(await page.$('.unlock-wall'), 'a pending Google Play payment opens nothing');
assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('bsp:v1')).owned || []), [], 'a pending payment is not saved as owned');
await page.evaluate(() => { window.__shop.buy = 'fail'; });
await page.click('[data-act=world]');
await solveGate(page);
await page.waitForFunction(() => /Google Play isn’t available/.test(document.querySelector('.unlock-note').textContent));
await page.close();
page = await open('#/parents', { platform: 'android' });
await page.locator('.gate .hold').dispatchEvent('pointerdown');
await page.waitForSelector('.world-offers [data-world=sea]');
assert.match(await page.textContent('.parents'), /one-time purchases made by a grown-up through Google Play/);
await page.locator('.policy summary').click();
assert.match(await page.textContent('.policy'), /collects no data[\s\S]*Google handles every purchase[\s\S]*support\.google\.com\/googleplay/);
assert.doesNotMatch(await page.textContent('.parents'), /Apple|App Store|Family Sharing/);
await page.close();

// 11. On phones the buy buttons sit fully on screen without scrolling, in both languages and
// both stores (Spanish and "Google Play" make the longest lines).
for (const [width, height] of [[667, 375], [832, 384], [932, 430]]) for (const lang of ['en', 'es']) for (const platform of ['ios', 'android']) for (const hash of ['#/story/jonah/0', '#/pray/blessing/0']) {
  page = await open(hash, { platform }, { lang }, { width, height });
  await page.waitForSelector('.unlock-wall .big-btn');
  await page.waitForTimeout(150);
  const off = await page.evaluate(() => [...document.querySelectorAll('.unlock-wall .big-btn, .unlock-wall [data-act=home]')]
    .map((b) => ({ what: b.dataset.act, ...b.getBoundingClientRect().toJSON() }))
    .filter((b) => b.left < 0 || b.top < 0 || b.right > innerWidth + 0.5 || b.bottom > innerHeight + 0.5)
    .map((b) => `${b.what} ${Math.round(b.left)},${Math.round(b.top)}-${Math.round(b.right)},${Math.round(b.bottom)}`));
  assert.deepEqual(off, [], `buy buttons off screen at ${width}x${height} ${lang} ${platform} ${hash}`);
  await page.close();
}

// 11. The website has nothing to buy with, so nothing is ever locked.
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
console.log('✓ unlocks: 3 free stories, $4.99 and $2.99 world packs, $6.49 Everything Pack, no single stories, grown-up gate, Ask to Buy, pending Google Play payments, restore, refunds, website stays free');
