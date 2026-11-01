import { STORIES, byId } from './stories.js';
import { sceneSVG, place, ART, INK } from './art.js';
import { speak, stopSpeaking, sfx, onSpeaking, unlockAudio } from './audio.js';
import { store, langs } from './store.js';
import { UI, PRAISE, pick } from './i18n.js';
import { startGame } from './games.js';
import { DONATE_URL } from './config.js';

const app = document.getElementById('app');

/* ---------------- icons ---------------- */
const ic = (d, extra = '') => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}${extra}</svg>`;
const ICON = {
  home: ic('<path d="M7 23 L24 8 L41 23"/><path d="M12 20 V40 H36 V20"/><path d="M20 40 V29 H28 V40"/>'),
  left: ic('<path d="M30 9 L15 24 L30 39"/>'),
  right: ic('<path d="M18 9 L33 24 L18 39"/>'),
  speaker: ic('<path d="M8 19 H15 L25 10 V38 L15 29 H8 Z" fill="currentColor"/><path d="M31 17 Q36 24 31 31"/><path d="M36 12 Q45 24 36 36"/>'),
  mute: ic('<path d="M8 19 H15 L25 10 V38 L15 29 H8 Z" fill="currentColor"/><path d="M32 18 L42 30 M42 18 L32 30"/>'),
  replay: ic('<path d="M38 24 A14 14 0 1 1 33 13"/><path d="M34 5 V14 H25"/>'),
  play: ic('<path d="M15 9 L38 24 L15 39 Z" fill="currentColor"/>'),
  lock: ic('<rect x="10" y="21" width="28" height="20" rx="4"/><path d="M16 21 V15 A8 8 0 0 1 32 15 V21"/>'),
};
const starIcon = (fill = '#ffd54f') => `<svg viewBox="-50 -50 100 100" aria-hidden="true">${ART.star({ color: fill })}</svg>`;
const logo = () => `<svg viewBox="-62 -62 124 124" aria-hidden="true"><circle r="58" fill="#ffd54f" stroke="${INK}" stroke-width="4"/>${place('sheep', 0, -2, 0.95)}</svg>`;

/* ---------------- text helpers ---------------- */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const t = (entry) => entry[langs()[0]];
const lines = (entry) => langs().map((l) => `<div class="line ${l}" lang="${l}">${esc(entry[l])}</div>`).join('');
const titleHTML = (entry) => {
  const [a, b] = langs();
  return `${esc(entry[a])}${b ? `<small lang="${b}">${esc(entry[b])}</small>` : ''}`;
};

/* ---------------- router ---------------- */
let cleanups = [];
let generation = 0;
// The current screen lives in `current`, mirrored into the URL when the host allows it,
// so routing still works inside sandboxed viewers that ignore hash changes.
let current = location.hash;
function go(hash) {
  current = hash;
  try { if (location.hash !== hash) history.pushState(null, '', hash); } catch { /* sandboxed */ }
  route();
}

function route() {
  cleanups.forEach((fn) => { try { fn(); } catch { /* ignore */ } });
  cleanups = [];
  generation++;
  stopSpeaking();
  document.documentElement.lang = langs()[0];
  const parts = current.replace(/^#\/?/, '').split('/');
  const story = byId(parts[1]);
  if (parts[0] === 'story' && story) return storyScreen(story, Math.max(0, Math.min(story.pages.length - 1, +parts[2] || 0)));
  if (parts[0] === 'play' && story) return gameScreen(story);
  if (parts[0] === 'yay' && story) return rewardScreen(story);
  if (parts[0] === 'parents') return parentsScreen();
  return homeScreen();
}
const fromUrl = () => { if (location.hash !== current) { current = location.hash; route(); } };
window.addEventListener('hashchange', fromUrl);
window.addEventListener('popstate', fromUrl);

function speakingCaption(el) {
  cleanups.push(onSpeaking((on) => el.classList.toggle('speaking', on)));
}

function soundButton() {
  const on = store.get('narration') || store.get('sfx');
  return `<button class="icon-btn small" data-act="sound" aria-label="${esc(t(UI.sound))}" aria-pressed="${on}">${on ? ICON.speaker : ICON.mute}</button>`;
}

function wireSound(root) {
  root.querySelector('[data-act=sound]')?.addEventListener('click', (e) => {
    const on = !(store.get('narration') || store.get('sfx'));
    store.set('narration', on);
    store.set('sfx', on);
    if (!on) stopSpeaking();
    e.currentTarget.outerHTML = soundButton();
    wireSound(root);
  });
}

/* ---------------- home: island map ---------------- */
// Stories sit on a path that snakes across an island: 4 stops per row on wide
// screens, 2 per row on portrait phones. Both maps are drawn and CSS shows the
// one that fits, so rotating the device needs no re-render.
const LAYOUTS = {
  wide: { cols: 4, w: 1000, x0: 140, dx: 240, y0: 160, dy: 250 },
  tall: { cols: 2, w: 600, x0: 165, dx: 270, y0: 195, dy: 275 },
};
const PAL = { robe: '#f48fb1', hair: '#5d4037', sash: '#ffd54f' };
const r = Math.round;
const pct = (v, total) => `${((v / total) * 100).toFixed(2)}%`;

function mapLayout({ cols, w, x0, dx, y0, dy }, n) {
  const rows = Math.ceil(n / cols);
  const pts = Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / cols);
    const col = row % 2 ? cols - 1 - (i % cols) : i % cols;
    return [x0 + col * dx, y0 + row * dy + (col % 2 ? 14 : -6)];
  });
  return { w, h: y0 + (rows - 1) * dy + 180, pts };
}

// Catmull-Rom curve through the points, written as cubic Béziers.
function smooth(pts, closed = false) {
  const n = pts.length;
  const at = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${at(0).map(r).join(' ')}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1.map(r).join(' ')} ${c2.map(r).join(' ')} ${p2.map(r).join(' ')}`;
  }
  return closed ? `${d}Z` : d;
}

