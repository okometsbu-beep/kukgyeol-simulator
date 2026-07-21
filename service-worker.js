const CACHE_NAME = "genuine-evidence-v9";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=9",
  "./game-data.js?v=9",
  "./game.js?v=9",
  "./manifest.webmanifest",
  "./icon.svg",
  "./assets/men-v2.webp",
  "./assets/women-vn.webp",
  "./assets/women-vn-life.webp",
  "./assets/women-cn.webp",
  "./assets/women-cn-life.webp",
  "./assets/women-th.webp",
  "./assets/women-th-life.webp",
  "./assets/women-jp.webp",
  "./assets/women-jp-life.webp",
  "./assets/women-ph.webp",
  "./assets/women-ph-life.webp",
  "./assets/women-kh.webp",
  "./assets/women-kh-life.webp",
  "./assets/cutscenes/app-match.webp",
  "./assets/cutscenes/first-message.webp",
  "./assets/cutscenes/first-meeting.webp",
  "./assets/cutscenes/first-night.webp",
  "./assets/cutscenes/video-call.webp",
  "./assets/cutscenes/broker-suspicion.webp",
  "./assets/cutscenes/nightlife-secret.webp",
  "./assets/cutscenes/romance-start.webp",
  "./assets/cutscenes/wedding.webp",
  "./assets/cutscenes/airport.webp",
  "./assets/cutscenes/newborn.webp"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const request = event.request;

  if (request.destination === "image") {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      }))
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
