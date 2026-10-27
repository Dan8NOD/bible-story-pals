// End-to-end check: opens every story, reads every page, plays every mini-game
// to the reward screen, and fails on any console error.
// Run: node tests/play-through.mjs [--shots <dir>]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const shotsArg = process.argv.indexOf('--shots');
const shots = shotsArg > 0 ? process.argv[shotsArg + 1] : null;
if (shots) mkdirSync(shots, { recursive: true });

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path.endsWith('/')) path += 'index.html';
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end();
  }
}).listen(0);
const base = `http://localhost:${server.address().port}/`;

const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1180, height: 760 } });
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
const shot = async (name) => { if (shots) await page.screenshot({ path: join(shots, `${name}.png`) }); };
const hash = () => page.evaluate(() => location.hash);

await page.goto(base);
await page.waitForSelector('.card');
await page.waitForTimeout(600);
await shot('00-home');

const ids = await page.$$eval('.card', (cs) => cs.map((c) => c.dataset.id));
if (ids.length !== 12) throw new Error(`expected 12 stories, got ${ids.length}`);

for (const id of ids) {
  await page.goto(`${base}#/`);
  await page.click(`.card[data-id="${id}"]`);
  let p = 0;
  while ((await hash()).startsWith('#/story/')) {
    await page.waitForTimeout(250);
    await shot(`${id}-page${p++}`);
    await page.click('[data-act=next]');
  }
  if ((await hash()) !== `#/play/${id}`) throw new Error(`${id}: expected game, got ${await hash()}`);
  await page.waitForTimeout(400);
  await shot(`${id}-game`);

  const deadline = Date.now() + 90000;
  while ((await hash()) === `#/play/${id}`) {
    if (Date.now() > deadline) throw new Error(`${id}: game did not finish`);
    // Read without waiting: the game may finish and swap to the reward screen at any moment.
    const want = await page.evaluate(() => document.querySelector('.stage-svg')?.dataset.want ?? null);
    if (want) {
      // Prompt game: tap the item the game is asking for.
      const target = await page.evaluate(() => {
        const svgEl = document.querySelector('.stage-svg');
        const wantKey = svgEl.dataset.want;
        const el = [...document.querySelectorAll('.item:not(.gone)')].find((e) => e.dataset.key === wantKey);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      });
      if (target) await page.mouse.click(target.x, target.y);
      await page.waitForTimeout(300);
    } else if (await page.evaluate(() => !!document.querySelector('#basket'))) {
      // Steer game: chase the nearest flower.
      const t = await page.evaluate(() => {
        const svgEl = document.querySelector('.stage-svg');
        const lilies = [...svgEl.querySelectorAll('[data-kind=lily]')].map((g) => g.getBoundingClientRect()).filter((r) => r.y > 0);
        const b = svgEl.querySelector('#basket').getBoundingClientRect();
        lilies.sort((a, c) => c.y - a.y);
        const next = lilies.find((r) => r.y < b.y + 10);
        return next ? { x: next.x + next.width / 2, y: b.y + b.height / 2 } : null;
      });
      if (t) { await page.mouse.move(t.x, t.y); await page.mouse.down(); await page.mouse.up(); }
      await page.waitForTimeout(120);
    } else {
      // Collect game: tap the next item (they bob, so click by position).
      const r = await page.evaluate(() => {
        const el = document.querySelector('.item:not(.gone)');
        if (!el) return null;
        const b = el.querySelector('circle').getBoundingClientRect();
        return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
      });
      if (r) await page.mouse.click(r.x, r.y);
      await page.waitForTimeout(150);
    }
  }
  if ((await hash()) !== `#/yay/${id}`) throw new Error(`${id}: expected reward, got ${await hash()}`);
  await page.waitForTimeout(1200);
  await shot(`${id}-reward`);
  console.log(`✓ ${id}: ${p} pages, game finished`);
}

await page.goto(`${base}#/`);
await page.waitForSelector('.card');
const stars = await page.locator('.star-count span').textContent();
if (stars !== `${ids.length}/${ids.length}`) throw new Error(`expected all stars, got ${stars}`);

// Language switching updates titles.
await page.click('.chip[data-lang=es]');
if (!(await page.locator('.brand h1').textContent()).startsWith('Amiguitos')) throw new Error('Spanish title missing');
await page.click('.chip[data-lang=both]');
await page.click('.card[data-id=noah]');
await page.waitForSelector('.caption .line');
if ((await page.locator('.caption .line').count()) !== 2) throw new Error('both-language captions missing');
await shot('zz-both-languages');

// Grown-ups area opens after the 3-second hold.
await page.goto(`${base}#/`);
await page.waitForSelector('#parents');
await page.click('#parents');
await page.locator('.gate .hold').dispatchEvent('pointerdown');
await page.waitForSelector('.parents h2', { timeout: 6000 });
await shot('zz-parents');
// Every story lists its Bible passage for grown-ups (a missing REFS line shows as "undefined").
const refs = await page.$$eval('.parents li', (lis) => lis.map((li) => li.textContent));
const storyRefs = refs.filter((t) => t.includes(' / '));
if (storyRefs.length !== ids.length || storyRefs.some((t) => t.includes('undefined'))) {
  throw new Error(`grown-ups screen should list a passage for all ${ids.length} stories, got: ${storyRefs.join(' | ')}`);
}

// Phone sizes.
for (const [w, h, name] of [[844, 390, 'phone-landscape'], [390, 844, 'phone-portrait']]) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`${base}#/story/david/1`);
  await page.waitForTimeout(400);
  await shot(`zz-${name}-story`);
  await page.goto(`${base}#/`);
  await page.waitForTimeout(400);
  await shot(`zz-${name}-home`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (overflow) throw new Error(`${name}: horizontal overflow`);
}

await browser.close();
server.close();
if (errors.length) {
  console.error('Console errors:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('All stories played through with no errors.');