// A squarish island with a gently wobbling coast.
function coast(w, h) {
  const pts = [];
  for (let k = 0; k < 32; k++) {
    const a = (k / 32) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const wob = 1 + 0.025 * Math.sin(a * 5) + 0.02 * Math.sin(a * 9 + 1);
    pts.push([w / 2 + Math.sign(c) * Math.abs(c) ** 0.5 * (w / 2 - 34) * wob, h / 2 + Math.sign(s) * Math.abs(s) ** 0.5 * (h / 2 - 30) * wob]);
  }
  return smooth(pts, true);
}

// Seeded so the trees stay put between visits.
function scatter({ w, h, pts }, count, seed, clear) {
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const xs = pts.map((p) => p[0]);
  const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
  const out = [];
  for (let k = 0; k < 400 && out.length < count; k++) {
    const x = 60 + rnd() * (w - 120);
    const y = 60 + rnd() * (h - 120);
    const nx = (x - w / 2) / (w / 2 - 70);
    const ny = (y - h / 2) / (h / 2 - 70);
    if (nx ** 4 + ny ** 4 > 1) continue;
    if (clear) {
      if (x < minX + 50 || x > maxX - 50) continue; // the path turns around out there
      if (y < pts[0][1]) continue; // keep the title clear
      if (pts.some(([px, py]) => Math.abs(y - py) < 48 || (Math.abs(x - px) < 115 && y - py > -90 && y - py < 175))) continue;
      if (out.some(([ox, oy]) => Math.hypot(ox - x, oy - y) < 70)) continue;
    }
    out.push([x, y]);
  }
  return out;
}

