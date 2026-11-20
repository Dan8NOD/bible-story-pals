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
  await page.goto(`${base}#/play/baptism`);
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
  while ((await page.evaluate(() => location.hash)) === '#/play/baptism') {
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

// 6. The reward screen fits short landscape phones, even with both languages.
for (const [width, height] of [[667, 375], [844, 390]]) {
  const page = await freshPage({ width, height });
  await page.goto(`${base}#/`);
  await page.evaluate(() => localStorage.setItem('bsp:v1', JSON.stringify({ ...JSON.parse(localStorage.getItem('bsp:v1') || '{}'), lang: 'both' })));
  await page.goto(`${base}#/yay/baptism`);
  await page.waitForSelector('.reward .row');
  await page.waitForTimeout(1100); // star-in animation
  const box = await page.evaluate(() => {
    const top = document.querySelector('.reward .big-star').getBoundingClientRect().top;
    const bottom = Math.max(...[...document.querySelectorAll('.reward .row > *')].map((b) => b.getBoundingClientRect().bottom));
    return { top, bottom, h: innerHeight };
  });
  if (box.top < 0 || box.bottom > box.h) fail(`reward clipped at ${width}x${height}: ${JSON.stringify(box)}`);
  await page.close();
}
console.log('✓ reward screen fits short landscape phones');

// 7. On a phone held sideways the star counter sat on things to tap and took the taps itself.
//    On a Galaxy S23+ the fifth lion in Daniel's game was wholly under it, so the game never ended.
//    The third number is the status bar's height, which pushes the counter further down the picture.
const PHONES = [[832, 384, 29], [667, 375, 0], [852, 393, 0], [1024, 600, 0]];
for (const [width, height, statusBar] of PHONES) {
  const page = await freshPage({ width, height });
  await page.goto(`${base}#/`);
  await page.addStyleTag({ content: `:root { --safe-t: ${statusBar}px; }` });
  const ids = await page.evaluate(async () => (await import('/js/stories.js')).STORIES.map((s) => s.id));
  for (const id of ids) {
    await page.goto(`${base}#/play/${id}`);
    await page.waitForFunction(() => document.querySelector('.counter')?.children.length > 0);
    const hidden = await page.evaluate(() => {
      const c = document.querySelector('.counter').getBoundingClientRect();
      const N = 9;
      return [...document.querySelectorAll('.stage-svg .item')].filter((el) => {
        const r = el.getBoundingClientRect();
        for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) {
          const x = r.left + ((a + 0.5) * r.width) / N, y = r.top + ((b + 0.5) * r.height) / N;
          const under = x >= c.left && x <= c.right && y >= c.top && y <= c.bottom;
          if (under && document.elementsFromPoint(x, y).some((e) => e.closest('.item') === el)) return true;
        }
        return false;
      }).length;
    });
    if (hidden) fail(`${id} at ${width}x${height}: the star counter covers ${hidden} thing(s) to tap`);
    // Beside the picture the stars must stay in the strip: clear of the picture, the bar and the edges.
    const out = await page.evaluate(() => {
      const el = document.querySelector('.counter');
      if (!el.classList.contains('side')) return '';
      const c = el.getBoundingClientRect();
      const stage = document.querySelector('.stage').getBoundingClientRect();
      const picture = stage.left + (stage.width - Math.min(stage.width, (stage.height * 1000) / 600)) / 2;
      const ok = c.left >= 0 && c.right <= picture - 5 && c.bottom <= stage.bottom - 5;
      return ok ? '' : `${Math.round(c.left)}–${Math.round(c.right)} across, down to ${Math.round(c.bottom)}`;
    });
    if (out) fail(`${id} at ${width}x${height}: the star counter leaves its strip (${out})`);
  }
  await page.close();
}
console.log('✓ star counter stays off the things to tap on phones');

{
  // Eight stars in one column down a Galaxy S23+ were 19 px each. They stand two by two instead.
  const page = await freshPage({ width: 832, height: 384 });
  await page.goto(`${base}#/`);
  await page.addStyleTag({ content: ':root { --safe-t: 29px; }' });
  for (const id of ['creation', 'noah', 'loaves', 'bigcatch']) {
    await page.goto(`${base}#/play/${id}`);
    await page.waitForFunction(() => document.querySelector('.counter')?.children.length > 0);
    const star = await page.evaluate(() => Math.min(...[...document.querySelector('.counter').children].map((s) => s.getBoundingClientRect().width)));
    if (star < 28) fail(`${id} on a phone: the stars are only ${Math.round(star)} px wide`);
  }
  await page.close();
}
console.log('✓ stars stay big on a phone when there are many');

{
  // Real clicks, so a tap that the counter swallowed would leave a lion awake.
  const page = await freshPage({ width: 832, height: 384 });
  await page.goto(`${base}#/`);
  await page.addStyleTag({ content: ':root { --safe-t: 29px; }' });
  await page.goto(`${base}#/play/daniel`);
  await page.waitForSelector('.stage-svg .item');
  for (let i = 0; i < 5; i++) {
    const at = await page.evaluate(() => {
      const el = document.querySelector('.stage-svg .item:not(.gone)');
      const r = el?.getBoundingClientRect();
      return r && { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    if (at) await page.mouse.click(at.x, at.y);
  }
  await page.waitForFunction(() => location.hash === '#/yay/daniel', null, { timeout: 5000 })
    .catch(() => fail('Daniel\'s game did not finish on a phone-sized screen'));
  await page.close();

  // Where the counter still runs across the top (tablets), a tap on it reaches the game.
  const tablet = await freshPage({ width: 1280, height: 800 });
  await tablet.goto(`${base}#/play/creation`);
  await tablet.waitForFunction(() => document.querySelector('.counter')?.children.length > 0);
  const swallowed = await tablet.evaluate(() => {
    const c = document.querySelector('.counter').getBoundingClientRect();
    return !!document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2)?.closest('.counter');
  });
  if (swallowed) fail('the star counter takes taps meant for the game');
  await tablet.close();
}
console.log('✓ Daniel\'s game can be finished on a phone, and the counter never takes a tap');

await browser.close();
server.close();
if (errors.length) {
  console.error('Page errors:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('All regression checks passed.');
