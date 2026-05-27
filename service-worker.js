const CACHE_NAME = 'nexvolt-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './db/db.js',
  './db/router.js',
  './modules/dashboard.js',
  './modules/clients.js',
  './modules/invoice.js',
  './modules/expenses.js',
  './modules/job.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