function mapArt(L, cls) {
  const { w, h, pts } = L;
  const shore = coast(w, h);
  const inland = `translate(${w / 2} ${h / 2}) scale(${(1 - 44 / w).toFixed(3)} ${(1 - 44 / h).toFixed(3)}) translate(${-w / 2} ${-h / 2})`;
  const wave = (x, y) => `<path d="M${r(x - 34)} ${r(y)} q17 -14 34 0 q17 -14 34 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>`;
  const waves = [[0.06, 0.05], [0.93, 0.06], [0.05, 0.95], [0.94, 0.95], [0.03, 0.5], [0.97, 0.45]].map(([x, y]) => wave(x * w, y * h)).join('');
  const patches = scatter(L, 6, 11, false).map(([x, y]) => `<circle cx="${r(x)}" cy="${r(y)}" r="80" fill="#8ccc70" opacity=".55"/>`).join('');
  const trees = scatter(L, cls === 'wide' ? 10 : 8, 5, true).map(([x, y]) => `<g transform="translate(${r(x)} ${r(y)})"><rect x="-3" y="6" width="6" height="16" rx="2" fill="#8d5a3b"/><circle r="17" fill="#43a047"/><circle cx="5" cy="-6" r="8" fill="#66bb6a"/></g>`).join('');
  const path = smooth(pts);
  return `<svg class="map-art ${cls}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
    ${waves}
    <path d="${shore}" fill="#f7e3a3" stroke="#fff3cf" stroke-width="6"/>
    <path d="${shore}" fill="#9ad77f" transform="${inland}"/>
    ${patches}
    <path d="${path}" fill="none" stroke="#e3c08a" stroke-width="30" stroke-linecap="round"/>
    <path d="${path}" fill="none" stroke="#fbe7bd" stroke-width="22" stroke-linecap="round"/>
    <path d="${path}" fill="none" stroke="#dcb376" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 26"/>
    ${trees}
  </svg>`;
}

// The story's cover scene, cropped to a square around its characters.
function coverDisc(s) {
  const scene = s.pages[s.cover].scene;
  const xs = (scene.items || []).filter((it) => !['raw', 'sun', 'moon', 'cloud', 'sparkle'].includes(it[0])).map((it) => it[1]);
  const cx = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 500;
  const x = r(Math.max(260, Math.min(740, cx)) - 260);
  return sceneSVG(scene, { cls: 'still' }).replace('viewBox="0 0 1000 600"', `viewBox="${x} 60 520 520"`);
}

function homeScreen() {
  const wide = mapLayout(LAYOUTS.wide, STORIES.length);
  const tall = mapLayout(LAYOUTS.tall, STORIES.length);
  // The pal waits at the first story without a star.
  const here = Math.max(0, STORIES.findIndex((s) => !store.hasStar(s.id)));
  const stops = STORIES.map((s, i) => {
    const done = store.hasStar(s.id);
    const [wx, wy] = wide.pts[i];
    const [tx, ty] = tall.pts[i];
    const pos = `--wx:${pct(wx, wide.w)};--wy:${pct(wy, wide.h)};--tx:${pct(tx, tall.w)};--ty:${pct(ty, tall.h)}`;
    const stars = [0, 1, 2].map(() => starIcon(done ? '#ffd54f' : '#fffdf5')).join('');
    return `<button class="stop${done ? ' done' : ''}" data-id="${s.id}" style="${pos};--ring:${s.color};animation-delay:${i * 0.05}s" aria-label="${esc(t(s.title))}">
      ${s.special ? `<span class="ribbon">${esc(t(s.special))}</span>` : ''}
      <span class="disc">${coverDisc(s)}</span>
      ${i === here ? `<svg class="pal" viewBox="-42 -72 84 126" aria-hidden="true">${place('person', 0, 0, 1, PAL, 'hop')}</svg>` : ''}
      <span class="name">${titleHTML(s.title)}</span>
      <span class="stars" aria-hidden="true">${stars}</span>
    </button>`;
  }).join('');
  const heading = langs().map((l) => `<span lang="${l}">${esc(UI.welcome[l])}</span>`).join(' ');
  const lang = store.get('lang');
  app.innerHTML = `<main class="home">
    <div class="home-top">
      <div class="brand">${logo()}<h1>${titleHTML(UI.appName)}</h1></div>
      <div class="top-right">
        <div class="chips" role="group" aria-label="Language / Idioma">
          <button class="chip" data-lang="en" lang="en" aria-pressed="${lang === 'en'}">English</button>
          <button class="chip" data-lang="es" lang="es" aria-pressed="${lang === 'es'}">Español</button>
          <button class="chip" data-lang="both" aria-pressed="${lang === 'both'}">EN + ES</button>
        </div>
        <div class="star-count" aria-label="${store.starCount()} / ${STORIES.length}">${starIcon()}<span>${store.starCount()}/${STORIES.length}</span></div>
        ${soundButton()}
        <button class="icon-btn small" id="parents" aria-label="${esc(t(UI.parents))}">${ICON.lock}</button>
      </div>
    </div>
    <nav class="map" aria-label="${esc(t(UI.welcome))}" style="--wide-ar:${wide.w} / ${wide.h};--wide-r:${(wide.w / wide.h).toFixed(4)};--tall-ar:${tall.w} / ${tall.h}">
      ${mapArt(wide, 'wide')}${mapArt(tall, 'tall')}
      <div class="map-title"><h2>${heading}</h2>${langs().length === 1 ? `<p>${esc(t(UI.tapMap))}</p>` : ''}</div>
      ${stops}
    </nav>
  </main>`;

  wireSound(app);
  app.querySelectorAll('.stop').forEach((c) => c.addEventListener('click', () => {
    sfx.tap();
    go(`#/story/${c.dataset.id}/0`);
  }));
  app.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => {
    store.set('lang', c.dataset.lang);
    sfx.tap();
    route();
    speak(UI.welcome);
  }));
  app.querySelector('#parents').addEventListener('click', parentGate);
}

