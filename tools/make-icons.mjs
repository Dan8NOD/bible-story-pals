// Builds icons/icon.svg from the game's own art, then renders the PNG sizes
// app stores and home screens need. Run: node tools/make-icons.mjs
import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { place, ART } from '../js/art.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

// `pad` shrinks the artwork for maskable icons, whose edges may be cropped.
// The artwork is clipped to the tile so the grass never squares off the rounded corners.
const icon = (pad = 1, rounded = true) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc6f2"/><stop offset="1" stop-color="#d8f1ff"/></linearGradient><clipPath id="tile"><rect width="512" height="512" rx="${rounded ? 112 : 0}"/></clipPath></defs>
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="url(#bg)"/>
  <g clip-path="url(#tile)"><g transform="translate(256 256) scale(${pad}) translate(-256 -256)">
    <g transform="translate(256 330) scale(2.3)">${ART.rainbow()}</g>
    <path d="M0 400 Q256 340 512 400 L512 512 L0 512 Z" fill="#8bc34a"/>
    ${place('scroll', 398, 118, 1.25)}
    ${place('sheep', 236, 306, 2.5)}
  </g></g>
</svg>`;

writeFileSync(join(root, 'icons/icon.svg'), icon());

const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
const render = async (svg, size, out, opaque = false) => {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: join(root, out), omitBackground: !opaque });
};
for (const s of [180, 192, 512]) await render(icon(1, s !== 180), s, `icons/icon-${s}.png`);
await render(icon(0.8, false), 512, 'icons/icon-maskable-512.png');

// iOS app (Capacitor): a square 1024 icon, since iOS rounds the corners itself,
// and the launch image: the rounded icon centred on sky blue.
const assets = 'ios/App/App/Assets.xcassets';
if (existsSync(join(root, assets))) {
  await render(icon(1, false), 1024, `${assets}/AppIcon.appiconset/AppIcon-512@2x.png`, true);
  const splash = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732"><rect width="2732" height="2732" fill="#7cc6f2"/>${icon().replace('<svg xmlns="http://www.w3.org/2000/svg" ', '<svg x="1066" y="1066" width="600" height="600" ')}</svg>`;
  for (const f of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) await render(splash, 2732, `${assets}/Splash.imageset/${f}`, true);
}
await browser.close();
console.log('icons written');
