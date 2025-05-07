// service-worker.js

const CACHE_NAME = 'libros-collection-v1';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://bootswatch.com/4/sketchy/bootstrap.min.css',
    'app.js', // Asegúrate de tener tu archivo JavaScript en la misma carpeta
];

// Instalar el Service Worker
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(CACHE_URLS);
            })
    );
});

// Activar el Service Worker
self.addEventListener('activate', function (event) {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Manejar las peticiones de la aplicación
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            })
    );
});

// Este es el truco para forzar la actualización del SW
self.addEventListener('controllerchange', () => {
    window.location.reload();
});