/* ---------------- story pages ---------------- */
function storyScreen(story, i) {
  const page = story.pages[i];
  const last = i === story.pages.length - 1;
  const dots = story.pages.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
  app.innerHTML = `<section class="screen">
    <div class="stage">${sceneSVG(page.scene)}
      <div class="hud">
        <button class="icon-btn small" data-act="home" aria-label="${esc(t(UI.home))}">${ICON.home}</button>
        <div class="dots" aria-hidden="true">${dots}</div>
        ${soundButton()}
      </div>
    </div>
    <div class="bar">
      <button class="icon-btn" data-act="prev" aria-label="${esc(t(UI.back))}" style="visibility:${i ? 'visible' : 'hidden'}">${ICON.left}</button>
      <div class="caption" aria-live="polite">${lines(page.text)}</div>
      <button class="icon-btn sun" data-act="listen" aria-label="${esc(t(UI.listen))}">${ICON.speaker}</button>
      <button class="icon-btn go" data-act="next" aria-label="${esc(t(last ? UI.play : UI.next))}">${last ? ICON.play : ICON.right}</button>
    </div>
  </section>`;
  const caption = app.querySelector('.caption');
  speakingCaption(caption);
  const prev = () => { if (i > 0) { sfx.page(); go(`#/story/${story.id}/${i - 1}`); } };
  const next = () => {
    sfx.page();
    go(last ? `#/play/${story.id}` : `#/story/${story.id}/${i + 1}`);
  };
  app.querySelector('[data-act=home]').addEventListener('click', () => go('#/'));
  app.querySelector('[data-act=prev]').addEventListener('click', prev);
  app.querySelector('[data-act=next]').addEventListener('click', next);
  app.querySelector('[data-act=listen]').addEventListener('click', () => speak(page.text, { force: true }));
  wireSound(app);

  // Swipe between pages.
  const stage = app.querySelector('.stage');
  let sx = null;
  stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
  stage.addEventListener('pointerup', (e) => {
    if (sx == null) return;
    const dx = e.clientX - sx;
    sx = null;
    if (dx < -70) next();
    else if (dx > 70) prev();
  });

  speak(page.text);
}

