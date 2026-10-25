// Hand-made SVG art. Every piece is drawn around (0,0) and is roughly 100 units
// tall, so scenes can drop it anywhere with translate/scale. Standing things
// have their feet near y=50.

export const INK = '#4a3326';
const LINE = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const wrap = (inner) => `<g ${LINE}>${inner}</g>`;

// Thick limb drawn as an outline stroke with a colored stroke on top.
const limb = (d, color, w = 9) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 5}"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}"/>`;

export function face(cx, cy, k = 1, mood = 'happy') {
  const dx = 8 * k, ey = cy - 2 * k, r = 3.4 * k;
  let eyes;
  if (mood === 'sleep') {
    eyes = `<path d="M${cx - dx - r} ${ey} q${r} ${r * 1.3} ${2 * r} 0 M${cx + dx - r} ${ey} q${r} ${r * 1.3} ${2 * r} 0" fill="none"/>`;
  } else {
    eyes = `<circle cx="${cx - dx}" cy="${ey}" r="${r}" fill="${INK}" stroke="none"/>` +
      `<circle cx="${cx + dx}" cy="${ey}" r="${r}" fill="${INK}" stroke="none"/>` +
      `<circle cx="${cx - dx + r * 0.35}" cy="${ey - r * 0.4}" r="${r * 0.38}" fill="#fff" stroke="none"/>` +
      `<circle cx="${cx + dx + r * 0.35}" cy="${ey - r * 0.4}" r="${r * 0.38}" fill="#fff" stroke="none"/>`;
  }
  const my = cy + 6 * k;
  let mouth = '';
  if (mood === 'happy' || mood === 'sleep') {
    mouth = `<path d="M${cx - 6 * k} ${my} Q${cx} ${my + 7 * k} ${cx + 6 * k} ${my}" fill="none"/>`;
  } else if (mood === 'open') {
    mouth = `<ellipse cx="${cx}" cy="${my + 3 * k}" rx="${5 * k}" ry="${6 * k}" fill="#a3423a"/>`;
  } else if (mood === 'grumpy') {
    mouth = `<path d="M${cx - 6 * k} ${my + 5 * k} Q${cx} ${my} ${cx + 6 * k} ${my + 5 * k}" fill="none"/>` +
      `<path d="M${cx - dx - 5 * k} ${ey - 8 * k} L${cx - dx + 4 * k} ${ey - 5 * k} M${cx + dx + 5 * k} ${ey - 8 * k} L${cx + dx - 4 * k} ${ey - 5 * k}" fill="none"/>`;
  }
  const cheeks = `<circle cx="${cx - dx - 5 * k}" cy="${cy + 4 * k}" r="${3.6 * k}" fill="#ff8a80" opacity=".55" stroke="none"/>` +
    `<circle cx="${cx + dx + 5 * k}" cy="${cy + 4 * k}" r="${3.6 * k}" fill="#ff8a80" opacity=".55" stroke="none"/>`;
  return eyes + mouth + (mood === 'grumpy' ? '' : cheeks);
}

/* ---------------- people ---------------- */

export function person(o = {}) {
  const {
    skin = '#e9b98a', robe = '#5b8def', sash = null, hair = '#4a2f1b', beard = null,
    scarf = null, crown = false, mood = 'happy', arms = 'down', staff = false,
    helmet = false, halo = false, wings = false, bald = false,
  } = o;
  let out = '';
  if (wings) {
    out += `<path d="M-14 -6 C-60 -40 -62 10 -30 30 Z" fill="#fff"/><path d="M14 -6 C60 -40 62 10 30 30 Z" fill="#fff"/>`;
  }
  if (scarf) out += `<path d="M-25 -22 Q-28 -54 0 -54 Q28 -54 25 -22 L24 4 L-24 4 Z" fill="${scarf}"/>`;
  if (staff) out += `<path d="M30 50 L30 -34 Q30 -48 20 -46" fill="none" stroke="${INK}" stroke-width="8"/><path d="M30 50 L30 -34 Q30 -48 20 -46" fill="none" stroke="#a0703f" stroke-width="4"/>`;
  out += `<path d="M-15 -8 Q-20 22 -28 50 L28 50 Q20 22 15 -8 Q0 -2 -15 -8 Z" fill="${robe}"/>`;
  if (sash) out += `<path d="M-19 14 Q0 20 19 14 L20 22 Q0 28 -20 22 Z" fill="${sash}"/>`;
  const armColor = robe;
  if (arms === 'down') {
    out += limb('M-13 -2 Q-24 10 -24 24', armColor) + limb('M13 -2 Q24 10 26 22', armColor);
    out += `<circle cx="-24" cy="27" r="5.5" fill="${skin}"/><circle cx="26" cy="25" r="5.5" fill="${skin}"/>`;
  } else if (arms === 'up') {
    out += limb('M-13 -2 Q-28 -10 -32 -30', armColor) + limb('M13 -2 Q28 -10 32 -30', armColor);
    out += `<circle cx="-32" cy="-33" r="5.5" fill="${skin}"/><circle cx="32" cy="-33" r="5.5" fill="${skin}"/>`;
  } else if (arms === 'pray') {
    out += limb('M-13 -2 Q-18 12 -4 10', armColor) + limb('M13 -2 Q18 12 4 10', armColor);
    out += `<ellipse cx="0" cy="6" rx="5" ry="8" fill="${skin}"/>`;
  } else if (arms === 'hold') {
    out += limb('M-13 -2 Q-22 14 -8 14', armColor) + limb('M13 -2 Q22 14 8 14', armColor);
  }
  out += `<circle cx="0" cy="-26" r="20" fill="${skin}"/>`;
  if (scarf) {
    out += `<path d="M-21 -30 Q0 -48 21 -30 Q0 -40 -21 -30 Z" fill="${scarf}"/>`;
  } else if (!bald && !helmet) {
    out += `<path d="M-20 -26 Q-22 -48 0 -48 Q22 -48 20 -26 Q14 -38 0 -38 Q-14 -38 -20 -26 Z" fill="${hair}"/>`;
  }
  if (helmet) {
    out += `<path d="M-23 -28 Q-24 -56 0 -56 Q24 -56 23 -28 Z" fill="#b0b8c0"/><path d="M-3 -32 L3 -32 L3 -16 L-3 -16 Z" fill="#b0b8c0"/><path d="M0 -56 L0 -64" stroke-width="5"/>`;
  }
  if (beard) {
    out += `<path d="M-19 -24 Q-17 2 0 4 Q17 2 19 -24 Q12 -12 0 -13 Q-12 -12 -19 -24 Z" fill="${beard}"/>`;
  }
  out += face(0, -26, 1, mood);
  if (crown) out += `<path d="M-14 -44 L-14 -58 L-7 -51 L0 -60 L7 -51 L14 -58 L14 -44 Z" fill="#ffd54f"/>`;
  if (halo) out += `<ellipse cx="0" cy="-54" rx="15" ry="4.5" fill="none" stroke="#ffc107" stroke-width="4"/>`;
  return wrap(out);
}

export const angel = (o = {}) => person({ robe: '#ffffff', sash: '#ffd54f', hair: '#f3c26b', wings: true, halo: true, arms: 'up', ...o });

export function baby(o = {}) {
  const { skin = '#e9b98a', blanket = '#9fd3f5', mood = 'sleep' } = o;
  return wrap(`<ellipse cx="6" cy="8" rx="30" ry="15" fill="${blanket}"/><path d="M-6 0 Q10 -4 30 6" fill="none"/>` +
    `<circle cx="-20" cy="2" r="13" fill="${skin}"/><path d="M-32 -2 Q-30 -16 -16 -14" fill="${blanket}"/>` +
    face(-20, 2, 0.6, mood));
}

/* ---------------- animals ---------------- */

export function lion(o = {}) {
  const { mood = 'happy' } = o;
  let out = `<path d="M26 34 Q48 30 44 8" fill="none"/><circle cx="44" cy="6" r="6" fill="#c96f2a"/>`;
  out += `<ellipse cx="0" cy="30" rx="28" ry="21" fill="#f4b942"/>`;
  out += `<ellipse cx="-13" cy="48" rx="10" ry="6" fill="#f4b942"/><ellipse cx="13" cy="48" rx="10" ry="6" fill="#f4b942"/>`;
  let mane = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    mane += `<circle cx="${(Math.cos(a) * 29).toFixed(1)}" cy="${(-10 + Math.sin(a) * 29).toFixed(1)}" r="10" fill="#c96f2a"/>`;
  }
  out += mane + `<circle cx="0" cy="-10" r="30" fill="#c96f2a" stroke="none"/>`;
  out += `<circle cx="-17" cy="-28" r="7" fill="#f4b942"/><circle cx="17" cy="-28" r="7" fill="#f4b942"/>`;
  out += `<circle cx="0" cy="-8" r="22" fill="#f4b942"/><ellipse cx="0" cy="3" rx="11" ry="8" fill="#fde3a7"/>`;
  out += `<path d="M-4 -3 L4 -3 L0 2 Z" fill="#6d3b22"/>`;
  out += face(0, -10, 1, mood === 'roar' ? 'open' : mood);
  if (mood === 'sleep') {
    out += `<text x="26" y="-40" font-size="22" font-weight="800" fill="#7e57c2" stroke="none" font-family="'Baloo 2',sans-serif">z</text>` +
      `<text x="38" y="-56" font-size="16" font-weight="800" fill="#7e57c2" stroke="none" font-family="'Baloo 2',sans-serif">z</text>`;
  }
  return wrap(out);
}

export function elephant() {
  return wrap(
    `<rect x="-24" y="30" width="14" height="20" rx="5" fill="#a7b4c2"/><rect x="10" y="30" width="14" height="20" rx="5" fill="#a7b4c2"/>` +
    `<ellipse cx="0" cy="26" rx="30" ry="20" fill="#a7b4c2"/>` +
    `<ellipse cx="-28" cy="-12" rx="18" ry="22" fill="#a7b4c2"/><ellipse cx="-27" cy="-11" rx="10" ry="14" fill="#f3c1c9" stroke="none"/>` +
    `<ellipse cx="28" cy="-12" rx="18" ry="22" fill="#a7b4c2"/><ellipse cx="27" cy="-11" rx="10" ry="14" fill="#f3c1c9" stroke="none"/>` +
    `<circle cx="0" cy="-12" r="23" fill="#a7b4c2"/>` +
    limb('M0 -2 Q-2 22 12 28', '#a7b4c2', 10) +
    face(0, -18, 0.9, 'quiet'),
  );
}

export function giraffe() {
  let spots = '';
  [[-10, 20], [8, 24], [-2, 12], [14, 0], [16, -20], [10, -10]].forEach(([x, y]) => {
    spots += `<circle cx="${x}" cy="${y}" r="4" fill="#c27b2f" stroke="none"/>`;
  });
  return wrap(
    `<path d="M-14 28 L-16 50 M-4 30 L-4 50 M8 30 L8 50 M18 28 L20 50" stroke-width="6"/>` +
    `<path d="M-14 28 L-16 50 M-4 30 L-4 50 M8 30 L8 50 M18 28 L20 50" stroke="#f6c453" stroke-width="3"/>` +
    `<ellipse cx="2" cy="20" rx="24" ry="13" fill="#f6c453"/>` +
    `<path d="M6 14 L8 -34 L22 -34 L20 14 Z" fill="#f6c453"/>` +
    `<path d="M12 -50 L12 -60 M22 -50 L24 -60" /><circle cx="12" cy="-61" r="3" fill="#c27b2f"/><circle cx="24" cy="-61" r="3" fill="#c27b2f"/>` +
    `<ellipse cx="18" cy="-42" rx="15" ry="11" fill="#f6c453"/>` + spots +
    face(18, -44, 0.6, 'happy'),
  );
}

export function sheep(o = {}) {
  const { mood = 'happy' } = o;
  let wool = '';
  [[-20, 14], [-8, 6], [6, 6], [20, 14], [-18, 28], [0, 30], [18, 28], [0, 16]].forEach(([x, y]) => {
    wool += `<circle cx="${x}" cy="${y}" r="13" fill="#fffaf0"/>`;
  });
  return wrap(
    `<path d="M-14 36 L-14 50 M-4 38 L-4 50 M6 38 L6 50 M16 36 L16 50" stroke-width="5"/>` + wool +
    `<ellipse cx="0" cy="18" rx="24" ry="14" fill="#fffaf0" stroke="none"/>` +
    `<ellipse cx="-17" cy="-6" rx="8" ry="4" fill="#5d4a42" transform="rotate(20 -17 -6)"/><ellipse cx="17" cy="-6" rx="8" ry="4" fill="#5d4a42" transform="rotate(-20 17 -6)"/>` +
    `<ellipse cx="0" cy="-2" rx="12" ry="15" fill="#5d4a42"/>` +
    `<circle cx="-6" cy="-16" r="6" fill="#fffaf0"/><circle cx="2" cy="-18" r="6" fill="#fffaf0"/><circle cx="8" cy="-14" r="5" fill="#fffaf0"/>` +
    (mood === 'sleep'
      ? `<path d="M-8 -3 q3 3 6 0 M2 -3 q3 3 6 0" fill="none" stroke="#fff"/>`
      : `<circle cx="-5" cy="-3" r="3" fill="#fff" stroke="none"/><circle cx="5" cy="-3" r="3" fill="#fff" stroke="none"/><circle cx="-5" cy="-3" r="1.5" fill="${INK}" stroke="none"/><circle cx="5" cy="-3" r="1.5" fill="${INK}" stroke="none"/>`) +
    `<path d="M-3 6 Q0 9 3 6" fill="none" stroke="#fff" stroke-width="2"/>`,
  );
}

export function bunny() {
  return wrap(
    `<ellipse cx="-9" cy="-34" rx="7" ry="20" fill="#f5efe6"/><ellipse cx="-9" cy="-34" rx="3" ry="13" fill="#f8bbd0" stroke="none"/>` +
    `<ellipse cx="9" cy="-34" rx="7" ry="20" fill="#f5efe6"/><ellipse cx="9" cy="-34" rx="3" ry="13" fill="#f8bbd0" stroke="none"/>` +
    `<ellipse cx="0" cy="28" rx="22" ry="22" fill="#f5efe6"/><circle cx="22" cy="36" r="7" fill="#fff"/>` +
    `<circle cx="0" cy="-6" r="18" fill="#f5efe6"/>` + face(0, -6, 0.8, 'happy') +
    `<ellipse cx="-10" cy="48" rx="8" ry="4" fill="#f5efe6"/><ellipse cx="10" cy="48" rx="8" ry="4" fill="#f5efe6"/>`,
  );
}

export function bird(o = {}) {
  const { color = '#64b5f6', branch = false } = o;
  return wrap(
    `<path d="M22 0 L42 -10 L40 8 Z" fill="${color}"/>` +
    `<ellipse cx="0" cy="0" rx="26" ry="18" fill="${color}"/>` +
    `<path d="M-2 -2 Q14 -26 24 -6 Q12 4 -2 -2 Z" fill="#fff" opacity=".85"/>` +
    `<path d="M-26 -4 L-38 0 L-26 5 Z" fill="#ffb300"/>` +
    `<circle cx="-14" cy="-5" r="3" fill="${INK}" stroke="none"/>` +
    (branch ? `<path d="M-38 2 Q-48 10 -54 22" fill="none" stroke="#6d8f3a"/><ellipse cx="-48" cy="12" rx="5" ry="3" fill="#8bc34a"/><ellipse cx="-54" cy="20" rx="5" ry="3" fill="#8bc34a"/>` : ''),
  );
}

export function fish(o = {}) {
  const { color = '#ff8a65' } = o;
  return wrap(
    `<path d="M20 0 L40 -16 L40 16 Z" fill="${color}"/>` +
    `<ellipse cx="0" cy="0" rx="28" ry="18" fill="${color}"/>` +
    `<path d="M-4 -16 Q4 -28 14 -14" fill="${color}"/>` +
    `<path d="M2 -10 Q8 0 2 10" fill="none" opacity=".6"/>` +
    `<circle cx="-14" cy="-4" r="4" fill="${INK}" stroke="none"/><circle cx="-13" cy="-5.5" r="1.4" fill="#fff" stroke="none"/>` +
    `<path d="M-24 6 Q-20 10 -16 7" fill="none"/>`,
  );
}

// The great fish. About 200 wide; optional "window" showing Jonah praying inside.
export function bigFish(o = {}) {
  const { jonah = false, color = '#4f8fd6' } = o;
  let out = `<path d="M70 0 Q100 -40 112 -46 Q104 0 112 46 Q100 40 70 0 Z" fill="${color}"/>` +
    `<path d="M-100 0 Q-96 -56 -10 -58 Q72 -56 80 0 Q72 50 -10 52 Q-96 50 -100 0 Z" fill="${color}"/>` +
    `<path d="M-90 14 Q-10 54 74 12 Q60 46 -10 50 Q-80 48 -90 14 Z" fill="#a9d4f5"/>` +
    `<path d="M-10 -56 Q4 -78 22 -56" fill="${color}"/>` +
    `<circle cx="-62" cy="-18" r="10" fill="#fff"/><circle cx="-60" cy="-18" r="5" fill="${INK}" stroke="none"/>` +
    `<path d="M-98 8 Q-80 22 -60 14" fill="none"/>` +
    `<circle cx="-50" cy="-2" r="7" fill="#ff8a80" opacity=".5" stroke="none"/>` +
    `<path d="M-36 -64 Q-40 -80 -48 -88 M-36 -64 Q-34 -82 -30 -92 M-36 -64 Q-28 -78 -18 -84" fill="none" stroke="#9fd3f5" stroke-width="5"/>`;
  if (jonah) {
    out += `<circle cx="10" cy="-6" r="30" fill="#2c5a8f"/>` +
      `<g transform="translate(10 0) scale(.42)">${person({ robe: '#8d6e63', beard: '#5d4037', arms: 'pray', mood: 'sleep' })}</g>`;
  }
  return wrap(out);
}

/* ---------------- sky & nature ---------------- */

export function sun(o = {}) {
  const { mood = 'happy' } = o;
  let rays = '';
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    rays += `<path d="M${(Math.cos(a) * 42).toFixed(1)} ${(Math.sin(a) * 42).toFixed(1)} L${(Math.cos(a) * 56).toFixed(1)} ${(Math.sin(a) * 56).toFixed(1)}" stroke="#ffb300" stroke-width="7"/>`;
  }
  return wrap(`<g class="a-spin">${rays}</g><circle r="36" fill="#ffd54f"/>` + face(0, 0, 1.3, mood));
}

export const moon = () => wrap(
  `<path d="M10 -40 A40 40 0 1 0 10 40 A60 60 0 0 1 10 -40 Z" fill="#fff3b0"/>` +
  `<path d="M-22 -4 q4 4 8 0" fill="none"/><path d="M-26 10 Q-20 16 -14 10" fill="none"/>`,
);

export function star(o = {}) {
  const { color = '#ffd54f', label = null, mood = null } = o;
  let pts = '';
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 20 : 46, a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts += `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)} `;
  }
  let out = `<polygon points="${pts}" fill="${color}"/>`;
  if (label != null) {
    out += `<text x="0" y="13" text-anchor="middle" font-size="36" font-weight="800" fill="${INK}" stroke="none" font-family="'Baloo 2',sans-serif">${label}</text>`;
  } else if (mood) {
    out += face(0, 2, 0.8, mood);
  }
  return wrap(out);
}

export function sparkle(o = {}) {
  const { color = '#fff59d' } = o;
  return `<g><circle r="34" fill="${color}" opacity=".35"/><path d="M0 -40 Q5 -5 40 0 Q5 5 0 40 Q-5 5 -40 0 Q-5 -5 0 -40 Z" fill="${color}" stroke="#ffb300" stroke-width="3" stroke-linejoin="round"/></g>`;
}

export const cloud = (o = {}) => {
  const { color = '#ffffff', rain = false } = o;
  let drops = '';
  if (rain) {
    for (let i = 0; i < 5; i++) {
      drops += `<path class="a-drop" style="animation-delay:${(-i * 0.23).toFixed(2)}s" d="M${-36 + i * 18} 30 q-4 8 0 12 q4 -4 0 -12 Z" fill="#64b5f6" stroke="#3a7dc0" stroke-width="2"/>`;
    }
  }
  return drops + wrap(`<path d="M-46 20 Q-62 20 -60 4 Q-58 -12 -40 -10 Q-36 -32 -12 -30 Q4 -44 22 -30 Q44 -32 46 -12 Q64 -8 60 8 Q58 20 44 20 Z" fill="${color}"/>`);
};

export function rainbow() {
  const cols = ['#ef5350', '#ffa726', '#ffee58', '#66bb6a', '#42a5f5', '#7e57c2'];
  let out = '';
  cols.forEach((c, i) => {
    const r = 100 - i * 12;
    out += `<path d="M${-r} 50 A${r} ${r} 0 0 1 ${r} 50" fill="none" stroke="${c}" stroke-width="12"/>`;
  });
  return `<g>${out}</g>`;
}

export const tree = (o = {}) => {
  const { fruit = false } = o;
  let f = '';
  if (fruit) [[-14, -24], [12, -36], [18, -10], [-6, -6]].forEach(([x, y]) => (f += `<circle cx="${x}" cy="${y}" r="5" fill="#e53935"/>`));
  return wrap(
    `<path d="M-8 50 L-6 0 L6 0 L8 50 Z" fill="#8d5a33"/>` +
    `<path d="M-36 -6 Q-48 -30 -26 -40 Q-22 -62 0 -60 Q22 -62 26 -40 Q48 -30 36 -6 Q30 8 0 6 Q-30 8 -36 -6 Z" fill="#66bb6a"/>` + f,
  );
};

export const palm = () => wrap(
  `<path d="M-4 50 Q-10 0 2 -40 L10 -40 Q2 0 8 50 Z" fill="#a1744a"/>` +
  `<path d="M6 -42 Q-30 -60 -52 -30 Q-24 -46 6 -38 Z" fill="#43a047"/>` +
  `<path d="M6 -42 Q40 -62 60 -30 Q32 -46 6 -38 Z" fill="#43a047"/>` +
  `<path d="M6 -42 Q-10 -76 -36 -70 Q-10 -62 4 -40 Z" fill="#66bb6a"/>` +
  `<path d="M6 -42 Q22 -78 46 -68 Q22 -62 8 -40 Z" fill="#66bb6a"/>`,
);

export function flower(o = {}) {
  const { color = '#f06292' } = o;
  let p = '';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    p += `<circle cx="${(Math.cos(a) * 12).toFixed(1)}" cy="${(-24 + Math.sin(a) * 12).toFixed(1)}" r="9" fill="${color}"/>`;
  }
  return wrap(`<path d="M0 50 Q-4 10 0 -20" fill="none" stroke="#43a047" stroke-width="5"/><ellipse cx="-10" cy="20" rx="10" ry="5" fill="#66bb6a" transform="rotate(-30 -10 20)"/>` +
    p + `<circle cx="0" cy="-24" r="8" fill="#ffd54f"/>`);
}

export function lily() {
  return wrap(`<ellipse cx="0" cy="10" rx="36" ry="16" fill="#66bb6a"/><path d="M0 10 L34 4" fill="none"/>` +
    `<path d="M-14 0 Q-16 -22 0 -26 Q16 -22 14 0 Q0 6 -14 0 Z" fill="#f8bbd0"/>` +
    `<path d="M-6 0 Q0 -30 6 0 Z" fill="#f48fb1"/><circle cx="0" cy="-2" r="4" fill="#ffd54f"/>`);
}

export const grass = () => wrap(`<path d="M-20 10 Q-18 -10 -12 -16 Q-10 0 -6 4 Q-2 -22 4 -26 Q4 -4 8 2 Q14 -14 20 -16 Q16 0 20 10 Z" fill="#7cb342"/>`);

export const reeds = () => wrap(
  `<path d="M-14 40 Q-16 0 -18 -40 M0 40 Q0 -10 2 -50 M14 40 Q16 0 20 -36" fill="none" stroke="#558b2f" stroke-width="5"/>` +
  `<rect x="-22" y="-52" width="8" height="20" rx="4" fill="#8d6e63"/><rect x="-2" y="-62" width="8" height="20" rx="4" fill="#8d6e63"/><rect x="16" y="-48" width="8" height="20" rx="4" fill="#8d6e63"/>`,
);

export function rock(o = {}) {
  const { color = '#9e9e9e' } = o;
  return wrap(`<path d="M-40 30 Q-46 -6 -20 -20 Q4 -34 26 -16 Q46 -4 40 30 Z" fill="${color}"/><path d="M-20 -6 Q-10 -14 2 -12" fill="none" stroke="#fff" opacity=".6"/>`);
}

export function stone(o = {}) {
  const { color = '#b0bec5' } = o;
  return wrap(`<ellipse cx="0" cy="0" rx="26" ry="18" fill="${color}"/><ellipse cx="-8" cy="-6" rx="8" ry="4" fill="#fff" opacity=".6" stroke="none"/>`);
}

export const bubble = (o = {}) => {
  const { color = '#ef5350' } = o;
  return wrap(`<circle r="42" fill="${color}" opacity=".88"/><ellipse cx="-14" cy="-16" rx="10" ry="6" fill="#fff" opacity=".8" stroke="none" transform="rotate(-35 -14 -16)"/><circle cx="16" cy="18" r="4" fill="#fff" opacity=".6" stroke="none"/>`);
};

export const heart = (o = {}) => wrap(`<path d="M0 30 C-50 0 -30 -40 0 -18 C30 -40 50 0 0 30 Z" fill="${o.color || '#ef5350'}"/>`);

export function bush(o = {}) {
  const { color = '#43a047' } = o;
  let out = '';
  [[-36, 12, 24], [-14, -4, 28], [14, -8, 30], [38, 10, 24]].forEach(([x, y, r]) => {
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
  });
  out += `<path d="M-58 30 Q-62 10 -40 6 L40 6 Q62 10 58 30 Z" fill="${color}"/>`;
  out += `<ellipse cx="0" cy="12" rx="44" ry="18" fill="${color}" stroke="none"/>`;
  out += `<circle cx="-20" cy="2" r="4" fill="#e53935" stroke="none"/><circle cx="18" cy="-10" r="4" fill="#e53935" stroke="none"/><circle cx="30" cy="16" r="4" fill="#e53935" stroke="none"/>`;
  return wrap(out);
}

// Light pouring down from heaven: how the game shows God the Father, who is
// heard as a voice and never drawn as a person. Origin is the top of the beam.
export function heavenLight(o = {}) {
  const { h = 420 } = o;
  return `<g class="a-twinkle" style="animation-duration:5s">` +
    `<path d="M-40 0 L40 0 L170 ${h} L-170 ${h} Z" fill="#fff59d" opacity=".35"/>` +
    `<path d="M-18 0 L18 0 L70 ${h} L-70 ${h} Z" fill="#fffde7" opacity=".55"/></g>`;
}

/* ---------------- objects & places ---------------- */

export function ark() {
  let planks = '';
  for (let i = 0; i < 3; i++) planks += `<path d="M${-86 + i * 4} ${12 + i * 10} L${86 - i * 4} ${12 + i * 10}" fill="none" opacity=".5"/>`;
  return wrap(
    `<path d="M-60 -6 L-60 -46 L60 -46 L60 -6 Z" fill="#d7a86e"/>` +
    `<path d="M-70 -44 L0 -80 L70 -44 Z" fill="#a1683a"/>` +
    `<rect x="-40" y="-36" width="18" height="16" rx="3" fill="#ffe082"/><rect x="22" y="-36" width="18" height="16" rx="3" fill="#ffe082"/>` +
    `<path d="M-10 -6 L-10 -34 Q0 -42 10 -34 L10 -6 Z" fill="#6d4c41"/>` +
    `<path d="M-100 -6 L100 -6 L80 44 L-80 44 Z" fill="#b5793f"/>` + planks,
  );
}

export function boat() {
  return wrap(
    `<path d="M0 -70 L0 0" stroke-width="5"/><path d="M4 -66 L50 -10 L4 -10 Z" fill="#fff8e1"/><path d="M-4 -60 L-40 -10 L-4 -10 Z" fill="#ffe0b2"/>` +
    `<path d="M-70 0 L70 0 L52 30 L-52 30 Z" fill="#a1683a"/><path d="M-62 12 L62 12" fill="none" opacity=".5"/>`,
  );
}

export function basket(o = {}) {
  const { handle = true, color = '#c8914b' } = o;
  return wrap(
    (handle ? `<path d="M-34 -6 Q0 -56 34 -6" fill="none" stroke="${INK}" stroke-width="9"/><path d="M-34 -6 Q0 -56 34 -6" fill="none" stroke="${color}" stroke-width="5"/>` : '') +
    `<path d="M-44 -6 L44 -6 L34 34 L-34 34 Z" fill="${color}"/>` +
    `<path d="M-40 8 L40 8 M-36 22 L36 22 M-20 -6 L-16 34 M0 -6 L0 34 M20 -6 L16 34" fill="none" opacity=".45"/>` +
    `<path d="M-48 -10 L48 -10 L46 -2 L-46 -2 Z" fill="#a8743a"/>`,
  );
}

// Moses' little basket boat on the water.
export function basketBoat() {
  return wrap(
    `<ellipse cx="0" cy="10" rx="54" ry="22" fill="#c8914b"/>` +
    `<ellipse cx="0" cy="2" rx="44" ry="13" fill="#8d5a33"/>` +
    `<path d="M-46 14 Q0 30 46 14" fill="none" opacity=".5"/><path d="M-40 22 Q0 36 40 22" fill="none" opacity=".5"/>`,
  ) + `<g transform="translate(6 -6) scale(.8)">${baby({ blanket: '#fff3e0' })}</g>`;
}

export function bread() {
  return wrap(`<path d="M-30 10 Q-34 -16 0 -18 Q34 -16 30 10 Z" fill="#e0a458"/><path d="M-30 10 L30 10 L28 16 L-28 16 Z" fill="#c8823a"/>` +
    `<path d="M-14 -10 L-8 2 M0 -12 L6 0 M14 -10 L20 2" fill="none" opacity=".6"/>`);
}

export function bag() {
  return wrap(`<path d="M-30 -14 Q-40 30 0 34 Q40 30 30 -14 Z" fill="#a1744a"/><path d="M-30 -14 Q0 -4 30 -14" fill="none"/>` +
    `<path d="M-24 -14 Q-10 -40 20 -30" fill="none" stroke="#6d4c41" stroke-width="5"/>`);
}

export function stable() {
  return wrap(
    `<path d="M-90 50 L-90 -30 L90 -30 L90 50 Z" fill="#8d6e63"/>` +
    `<path d="M-70 50 L-70 -20 L70 -20 L70 50 Z" fill="#5d4037"/>` +
    `<path d="M-110 -26 L0 -76 L110 -26 Z" fill="#a1744a"/>` +
    `<path d="M-60 50 Q0 30 60 50 Z" fill="#ffd54f" opacity=".85"/>`,
  );
}

export function manger() {
  return wrap(
    `<path d="M-40 30 L-30 50 M40 30 L30 50" stroke-width="5"/>` +
    `<path d="M-40 0 L40 0 L30 30 L-30 30 Z" fill="#a1744a"/>` +
    `<path d="M-38 2 L-30 -10 L-20 0 L-10 -12 L0 0 L10 -12 L20 0 L30 -10 L38 2 Z" fill="#ffe082"/>`,
  ) + `<g transform="translate(4 -10) scale(.8)">${baby({ blanket: '#fffde7' })}</g>`;
}

export function cave() {
  return wrap(`<path d="M-150 60 Q-150 -100 0 -100 Q150 -100 150 60 Z" fill="#8d6e63"/><path d="M-100 60 Q-100 -56 0 -56 Q100 -56 100 60 Z" fill="#3e2723"/>`);
}

export function city(o = {}) {
  const { color = '#e6c79c' } = o;
  return wrap(
    `<rect x="-120" y="-40" width="60" height="80" fill="${color}"/><rect x="-60" y="-70" width="44" height="110" fill="${color}"/>` +
    `<rect x="-16" y="-30" width="70" height="70" fill="${color}"/><path d="M-16 -30 Q19 -76 54 -30 Z" fill="#ffb74d"/>` +
    `<rect x="54" y="-56" width="40" height="96" fill="${color}"/><rect x="94" y="-24" width="40" height="64" fill="${color}"/>` +
    `<rect x="-48" y="-52" width="10" height="14" fill="#6d4c41" stroke="none"/><rect x="66" y="-40" width="10" height="14" fill="#6d4c41" stroke="none"/><rect x="-100" y="-20" width="10" height="14" fill="#6d4c41" stroke="none"/><path d="M8 40 L8 12 Q19 0 30 12 L30 40 Z" fill="#6d4c41"/>`,
  );
}

export function hammer() {
  return wrap(`<path d="M-4 40 L-4 -10 L4 -10 L4 40 Z" fill="#a1744a"/><rect x="-22" y="-24" width="44" height="16" rx="4" fill="#90a4ae"/>`);
}

export const waves = (o = {}) => {
  const { color = '#4fa3e0', w = 400 } = o;
  let d = `M${-w / 2} 0`;
  for (let x = -w / 2; x < w / 2; x += 40) d += ` q10 -12 20 0 t20 0`;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`;
};

