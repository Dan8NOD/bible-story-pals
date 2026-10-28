// Offline support: cache the whole (tiny) app on install, serve cache-first.
const VERSION = 'bsp-v5';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css', 'fonts/baloo2-latin.woff2',
  'js/main.js', 'js/art.js', 'js/audio.js', 'js/games.js', 'js/i18n.js', 'js/store.js', 'js/stories.js', 'js/config.js', 'js/phrases.js',
  'audio/manifest.json', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // The clip list changes when new voices are recorded: try the network first.
  if (new URL(e.request.url).pathname.endsWith('/audio/manifest.json')) {
    e.respondWith(fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
      }
      return res;
    })),
  );
});
