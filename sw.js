const CACHE = 'cinema-eldon-v1';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icon.svg'];

// Install — cache assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache first, but check for updates on index.html
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // API calls — always network, never cache
  if (url.hostname.includes('rapidapi') || url.hostname.includes('themoviedb') || url.hostname.includes('api.themoviedb')) {
    return;
  }

  // index.html — stale while revalidate
  if (url.pathname === '/' || url.pathname.endsWith('index.html')) {
    e.respondWith(
      caches.open(CACHE).then(async cache => {
        const cached = await cache.match(e.request);
        const fetchPromise = fetch(e.request).then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Everything else — cache first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      });
    })
  );
});
