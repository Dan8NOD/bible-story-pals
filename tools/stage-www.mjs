// Copies the game into www/ for Capacitor (`npm run ios` runs this, then cap sync).
// The web app needs no build step; this only leaves out tests, tools, the
// service worker and node_modules.
import { cp, rm, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'www');
const FILES = ['index.html', 'manifest.webmanifest', 'css', 'js', 'fonts', 'icons', 'audio'];

await rm(out, { recursive: true, force: true });
await mkdir(out);
for (const f of FILES) await cp(join(root, f), join(out, f), { recursive: true });
console.log(`Staged ${FILES.join(', ')} into www/`);
