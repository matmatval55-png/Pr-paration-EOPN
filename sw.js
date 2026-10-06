// Service worker : met l'application en cache pour un fonctionnement hors ligne.
// Stratégie « stale-while-revalidate » : réponse immédiate depuis le cache,
// mise à jour en arrière-plan (la nouvelle version s'affiche au lancement suivant).
const VERSION = 'v1';
const CACHE = `prepa-eopn-${VERSION}`;
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './js/app.js',
  './js/theme.js',
  './js/core/charts.js',
  './js/core/course.js',
  './js/core/fmt.js',
  './js/core/quiz.js',
  './js/core/registry.js',
  './js/core/rng.js',
  './js/core/srs.js',
  './js/core/stats.js',
  './js/core/store.js',
  './js/core/ui.js',
  './js/maths/ch-algebre.js',
  './js/maths/ch-analyse.js',
  './js/maths/ch-nombres.js',
  './js/maths/helpers.js',
  './js/maths/index.js',
  './js/pages/course.js',
  './js/pages/exam.js',
  './js/pages/home.js',
  './js/pages/modules.js',
  './js/pages/psycho.js',
  './js/pages/review.js',
  './js/pages/selection.js',
  './js/pages/settings.js',
  './js/pages/stats.js',
  './js/pages/train.js',
  './js/psycho/attention.js',
  './js/psycho/calcul.js',
  './js/psycho/index.js',
  './js/psycho/instruments.js',
  './js/psycho/mecanique.js',
  './js/psycho/memoire.js',
  './js/psycho/multitache.js',
  './js/psycho/spatial.js',
  './js/psycho/suites.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('prepa-eopn-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      if (cached) {
        e.waitUntil(network);
        return cached;
      }
      return (await network) || (req.mode === 'navigate' ? cache.match('./index.html') : Response.error());
    }),
  );
});
