// Alia Joias — Service Worker v1
const CACHE = 'alia-joias-v1';
const ASSETS = [
  '/sistema/',
  '/sistema/index.html',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Nunito:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Firebase e APIs externas: sempre network first
  if (e.request.url.includes('firestore') || 
      e.request.url.includes('firebase') ||
      e.request.url.includes('googleapis.com/identitytoolkit')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
