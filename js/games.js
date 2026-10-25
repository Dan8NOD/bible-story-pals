// Mini-games. Each game draws into an <svg> on a 1000x600 stage and calls
// ctx.done() when the child finishes. Nobody can lose: wrong taps only wiggle.

import { ART, bg, place } from './art.js';
import { speak, sfx } from './audio.js';
import { COUNT, PRAISE, UI, pick } from './i18n.js';

const SVGNS = 'http://www.w3.org/2000/svg';
const cap = (w) => w[0].toUpperCase() + w.slice(1);
export const countWord = (n) => ({ en: `${cap(COUNT.en[n - 1])}!`, es: `¡${cap(COUNT.es[n - 1])}!` });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function toSvgPoint(svg, e) {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

// Restart a one-shot CSS animation class on an element.
function replay(el, cls) {
  el.classList.remove(cls);
  void el.getBoundingClientRect();
  el.classList.add(cls);
  const end = (e) => {
    if (e.target !== el) return;
    el.classList.remove(cls);
    el.removeEventListener('animationend', end);
  };
  el.addEventListener('animationend', end);
}

function tween(dur, fn) {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      fn(t);
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function itemMarkup(it, i, inner) {
  return `<g class="tap item" data-i="${i}"${it.key ? ` data-key="${it.key}"` : ''} transform="translate(${it.x} ${it.y}) scale(${it.s || 1})">` +
    `<circle r="62" fill="transparent"/><g class="${it.anim ? 'a-' + it.anim : ''}" style="animation-delay:${(-i * 0.37).toFixed(2)}s">${inner}</g></g>`;
}

/* ---------------- collect: fly / reveal / transform ---------------- */

function collectGame(cfg, ctx) {
  const { svg } = ctx;
  const decor = (cfg.decor || []).map((d) => place(...d)).join('');
  const target = cfg.target ? `<g id="target">${place(...cfg.target)}</g>` : '';
  const items = cfg.items.map((it, i) => {
    const inner = cfg.mode === 'reveal' ? `<g class="a-pulse">${ART.sparkle()}</g>` : ART[it.art](it.opts || {});
    return itemMarkup(cfg.mode === 'reveal' ? { ...it, s: 1, anim: '' } : it, i, inner);
  }).join('');
  svg.innerHTML = bg(cfg.bg) + decor + target + items;

  const total = cfg.items.length;
  let got = 0;
  ctx.counter(0, total);

  svg.querySelectorAll('.item').forEach((el) => {
    el.addEventListener('pointerdown', async (e) => {
      e.preventDefault();
      if (el.classList.contains('gone')) return;
      el.classList.add('gone');
      const it = cfg.items[+el.dataset.i];
      got++;
      ctx.counter(got, total);

      if (cfg.mode === 'reveal') {
        sfx.pop();
        el.setAttribute('transform', `translate(${it.x} ${it.y}) scale(${it.s || 1})`);
        el.innerHTML = `<g class="a-pop"><g class="${it.anim ? 'a-' + it.anim : ''}">${ART[it.art](it.opts || {})}</g></g>`;
        speak(it.word);
      } else if (cfg.mode === 'transform') {
        sfx.ding();
        el.innerHTML = `<g class="a-pop">${ART[it.art]({ ...(it.opts || {}), ...it.after })}</g>`;
        speak(countWord(got));
      } else {
        sfx.whoosh();
        sfx.count(got);
        speak(countWord(got));
        const [tx, ty] = cfg.targetPoint;
        const s0 = it.s || 1;
        await tween(650, (t) => {
          const k = ease(t);
          const x = it.x + (tx - it.x) * k;
          const y = it.y + (ty - it.y) * k - Math.sin(Math.PI * t) * 140;
          el.setAttribute('transform', `translate(${x} ${y}) scale(${s0 * (1 - 0.75 * k)})`);
        });
        el.style.display = 'none';
        const tg = svg.querySelector('#target > .place > g');
        if (tg) replay(tg, 'a-wiggle');
        sfx.pop();
      }

      if (got === total && ctx.alive()) {
        await sleep(1100);
        if (ctx.alive()) ctx.done();
      }
    });
  });
}

/* ---------------- prompt: "tap the red one" / "tap number 3" ---------------- */

function promptGame(cfg, ctx) {
  const { svg } = ctx;
  const decor = (cfg.decor || []).map((d) => place(...d)).join('');
  const items = cfg.items.map((it, i) => itemMarkup(it, i, ART[it.art](it.opts || {}))).join('');
  svg.innerHTML = bg(cfg.bg) + decor + `<g id="links"></g>` + items;

  let rounds = cfg.rounds;
  if (cfg.shuffleRounds) rounds = shuffle(rounds).slice(0, cfg.maxRounds || 5);
  let r = 0;
  let busy = false;
  let prev = null;
  ctx.counter(0, rounds.length);

  const ask = () => {
    svg.dataset.want = rounds[r].key;
    ctx.caption(rounds[r].say);
    speak(rounds[r].say);
  };
  ctx.setReplay(ask);

  svg.querySelectorAll('.item').forEach((el) => {
    el.addEventListener('pointerdown', async (e) => {
      e.preventDefault();
      if (busy || el.classList.contains('gone')) return;
      const it = cfg.items[+el.dataset.i];
      const inner = el.lastElementChild;
      if (it.key !== rounds[r].key) {
        sfx.boing();
        replay(inner, 'a-shake');
        speak(UI.tryAgain);
        return;
      }
      busy = true;
      el.classList.add('gone');
      r++;
      ctx.counter(r, rounds.length);
      if (cfg.keep) {
        sfx.ding();
        el.innerHTML = `<circle r="70" fill="#fff59d" opacity=".35"/><g class="a-pop"><g class="a-twinkle">${ART[it.art]({ ...(it.opts || {}), color: '#ffd54f' })}</g></g>`;
      } else {
        sfx.pop();
        await tween(260, (t) => el.setAttribute('transform', `translate(${it.x} ${it.y}) scale(${(it.s || 1) * (1 + t * 0.6)})`));
        el.style.opacity = '0';
      }
      if (cfg.connect && prev) {
        const line = document.createElementNS(SVGNS, 'line');
        line.setAttribute('x1', prev.x); line.setAttribute('y1', prev.y);
        line.setAttribute('x2', it.x); line.setAttribute('y2', it.y);
        line.setAttribute('stroke', '#fff59d');
        line.setAttribute('stroke-width', '6');
        line.setAttribute('stroke-dasharray', '4 14');
        line.setAttribute('stroke-linecap', 'round');
        svg.querySelector('#links').appendChild(line);
      }
      prev = it;
      if (r >= rounds.length) {
        await speak(pick(PRAISE));
        if (ctx.alive()) ctx.done();
        return;
      }
      await speak(pick(PRAISE));
      if (!ctx.alive()) return;
      busy = false;
      ask();
    });
  });
  ask();
}

/* ---------------- steer: float baby Moses down the river ---------------- */

function steerGame(cfg, ctx) {
  const { svg } = ctx;
  const L = 280, R = 720;
  let banks = '';
  [[120, 80], [880, 160], [110, 300], [890, 420], [130, 520]].forEach(([x, y], i) => {
    banks += place(i % 2 ? 'palm' : 'reeds', x, y, i % 2 ? 1.2 : 1.3, {}, 'sway');
  });
  let ripples = '';
  for (let i = 0; i < 12; i++) {
    ripples += `<path d="M${L + 40 + (i % 3) * 140} ${i * 60} q15 -10 30 0 t30 0" fill="none" stroke="#bfe3fb" stroke-width="5" stroke-linecap="round"/>`;
  }
  svg.innerHTML =
    `<rect x="-3000" y="-3000" width="7000" height="7000" fill="#8bc34a"/>` +
    `<rect x="${L - 20}" y="-3000" width="${R - L + 40}" height="7000" fill="#4fa3e0"/>` +
    `<rect x="${L - 20}" y="-3000" width="10" height="7000" fill="#81c4f0"/><rect x="${R + 10}" y="-3000" width="10" height="7000" fill="#81c4f0"/>` +
    `<g id="ripples">${ripples}</g>` + banks +
    `<g id="objs"></g>` +
    `<g id="basket" transform="translate(500 470)"><g id="basket-in">${ART.basketBoat()}</g></g>` +
    `<g id="princess" style="display:none">${place('person', 860, 440, 1.2, { crown: true, robe: '#f8bbd0', hair: '#212121', sash: '#ffd54f', arms: 'up' }, 'hop')}</g>`;

  const objsG = svg.querySelector('#objs');
  const basket = svg.querySelector('#basket');
  const basketIn = svg.querySelector('#basket-in');
  const ripplesG = svg.querySelector('#ripples');
  let bx = 500, tx = 500, got = 0, spawnT = 0.4, last = performance.now(), flow = 0, finished = false, n = 0;
  const objs = [];
  const SPEED = 165;
  ctx.counter(0, cfg.goal);

  const steer = (e) => {
    const p = toSvgPoint(svg, e);
    tx = Math.max(L + 30, Math.min(R - 30, p.x));
  };
  svg.addEventListener('pointerdown', (e) => { e.preventDefault(); steer(e); });
  svg.addEventListener('pointermove', (e) => { if (e.buttons || e.pointerType === 'touch') steer(e); });
  const onKey = (e) => {
    if (e.key === 'ArrowLeft') tx = Math.max(L + 30, tx - 90);
    if (e.key === 'ArrowRight') tx = Math.min(R - 30, tx + 90);
  };
  window.addEventListener('keydown', onKey);
  ctx.onCleanup(() => window.removeEventListener('keydown', onKey));

  function spawn() {
    // Mostly flowers, and never two rocks in a row, so it always feels winnable.
    const prevRock = objs.length && objs[objs.length - 1].kind === 'rock';
    const kind = !prevRock && n++ % 3 === 2 ? 'rock' : 'lily';
    const x = L + 50 + Math.random() * (R - L - 100);
    const g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('data-kind', kind);
    g.innerHTML = kind === 'lily' ? `<g class="a-bob">${ART.lily()}</g>` : ART.rock({ color: '#8d8d8d' });
    objsG.appendChild(g);
    objs.push({ g, x, y: -60, kind, hit: false, s: kind === 'lily' ? 1 : 0.8 });
  }

  async function win() {
    finished = true;
    sfx.tada();
    svg.querySelector('#princess').style.display = '';
    await sleep(1800);
    if (ctx.alive()) ctx.done();
  }

  function frame(now) {
    if (!ctx.alive()) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    bx += (tx - bx) * Math.min(1, dt * 7);
    basket.setAttribute('transform', `translate(${bx.toFixed(1)} 470)`);
    flow = (flow + SPEED * 0.6 * dt) % 60;
    ripplesG.setAttribute('transform', `translate(0 ${flow.toFixed(1)})`);
    if (!finished) {
      spawnT -= dt;
      if (spawnT <= 0) { spawn(); spawnT = 1.15; }
    }
    for (let i = objs.length - 1; i >= 0; i--) {
      const o = objs[i];
      o.y += SPEED * dt;
      o.g.setAttribute('transform', `translate(${o.x.toFixed(1)} ${o.y.toFixed(1)}) scale(${o.s})`);
      if (!o.hit && !finished && Math.abs(o.x - bx) < 70 && Math.abs(o.y - 465) < 45) {
        o.hit = true;
        if (o.kind === 'lily') {
          got++;
          sfx.count(got);
          speak(countWord(got));
          ctx.counter(got, cfg.goal);
          o.g.remove();
          objs.splice(i, 1);
          if (got >= cfg.goal) win();
          continue;
        }
        sfx.bump();
        replay(basketIn, 'a-wiggle');
        o.x += o.x < bx ? -60 : 60;
      }
      if (o.y > 720) { o.g.remove(); objs.splice(i, 1); }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

export function startGame(cfg, ctx) {
  if (cfg.type === 'collect') return collectGame(cfg, ctx);
  if (cfg.type === 'prompt') return promptGame(cfg, ctx);
  if (cfg.type === 'steer') return steerGame(cfg, ctx);
  throw new Error(`Unknown game type ${cfg.type}`);
}

