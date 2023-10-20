self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("my-cache").then(function (cache) {
      return cache.addAll([
        "/",
        "/index.html",
        "/dashboard.html",
        "/chatRoom.html",
        "/register.html",
        "/css/index.css",
        "/css/main.css",
        "/js/dashboard.js",
        "/js/index.js",
        "/js/main.js",
        "/img/icon-msg.png",
        "/img/images.png",
      ]);
    })
  );
});
