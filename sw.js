const CACHE_NAME='gerphyon-v1';
const ASSETS=[ './','./index.html','./assets/css/styles.css','./assets/js/main.js','./assets/js/slideshow.js','./assets/js/md-loader.js','./assets/js/versions.js','./assets/js/blog.js','./assets/img/logo.svg','./assets/img/slide1.png','./assets/img/slide2.png','./assets/img/slide3.png' ];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS))); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))); });
self.addEventListener('fetch',e=>{ e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))); });