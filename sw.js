const CACHE_NAME = "budgetmate-v1";

const FILES_TO_CACHE = [
  "index.html",
  "signin.html",
  "signup.html",
  "home.html",
  "style.css",
  "script.js",
  "home.js",
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
