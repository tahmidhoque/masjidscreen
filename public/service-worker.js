/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'masjid-screen-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const DATA_CACHE = 'data-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.bundle.js',
  '/static/css/main.bundle.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Install service worker and cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(DATA_CACHE),
      caches.open(DYNAMIC_CACHE)
    ])
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate service worker and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, DATA_CACHE].includes(cacheName)) {
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          })
        );
      }),
      // Claim clients immediately
      self.clients.claim()
    ])
  );
});

// Background sync for prayer times updates
self.addEventListener('sync', event => {
  if (event.tag === 'sync-prayer-times') {
    event.waitUntil(syncPrayerTimes());
  }
});

// Handle fetch events with different strategies based on request type
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls (prayer times, announcements)
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  // Static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }

  // Dynamic content
  event.respondWith(staleWhileRevalidate(event.request));
});

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache-first strategy failed:', error);
    throw error;
  }
}

// Network-first strategy for API calls
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(DATA_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Network request failed, falling back to cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale-while-revalidate strategy for dynamic content
async function staleWhileRevalidate(request) {
  try {
    const cachedResponse = await caches.match(request);
    const networkResponsePromise = fetch(request).then(response => {
      if (response.status === 200) {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then(cache => cache.put(request, response.clone()));
      }
      return response;
    }).catch(error => {
      console.error('Network request failed in stale-while-revalidate:', error);
      throw error;
    });

    return cachedResponse || networkResponsePromise;
  } catch (error) {
    console.error('Stale-while-revalidate strategy failed:', error);
    throw error;
  }
}

// Background sync function for prayer times
async function syncPrayerTimes() {
  try {
    const response = await fetch('/api/prayer-times');
    if (response.status === 200) {
      const data = await response.json();
      const db = await openDatabase();
      await db.put('prayerTimes', data);
      return data;
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
} 