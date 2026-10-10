const CACHE_NAME = 'konvert-cache-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/readme_icon.webp',
  '/manifest.json'
];

// Install Event — precache core shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate Event — cleanup outdated caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // Local assets
  if (url.origin === self.location.origin) {
    // Navigations (HTML pages): Network-first with offline fallback to /index.html
    if (e.request.mode === 'navigate') {
      e.respondWith(
        fetch(e.request).catch(() => caches.match('/index.html') || caches.match('/'))
      );
      return;
    }

    // Static assets (hashed bundles / images): Stale-while-revalidate
    e.respondWith(
      caches.match(e.request).then((cached) => {
        const fetchPromise = fetch(e.request).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
          }
          return networkRes;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
  } else {
    // External APIs (GitHub releases): Network-first
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  }
});
