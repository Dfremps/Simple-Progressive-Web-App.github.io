// Shakmen - Service Worker
// Handles offline caching for faster loading and limited offline access.

const CACHE_NAME = 'mini-shop-v3'; const ASSETS = [ './', './index.html', './styles.css', './script.js', './manifest.json', './images/shoe.jpg', './images/bag.jpg', './images/icon-192.png', './images/icon-512.png' ];

// Install: cache assets self.addEventListener('install', (event) => { event.waitUntil( caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)) ); self.skipWaiting(); });

// Activate: remove old caches self.addEventListener('activate', (event) => { event.waitUntil( caches.keys().then((keys) => Promise.all( keys.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); return null; }) ) ).then(() => self.clients.claim()) ); });

// Fetch: try cache first, fallback to network, then cache the response self.addEventListener('fetch', (event) => { event.respondWith( caches.match(event.request).then((cached) => { if (cached) return cached; return fetch(event.request).then((networkResponse) => { // Only cache successful GET requests for same-origin resources if ( event.request.method === 'GET' && networkResponse && networkResponse.status === 200 && event.request.url.startsWith(self.location.origin) ) { const responseClone = networkResponse.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone)); } return networkResponse; }).catch(() => { // Return a fallback image for image requests if (event.request.destination === 'image') { return caches.match('./images/icon-192.png'); } return new Response('Network error', { status: 408 }); }); }) ); });
