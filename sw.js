/* Service worker — Eight Huit Technology
   Nécessaire pour que le navigateur propose « Installer l'application »
   sur Android/Chrome. Met en cache le fichier principal pour un
   démarrage plus rapide et un minimum de fonctionnement hors-ligne
   (les données elles-mêmes restent gérées par Firebase Realtime Database,
   avec son propre mode hors-ligne).
*/
const CACHE_NAME = 'eight-huit-app-v1';
const CORE_ASSETS = [
  './',
  './index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

/* Stratégie réseau d'abord, avec repli sur le cache si hors-ligne —
   pour toujours servir la dernière version de l'application quand le
   réseau est disponible. */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
  );
});
