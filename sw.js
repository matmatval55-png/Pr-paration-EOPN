// Service worker : met l'application en cache pour un fonctionnement hors ligne.
// Stratégie « stale-while-revalidate » : réponse immédiate depuis le cache,
// mise à jour en arrière-plan (la nouvelle version s'affiche au lancement suivant).
const VERSION = 'v13';
const CACHE = `prepa-eopn-${VERSION}`;
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/icon.svg',
  './js/app.js',
  './js/exams.js',
  './js/theme.js',
  './js/anglais/atc.js',
  './js/anglais/extra.js',
  './js/anglais/grammar.js',
  './js/anglais/index.js',
  './js/anglais/reading.js',
  './js/anglais/vocab.js',
  './js/core/bank.js',
  './js/core/charts.js',
  './js/core/coach.js',
  './js/core/course.js',
  './js/core/decor.js',
  './js/core/fmt.js',
  './js/core/icons.js',
  './js/core/mastery.js',
  './js/core/quiz.js',
  './js/core/registry.js',
  './js/core/reports.js',
  './js/core/rng.js',
  './js/core/seen.js',
  './js/core/srs.js',
  './js/core/stats.js',
  './js/core/store.js',
  './js/core/ui.js',
  './js/cours/anglais.js',
  './js/cours/anime.js',
  './js/cours/credits.js',
  './js/cours/culture.js',
  './js/cours/index.js',
  './js/cours/psycho.js',
  './js/cours/schemas.js',
  './js/cours/visuel.js',
  './js/culture/bia.js',
  './js/culture/extra.js',
  './js/culture/histoire-aae.js',
  './js/culture/index.js',
  './js/entretien/data.js',
  './js/entretien/groupe.js',
  './js/maths/ch-algebre.js',
  './js/maths/ch-analyse.js',
  './js/maths/ch-nombres.js',
  './js/maths/helpers.js',
  './js/maths/index.js',
  './js/pages/bibliotheque.js',
  './js/pages/checklist.js',
  './js/pages/coach.js',
  './js/pages/cours.js',
  './js/pages/course.js',
  './js/pages/diagnostic.js',
  './js/pages/entretien.js',
  './js/pages/exam.js',
  './js/pages/flashcards.js',
  './js/pages/groupe.js',
  './js/pages/home.js',
  './js/pages/hub.js',
  './js/pages/jourj.js',
  './js/pages/leger.js',
  './js/pages/modules.js',
  './js/pages/planning.js',
  './js/pages/psycho.js',
  './js/pages/review.js',
  './js/pages/sante.js',
  './js/pages/selection.js',
  './js/pages/settings.js',
  './js/pages/sport.js',
  './js/pages/stats.js',
  './js/pages/train.js',
  './js/physique/chapters.js',
  './js/physique/index.js',
  './js/planning/ics.js',
  './js/planning/plan.js',
  './js/psycho/attention.js',
  './js/psycho/calcul.js',
  './js/psycho/index.js',
  './js/psycho/instruments.js',
  './js/psycho/mecanique.js',
  './js/psycho/memoire.js',
  './js/psycho/multitache.js',
  './js/psycho/psychomoteur.js',
  './js/psycho/situations.js',
  './js/psycho/situations2.js',
  './js/psycho/spatial.js',
  './js/psycho/structuration.js',
  './js/psycho/suites.js',
  './js/psycho/verbal.js',
  './js/sport/bareme.js',
  './images/aeronefs/a400m.jpg',
  './images/aeronefs/c130.jpg',
  './images/aeronefs/caracal.jpg',
  './images/aeronefs/e3f.jpg',
  './images/aeronefs/mirage2000d.jpg',
  './images/aeronefs/mrtt.jpg',
  './images/aeronefs/paf.jpg',
  './images/aeronefs/pc21.jpg',
  './images/aeronefs/rafale.jpg',
  './images/aeronefs/reaper.jpg',
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