/* ---------------- games ---------------- */
function gameScreen(story) {
  const cfg = story.game;
  const prompt = cfg.prompt || { en: '', es: '' };
  app.innerHTML = `<section class="screen">
    <div class="stage"><svg class="stage-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"></svg>
      <div class="hud">
        <button class="icon-btn small" data-act="home" aria-label="${esc(t(UI.home))}">${ICON.home}</button>
        <div class="counter" aria-live="polite"></div>
        ${soundButton()}
      </div>
    </div>
    <div class="bar">
      <div class="caption" aria-live="polite">${lines(prompt)}</div>
      <button class="icon-btn sun" data-act="listen" aria-label="${esc(t(UI.listen))}">${ICON.speaker}</button>
    </div>
  </section>`;
  const gen = generation;
  const caption = app.querySelector('.caption');
  const counterEl = app.querySelector('.counter');
  speakingCaption(caption);
  let replayFn = () => speak(prompt, { force: true });
  app.querySelector('[data-act=home]').addEventListener('click', () => go('#/'));
  app.querySelector('[data-act=listen]').addEventListener('click', () => replayFn());
  wireSound(app);

  let shown = -1;
  const ctx = {
    svg: app.querySelector('.stage-svg'),
    alive: () => gen === generation,
    done: () => { if (gen === generation) go(`#/yay/${story.id}`); },
    caption: (entry) => { caption.innerHTML = lines(entry); },
    setReplay: (fn) => { replayFn = () => fn(); },
    onCleanup: (fn) => cleanups.push(fn),
    counter(n, total) {
      if (shown === -1 || counterEl.children.length !== total) {
        counterEl.innerHTML = Array.from({ length: total }, () => starIcon('#d7d0c8')).join('');
      }
      [...counterEl.children].forEach((el, k) => {
        if (k < n && !el.classList.contains('got')) {
          el.outerHTML = starIcon().replace('<svg', '<svg class="got"');
        }
      });
      shown = n;
    },
  };
  startGame(cfg, ctx);
  if (cfg.prompt) speak(prompt);
}

/* ---------------- reward ---------------- */
function rewardScreen(story) {
  store.giveStar(story.id);
  const idx = STORIES.indexOf(story);
  const nextStory = STORIES[(idx + 1) % STORIES.length];
  app.innerHTML = `<section class="reward">
    <div class="confetti"></div>
    <svg class="big-star" viewBox="-60 -60 120 120" aria-hidden="true">
      <circle r="56" fill="${story.color}" opacity=".55"/>
      ${ART.star({ color: '#ffd54f', mood: 'happy' }).replace('<g ', '<g transform="scale(1.15)" ')}
    </svg>
    <h2>${titleHTML(UI.youEarned)}</h2>
    <p>${langs().map((l) => `<span class="${l}" lang="${l}">${esc(story.lesson[l])}</span>`).join(' ')}</p>
    <div class="row">
      <button class="icon-btn" data-act="home" aria-label="${esc(t(UI.home))}">${ICON.home}</button>
      <button class="icon-btn sun" data-act="again" aria-label="${esc(t(UI.again))}">${ICON.replay}</button>
      <button class="big-btn green" data-act="next">${esc(t(nextStory.title))} ${ICON.right}</button>
    </div>
  </section>`;
  const conf = app.querySelector('.confetti');
  const colors = ['#ef5350', '#ffa726', '#ffee58', '#66bb6a', '#42a5f5', '#ab47bc', '#ffffff'];
  for (let i = 0; i < 70; i++) {
    const p = document.createElement('i');
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = `${2.2 + Math.random() * 2.4}s`;
    p.style.animationDelay = `${Math.random() * 0.8}s`;
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    conf.appendChild(p);
  }
  app.querySelector('[data-act=home]').addEventListener('click', () => go('#/'));
  app.querySelector('[data-act=again]').addEventListener('click', () => go(`#/story/${story.id}/0`));
  app.querySelector('[data-act=next]').addEventListener('click', () => go(`#/story/${nextStory.id}/0`));
  sfx.tada();
  const praise = pick(PRAISE);
  speak([praise, story.lesson]);
}

