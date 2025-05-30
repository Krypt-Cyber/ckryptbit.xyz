// sw.js
const CACHE_NAME = 'projekt-ckryptbit-cache-v2'; // Incremented cache version
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx', // Main app script (assuming esbuild output name)
  // Tailwind CDN (consider self-hosting or more advanced caching for production)
  'https://cdn.tailwindcss.com',
  // Google Fonts CSS (consider self-hosting or more advanced caching for production)
  'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap',
  // Placeholder for icons (actual files needed in public/icons/)
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png',
  // Add any other critical static assets like local logo image if used
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force activation of new service worker
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('PWA ServiceWorker: Opened cache');
        // Create request objects for cross-origin resources to attempt caching
        // For production, proper CORS headers are needed on CDN resources for reliable caching.
        // 'no-cors' mode can lead to opaque responses, hiding errors.
        const requestsToCache = urlsToCache.map(url => {
          if (url.startsWith('http')) {
            // Attempt to cache CDN resources. This might result in opaque responses if CORS isn't permissive.
            return new Request(url, { mode: 'cors' }); // Prefer 'cors' if possible
          }
          return url;
        });
        return Promise.all(requestsToCache.map(req =>
          cache.add(req).catch(err => console.warn(`PWA SW: Failed to cache ${req.url || req}`, err))
        ));
      })
      .catch(err => {
        console.error('PWA SW: Failed to cache resources during install:', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('PWA ServiceWorker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Claim clients immediately
  );
});

self.addEventListener('fetch', (event) => {
  // For navigation (HTML pages), try network first. If network fails, serve from cache.
  // This ensures users get the latest HTML if online, but can still load the app offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If network fails for navigation, try to serve the cached root index.html
          return caches.match('/'); 
        })
    );
    return;
  }

  // For non-navigation requests (assets like JS, CSS, images), use cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Asset found in cache
        }
        // Asset not in cache, fetch from network
        return fetch(event.request).then((networkResponse) => {
          // If fetch is successful, clone and cache the response for future requests.
          if (networkResponse && networkResponse.status === 200) {
            // Cache only if it's a GET request and not an opaque response (unless intended)
            if (event.request.method === 'GET' && networkResponse.type !== 'opaque') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
          }
          return networkResponse;
        });
      })
      .catch(error => {
        console.error('PWA ServiceWorker: Fetch error for', event.request.url, error);
        // Optionally, return a generic offline fallback for specific asset types (e.g., an offline image)
        // For this generic SW, we'll let the browser handle the error.
      })
  );
});