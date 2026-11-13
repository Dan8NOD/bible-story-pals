// Regression checks for bugs found before the 1.0 App Store submission.
// Run: node tests/regressions.mjs
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = createRequire(import.meta.url)('playwright');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };
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

const browser = await chromium.launch();
const errors = [];
async function freshPage(viewport = { width: 1180, height: 760 }) {
  const page = await browser.newPage({ viewport });
  page.on('pageerror', (e) => errors.push(String(e)));
  return page;
}
const tapKey = (page, key) => page.evaluate((k) => {
  const el = [...document.querySelectorAll('.item:not(.gone)')].find((e) => e.dataset.key === k);
  el?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
  return !!el;
}, key);
const fail = (msg) => { throw new Error(msg); };

// 1. Memory game: two wrong cards ~50 ms apart, then a third the moment the first
//    flips back. The third card used to stay face-up forever and the game never ended.
{
  const page = await freshPage();
  await page.goto(`${base}#/play/joseph`);
  await page.waitForSelector('.stage-svg .item');
  await page.evaluate(async () => {
    const down = (el) => el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
    const els = [...document.querySelectorAll('.stage-svg .item')];
    const a = els[0];
    const b = els.find((e) => e.dataset.key !== a.dataset.key);
    const c = els.find((e) => e !== a && e !== b);
    down(a);
    await new Promise((r) => setTimeout(r, 50));
    down(b);
    while (a.classList.contains('gone')) await new Promise((r) => requestAnimationFrame(r));
    down(c);
  });
  // Now play it out the way a child would: keep tapping what the game wants.
  const deadline = Date.now() + 30000;
  while ((await page.evaluate(() => location.hash)) === '#/play/joseph') {
    if (Date.now() > deadline) fail('memory game got stuck after fast taps');
    const want = await page.evaluate(() => document.querySelector('.stage-svg')?.dataset.want ?? null);
    if (want) await tapKey(page, want);
    await page.waitForTimeout(350);
  }
  console.log('✓ memory game survives fast taps');
  await page.close();
}

// 2. Parental gate: a second finger used to start a hold timer the first finger's
//    release couldn't cancel, so lifting both still opened the grown-ups area.
{
  const page = await freshPage();
  await page.goto(`${base}#/`);
  await page.click('#parents');
  const hold = page.locator('.gate .hold');
  await hold.dispatchEvent('pointerdown');
  await hold.dispatchEvent('pointerdown');
  await hold.dispatchEvent('pointerup');
  await page.waitForTimeout(3600);
  if (await page.locator('.parents h2').count()) fail('gate opened without a 3-second hold');
  console.log('✓ gate needs a real hold with two fingers');
  await page.close();
}

// 3. Opening #/parents directly (Back, Forward, reload) shows the gate, not the settings.
{
  const page = await freshPage();
  await page.goto(`${base}#/parents`);
  await page.waitForSelector('.gate .hold');
  if (await page.locator('.parents h2').count()) fail('#/parents skipped the gate');
  console.log('✓ #/parents asks for the hold');
  await page.close();
}

// 4. With sound off, the listen button speaks anyway; a game sound then cuts it off.
//    The caption's "speaking" glow used to stay on after that.
{
  const page = await freshPage();
  await page.goto(`${base}#/play/jonah`);
  await page.waitForSelector('.stage-svg .item');
  await page.click('[data-act=sound]');
  await page.click('[data-act=listen]');
  const wrong = await page.evaluate(() => {
    const want = document.querySelector('.stage-svg').dataset.want;
    return [...document.querySelectorAll('.item:not(.gone)')].find((e) => e.dataset.key !== want)?.dataset.key;
  });
  await tapKey(page, wrong);
  await page.waitForTimeout(800);
  if (await page.locator('.caption.speaking').count()) fail('speaking indicator stuck on');
  console.log('✓ speaking indicator turns off');
  await page.close();
}

// 5. Tapping listen during the prompt game's final praise used to throw.
{
  const page = await freshPage();
  await page.goto(`${base}#/play/jonah`);
  await page.waitForSelector('.stage-svg .item');
  const before = errors.length;
  for (let i = 0; i < 20 && (await page.evaluate(() => location.hash)) === '#/play/jonah'; i++) {
    const want = await page.evaluate(() => document.querySelector('.stage-svg').dataset.want);
    await tapKey(page, want);
    const left = await page.evaluate(() => document.querySelectorAll('.item:not(.gone)').length);
    await page.click('[data-act=listen]').catch(() => {});
    await page.waitForTimeout(left ? 900 : 100);
  }
  if (errors.length > before) fail(`listen button threw: ${errors.slice(before).join(' | ')}`);
  console.log('✓ listen button is safe at the end of a prompt game');
  await page.close();
}

// 6. The reward screen fits short landscape phones, even with two languages on.
for (const [width, height, lang] of [[667, 375, 'en+es'], [844, 390, 'en+es'], [667, 375, 'en+he'], [667, 375, 'es+he']]) {
  const page = await freshPage({ width, height });
  await page.goto(`${base}#/`);
  await page.evaluate((lang) => localStorage.setItem('tsp:v1', JSON.stringify({ ...JSON.parse(localStorage.getItem('tsp:v1') || '{}'), lang })), lang);
  await page.goto(`${base}#/yay/joseph`);
  await page.waitForSelector('.reward .row');
  await page.waitForTimeout(1100); // star-in animation
  const box = await page.evaluate(() => {
    const top = document.querySelector('.reward .big-star').getBoundingClientRect().top;
    const bottom = Math.max(...[...document.querySelectorAll('.reward .row > *')].map((b) => b.getBoundingClientRect().bottom));
    return { top, bottom, h: innerHeight };
  });
  if (box.top < 0 || box.bottom > box.h) fail(`reward clipped at ${width}x${height} in ${lang}: ${JSON.stringify(box)}`);
  await page.close();
}
console.log('✓ reward screen fits short landscape phones');

await browser.close();
server.close();
if (errors.length) {
  console.error('Page errors:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('All regression checks passed.');