/* ---------------- backgrounds ---------------- */
// Backgrounds are drawn far past the 1000x600 stage so letterboxing never shows.

const BIG = 'x="-3000" width="7000"';
const grad = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
// Solid color above, gradient across the stage, and the bottom color carried on
// below, so wide screens never see a gap under the gradient.
const sky = (id, a, b, h) => grad(id, a, b) +
  `<rect ${BIG} y="-3000" height="3000" fill="${a}"/><rect ${BIG} y="0" height="${h}" fill="url(#${id})"/><rect ${BIG} y="${h - 1}" height="3000" fill="${b}"/>`;
const hills = (y, c1, c2) =>
  `<path d="M-3000 ${y} L-200 ${y} Q100 ${y - 90} 380 ${y - 10} Q640 ${y - 110} 1000 ${y - 20} Q1200 ${y - 60} 4000 ${y} L4000 3000 L-3000 3000 Z" fill="${c1}"/>` +
  `<rect ${BIG} y="${y + 40}" height="3000" fill="${c2}"/>` +
  `<path d="M-3000 ${y + 40} Q200 ${y + 10} 500 ${y + 40} Q800 ${y + 70} 4000 ${y + 40} Z" fill="${c2}"/>`;

function starsDots(n = 40, seed = 7) {
  let out = '', s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) {
    out += `<circle class="a-twinkle" style="animation-delay:${(-rnd() * 3).toFixed(2)}s" cx="${(rnd() * 1400 - 200).toFixed(0)}" cy="${(rnd() * 380 - 200).toFixed(0)}" r="${(1.5 + rnd() * 2.5).toFixed(1)}" fill="#fffde7"/>`;
  }
  return out;
}

