// Voice-guided prayers: three family prayers, read a line at a time with a "Your turn!"
// pause for everyone to say it back. On the website all three are open. In the App Store
// build two are free and the third costs what one story does, behind the grown-up gate.
// Runs against a stand-in for the native Unlocks plugin, so no App Store is involved.
// Run: node tests/prayers.test.mjs
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { COUNT } from '../js/i18n.js';
import { PRAYERS } from '../js/prayers.js';

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

// shop: { owned, buy }, or null for the website.
async function open(hash, shop = null) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 760 } });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.addInitScript((shop) => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('bsp:v1', JSON.stringify({ lang: 'en', narration: false, sfx: false, stars: {} }));
      sessionStorage.setItem('seeded', '1');
    }
    if (!shop) return;
    window.__shop = { calls: [], owned: shop.owned || [] };
    window.Capacitor = {
      isNativePlatform: () => true,
      PluginHeaders: [{ name: 'Unlocks', methods: ['status', 'products', 'buy', 'restore'].map((name) => ({ name, rtype: 'promise' })) }],
      nativePromise: async (plugin, method, options) => {
        const s = window.__shop;
        s.calls.push({ method, ...options });
        if (method === 'products') return { prices: Object.fromEntries(options.ids.map((id) => [id, id.includes('.world.') ? '$1.99' : '$0.99'])) };
        if (method === 'buy') s.owned = [...s.owned, options.id];
        return { owned: s.owned };
      },
    };
  }, shop);
  await page.goto(base + hash);
  return page;
}

async function solveGate(page) {
  await page.waitForSelector('.gate .keypad');
  const [a, b] = (await page.textContent('#gate-q')).match(/[a-z]+(?= times)|(?<=times )[a-z]+/g).map((w) => COUNT.en.indexOf(w) + 1);
  for (const d of String(a * b)) await page.click(`.keypad [data-n="${d}"]`);
}
const at = (page) => page.evaluate(() => location.hash);

// 1. Website: a Prayers tab on the map opens three prayers, none locked.
let page = await open('#/');
await page.click('[data-act=prayers]');
await page.waitForSelector('.prayer-card');
assert.deepEqual(await page.$$eval('.prayer-card', (cs) => cs.map((c) => c.dataset.id)), PRAYERS.map((p) => p.id));
assert.equal(await page.locator('.prayer-card.locked').count(), 0, 'nothing is locked on the website');
assert.match(await page.textContent('.prayers h1'), /Voice-Guided Prayers/);

// 2. The guide reads a line, then shows "Your turn!" and moves on by itself.
await page.click('.prayer-card[data-id="thanks"]');
await page.waitForSelector('.praying .caption');
assert.equal(await at(page), '#/pray/thanks/0');
await page.waitForFunction(() => location.hash === '#/pray/thanks/1', null, { timeout: 12000 });
await page.waitForSelector('.praying.turn .your-turn', { timeout: 6000 });
assert.match(await page.textContent('.your-turn'), /Your turn!/);
await page.waitForFunction(() => location.hash === '#/pray/thanks/2', null, { timeout: 10000 });

// 3. Pause: the step waits after "Your turn!" until Keep going is pressed.
await page.click('[data-act=pause]');
assert.equal(await page.getAttribute('[data-act=pause]', 'aria-pressed'), 'true');
await page.waitForSelector('.praying.waited', { timeout: 15000 });
await page.waitForTimeout(400);
assert.equal(await at(page), '#/pray/thanks/2', 'paused prayer must not move on');
await page.click('[data-act=pause]');
await page.waitForFunction(() => location.hash === '#/pray/thanks/3', null, { timeout: 3000 });

// 4. "Listen again" starts the line over without skipping ahead.
await page.click('[data-act=listen]');
await page.click('[data-act=listen]');
await page.waitForFunction(() => location.hash === '#/pray/thanks/4', null, { timeout: 15000 });
await page.waitForTimeout(1000);
assert.equal(await at(page), '#/pray/thanks/4', 'one listen must lead to one step forward');

// 5. Every prayer can be walked with the arrows to its Amen screen, with no errors.
for (const p of PRAYERS) {
  await page.goto(`${base}#/pray/${p.id}/0`);
  await page.click('[data-act=pause]'); // keep each step put while the arrows walk
  for (let i = 0; i < p.steps.length; i++) {
    await page.waitForFunction((h) => location.hash === h, `#/pray/${p.id}/${i}`);
    assert.equal((await page.textContent('.caption')).trim(), p.steps[i].text.en, `${p.id} step ${i} text`);
    await page.click('[data-act=next]');
  }
  await page.waitForSelector('.amen');
  assert.match(await page.textContent('.amen h2'), /Amen!/);
  assert.match(await page.textContent('.amen p'), new RegExp(p.closing.en.slice(0, 20)));
  await page.goto(`${base}#/pray/${p.id}/0`);
  await page.click('[data-act=pause]'); // turn auto-advance back on for the next prayer
}
// The names step asks families to say who they love.
await page.goto(`${base}#/pray/blessing/4`);
await page.waitForSelector('.praying.turn', { timeout: 8000 });
assert.match(await page.textContent('.your-turn'), /Say their names!/);
await page.close();

// 6. App Store build: two free prayers, the third is $1 (the price of one story) behind the gate.
page = await open('#/prayers', {});
await page.waitForSelector('.prayer-card');
assert.equal(await page.$('.prayer-card[data-id="thanks"].locked'), null);
assert.equal(await page.$('.prayer-card[data-id="bedtime"].locked'), null);
assert.ok(await page.$('.prayer-card[data-id="blessing"].locked'), 'the third prayer shows a padlock');
await page.click('.prayer-card[data-id="bedtime"]');
await page.waitForSelector('.praying');
await page.goto(`${base}#/prayers`);
await page.click('.prayer-card[data-id="blessing"]');
await page.waitForSelector('.unlock-wall [data-act=prayer]');
await page.waitForFunction(() => document.querySelector('[data-act=prayer]').textContent.includes('$0.99'));
assert.match(await page.textContent('.unlock-wall'), /2 prayers are free/);
await page.click('[data-act=prayer]');
await solveGate(page);
await page.waitForSelector('.praying', { timeout: 5000 });
assert.equal(await at(page), '#/pray/blessing/0');
assert.deepEqual(await page.evaluate(() => window.__shop.calls.filter((c) => c.method === 'buy').map((c) => c.id)), [`${P}.prayer.blessing`]);
const priced = await page.evaluate(() => window.__shop.calls.filter((c) => c.method === 'products').flatMap((c) => c.ids));
assert.ok(priced.includes(`${P}.prayer.blessing`), 'the prayer price comes from the App Store');
await page.close();

// 7. A world purchase covers stories, not prayers; a bought prayer opens after a reinstall (owned list).
page = await open('#/pray/blessing/0', { owned: [`${P}.world.island`, `${P}.world.sea`] });
await page.waitForSelector('.unlock-wall');
await page.close();
page = await open('#/pray/blessing/0', { owned: [`${P}.prayer.blessing`] });
await page.waitForSelector('.praying');
await page.close();

await browser.close();
server.close();
assert.deepEqual(errors, [], `page errors: ${errors.join('\n')}`);
console.log('✓ prayers: 3 voice-guided prayers, your-turn pauses, pause and listen again, 2 free + 1 at the story price, gate, restore, website open');
