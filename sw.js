const CACHE = "erp-v1";

self.addEventListener("install", e=>{
e.waitUntil(
caches.open(CACHE).then(c=>{
return c.addAll([
"/",
"/index.html",
"/style.css",
"/core/db.js",
"/core/router.js"
]);
})
);
});

self.addEventListener("fetch", e=>{
e.respondWith(
caches.match(e.request).then(r=>r || fetch(e.request))
);
});
