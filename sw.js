const CACHE = 'brootherhood-static-v5';
const FILES = ['./','./index.html','./digital.css','./academy.css','./float-motion.css','./styles.css','./styles-guide.css','./src/digital-app.js','./src/academy-app.js','./src/academy-content.js','./src/float-motion.js','./src/academy-python-worker.js','./src/academy-sql-worker.js','./src/academy-typescript-worker.js','./src/informatics-core.js','./src/code-worker.js','./src/digital-scene.js','./legacy/','./legacy/index.html','./src/app.js','./src/logic.js','./src/discovery.js','./src/discovery-ui.js','./src/guide-scene.js','./assets/favicon.svg'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request)));
});
