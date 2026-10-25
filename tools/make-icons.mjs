// Builds icons/icon.svg from the game's own art, then renders the PNG sizes
// app stores and home screens need. Run: node tools/make-icons.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { place, ART } from '../js/art.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

// `pad` shrinks the artwork for maskable icons, whose edges may be cropped.
const icon = (pad = 1, rounded = true) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc6f2"/><stop offset="1" stop-color="#d8f1ff"/></linearGradient></defs>
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="url(#bg)"/>
  <g transform="translate(256 256) scale(${pad}) translate(-256 -256)">
    <g transform="translate(256 330) scale(2.3)">${ART.rainbow()}</g>
    <path d="M0 400 Q256 340 512 400 L512 512 L0 512 Z" fill="#8bc34a"/>
    ${place('star', 410, 110, 0.75)}
    ${place('sheep', 256, 300, 2.6)}
  </g>
</svg>`;

writeFileSync(join(root, 'icons/icon.svg'), icon());

const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
const render = async (svg, size, out) => {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: join(root, out), omitBackground: true });
};
for (const s of [180, 192, 512]) await render(icon(1, s !== 180), s, `icons/icon-${s}.png`);
await render(icon(0.8, false), 512, 'icons/icon-maskable-512.png');
await browser.close();
console.log('icons written');