/* ---------------- grown-ups ---------------- */
function parentGate() {
  const el = document.createElement('div');
  el.className = 'gate';
  const es = langs()[0] === 'es';
  el.innerHTML = `<div class="box" role="dialog" aria-modal="true">
    <h3>${es ? 'Solo para adultos' : 'Grown-ups only'}</h3>
    <p>${es ? 'Mantén presionado el botón por 3 segundos.' : 'Press and hold the button for 3 seconds.'}</p>
    <div class="row" style="display:flex;gap:12px;justify-content:center">
      <button class="big-btn green hold"><span class="fill"></span><span>${es ? 'Mantener' : 'Hold'}</span></button>
      <button class="big-btn" data-act="cancel">✕</button>
    </div>
  </div>`;
  document.body.appendChild(el);
  const fill = el.querySelector('.fill');
  let raf = null;
  let t0 = 0;
  const stop = () => { cancelAnimationFrame(raf); fill.style.transform = 'scaleX(0)'; };
  const tick = (now) => {
    const k = Math.min(1, (now - t0) / 3000);
    fill.style.transform = `scaleX(${k})`;
    if (k >= 1) { el.remove(); go('#/parents'); return; }
    raf = requestAnimationFrame(tick);
  };
  const hold = el.querySelector('.hold');
  hold.addEventListener('pointerdown', (e) => { e.preventDefault(); t0 = performance.now(); raf = requestAnimationFrame(tick); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => hold.addEventListener(ev, stop));
  el.querySelector('[data-act=cancel]').addEventListener('click', () => el.remove());
  el.addEventListener('click', (e) => { if (e.target === el) el.remove(); });
}

const REFS = {
  creation: 'Genesis 1–2 · Génesis 1–2',
  noah: 'Genesis 6–9 · Génesis 6–9',
  moses: 'Exodus 2 · Éxodo 2',
  david: '1 Samuel 17',
  psalm23: 'Psalm 23 · Salmo 23',
  jonah: 'Jonah 1–3 · Jonás 1–3',
  daniel: 'Daniel 6',
  loaves: 'John 6:1–14 · Juan 6:1–14',
  nativity: 'Luke 2:1–20 · Lucas 2:1–20',
  baptism: 'Matthew 3:13–17 · Mateo 3:13–17',
  storm: 'Mark 4:35–41 · Marcos 4:35–41',
  sheep: 'Luke 15:3–7 · Lucas 15:3–7',
};

const PARENT_TEXT = {
  en: {
    title: 'For grown-ups',
    about: 'Bible Story Pals is a bilingual (English & Spanish) Bible story game for children ages 3–6. Every story is read aloud, so no reading is needed. Each story ends with a gentle mini-game that practices counting, colors, numbers and new words.',
    privacy: 'Privacy: no ads, no in-app purchases, no accounts, no tracking. Nothing your child does leaves this device. After the first visit it works offline.',
    supportTitle: 'Support Bible Story Pals',
    support: 'This game is free with no ads. If it blesses your family, a gift helps us make more stories.',
    donate: 'Donate',
    tipsTitle: 'Tips',
    tips: [
      'Choose “EN + ES” to hear every page in both languages.',
      'Pause and ask: “How do you think Noah felt?”',
      'Point to things in the picture and name them together.',
    ],
    settings: 'Settings', narration: 'Read stories aloud', sfx: 'Sound effects', lang: 'Language',
    reset: 'Reset stars', resetAsk: 'Tap again to remove all stars', resetDone: 'Stars reset', storiesTitle: 'Stories & Bible passages', back: 'Back to stories',
    voices: 'Narration uses your device’s built-in voices. For the best Spanish voice, install a Spanish (Mexico or US) voice in your device’s text-to-speech settings.',
  },
  es: {
    title: 'Para adultos',
    about: 'Amiguitos de la Biblia es un juego bilingüe (español e inglés) de historias bíblicas para niños de 3 a 6 años. Todas las historias se leen en voz alta, así que no hace falta saber leer. Cada historia termina con un minijuego que practica contar, los colores, los números y palabras nuevas.',
    privacy: 'Privacidad: sin anuncios, sin compras dentro de la app, sin cuentas y sin rastreo. Nada de lo que hace su hijo sale de este dispositivo. Después de la primera visita funciona sin internet.',
    supportTitle: 'Apoye a Amiguitos de la Biblia',
    support: 'Este juego es gratis y sin anuncios. Si bendice a su familia, una ofrenda nos ayuda a crear más historias.',
    donate: 'Donar',
    tipsTitle: 'Consejos',
    tips: [
      'Elija “EN + ES” para escuchar cada página en los dos idiomas.',
      'Haga una pausa y pregunte: “¿Cómo crees que se sintió Noé?”',
      'Señalen cosas en el dibujo y nómbrenlas juntos.',
    ],
    settings: 'Ajustes', narration: 'Leer las historias en voz alta', sfx: 'Efectos de sonido', lang: 'Idioma',
    reset: 'Borrar estrellas', resetAsk: 'Toque otra vez para borrar todas las estrellas', resetDone: 'Estrellas borradas', storiesTitle: 'Historias y pasajes bíblicos', back: 'Volver a las historias',
    voices: 'La narración usa las voces del dispositivo. Para una mejor voz en español, instale una voz de español (México o EE. UU.) en los ajustes de texto a voz.',
  },
};

// Store apps (Capacitor) must not link out to donations; only the website shows it.
const isNativeApp = () => !!window.Capacitor?.isNativePlatform?.();

function parentsScreen() {
  const P = PARENT_TEXT[langs()[0]];
  const showDonate = DONATE_URL && !isNativeApp();
  const toggle = (key, label) => `<div class="setting"><span>${esc(label)}</span><button class="toggle" role="switch" data-key="${key}" aria-checked="${!!store.get(key)}" aria-label="${esc(label)}"></button></div>`;
  const lang = store.get('lang');
  app.innerHTML = `<main class="parents"><div class="inner">
    <button class="link-btn" data-act="home">‹ ${esc(P.back)}</button>
    <h2>${esc(P.title)}</h2>
    <p>${esc(P.about)}</p>
    <p><strong>${esc(P.privacy)}</strong></p>
    ${showDonate ? `<h3>${esc(P.supportTitle)}</h3><p>${esc(P.support)}</p>
      <p><a class="big-btn green" href="${esc(DONATE_URL)}" target="_blank" rel="noopener">${esc(P.donate)}</a></p>` : ''}
    <h3>${esc(P.settings)}</h3>
    ${toggle('narration', P.narration)}
    ${toggle('sfx', P.sfx)}
    <div class="setting"><span>${esc(P.lang)}</span>
      <div class="chips">
        <button class="chip" data-lang="en" aria-pressed="${lang === 'en'}">English</button>
        <button class="chip" data-lang="es" aria-pressed="${lang === 'es'}">Español</button>
        <button class="chip" data-lang="both" aria-pressed="${lang === 'both'}">EN + ES</button>
      </div>
    </div>
    <p>${esc(P.voices)}</p>
    <h3>${esc(P.tipsTitle)}</h3>
    <ul>${P.tips.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <h3>${esc(P.storiesTitle)}</h3>
    <ul>${STORIES.map((s) => `<li>${esc(s.title.en)} / ${esc(s.title.es)} — ${esc(REFS[s.id])}</li>`).join('')}</ul>
    <p><button class="link-btn" data-act="reset">${esc(P.reset)}</button></p>
  </div></main>`;
  app.querySelector('[data-act=home]').addEventListener('click', () => go('#/'));
  app.querySelectorAll('.toggle').forEach((b) => b.addEventListener('click', () => {
    const v = !store.get(b.dataset.key);
    store.set(b.dataset.key, v);
    b.setAttribute('aria-checked', v);
  }));
  app.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => { store.set('lang', c.dataset.lang); route(); }));
  // Two taps instead of confirm(), which some app views block.
  const reset = app.querySelector('[data-act=reset]');
  reset.addEventListener('click', () => {
    if (reset.dataset.armed) {
      store.reset();
      reset.textContent = P.resetDone;
      delete reset.dataset.armed;
    } else {
      reset.dataset.armed = '1';
      reset.textContent = P.resetAsk;
    }
  });
}

/* ---------------- boot ---------------- */
unlockAudio();
route();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