export function bg(kind) {
  switch (kind) {
    case 'dark':
      return grad('g-dark', '#1a1033', '#2e1d4f') + `<rect ${BIG} y="-3000" height="7000" fill="url(#g-dark)"/>`;
    case 'night':
      return sky('g-night', '#14214a', '#3b4d8f', 500) +
        starsDots() + hills(470, '#2e5e3e', '#244d33');
    case 'sea':
      return sky('g-sky', '#7cc6f2', '#d8f1ff', 360) +
        `<rect ${BIG} y="360" height="3000" fill="#3f8fd2"/><rect ${BIG} y="360" height="30" fill="#5aa8e6"/>`;
    case 'storm':
      return sky('g-storm', '#4a5568', '#8a96a8', 360) +
        `<rect ${BIG} y="360" height="3000" fill="#2c5a8f"/>`;
    case 'under':
      return sky('g-under', '#5bb6e8', '#1d5f9a', 600) +
        `<rect ${BIG} y="560" height="3000" fill="#e6c98f"/><path d="M-3000 560 Q300 530 600 560 Q900 585 4000 560 Z" fill="#e6c98f"/>`;
    case 'beach':
      return sky('g-sky', '#7cc6f2', '#d8f1ff', 360) +
        `<rect ${BIG} y="330" height="3000" fill="#3f8fd2"/><path d="M-3000 3000 L-3000 480 L300 480 Q600 380 1000 400 L4000 400 L4000 3000 Z" fill="#f2d49b"/>`;
    case 'river':
      return sky('g-sky', '#7cc6f2', '#d8f1ff', 360) +
        `<rect ${BIG} y="330" height="3000" fill="#7cb342"/><rect ${BIG} y="400" height="130" fill="#4fa3e0"/><rect ${BIG} y="400" height="12" fill="#81c4f0"/><rect ${BIG} y="530" height="3000" fill="#8bc34a"/>`;
    case 'desert':
      return sky('g-desert', '#ffcc80', '#fff3e0', 420) +
        hills(450, '#e8c07d', '#dcae62');
    case 'cave':
      return `<rect ${BIG} y="-3000" height="7000" fill="#5d4037"/>` +
        `<path d="M-3000 -3000 L4000 -3000 L4000 40 Q800 120 500 60 Q200 0 -3000 80 Z" fill="#4e342e"/>` +
        `<rect ${BIG} y="500" height="3000" fill="#8d6e63"/><path d="M-3000 500 Q300 470 600 500 Q900 530 4000 500 Z" fill="#8d6e63"/>`;
    case 'day':
    default:
      return sky('g-sky', '#7cc6f2', '#d8f1ff', 440) +
        hills(450, '#8bc34a', '#7cb342');
  }
}

const raw = (o) => o.svg;

export const ART = {
  raw, bush, heavenLight, person, angel, baby, lion, elephant, giraffe, sheep, bunny, bird, fish, bigFish, sun, moon, star,
  sparkle, cloud, rainbow, tree, palm, flower, lily, grass, reeds, rock, stone, bubble, heart, ark,
  boat, basket, basketBoat, bread, bag, stable, manger, cave, city, hammer, waves,
};

// Wrap one piece of art at a position. `anim` is a CSS animation class name.
export function place(name, x, y, s = 1, opts = {}, anim = '', extra = '') {
  const fn = ART[name];
  if (!fn) throw new Error(`Unknown art: ${name}`);
  const delay = anim ? ` style="animation-delay:${(-Math.random() * 2).toFixed(2)}s"` : '';
  return `<g class="place" transform="translate(${x} ${y}) scale(${s})" ${extra}><g class="${anim ? 'a-' + anim : ''}"${delay}>${fn(opts)}</g></g>`;
}

export function sceneSVG(scene, { cls = '', inner = '' } = {}) {
  const items = (scene.items || []).map((it) => place(...it)).join('');
  return `<svg class="stage-svg ${cls}" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${bg(scene.bg)}${items}${inner}</svg>`;
}
