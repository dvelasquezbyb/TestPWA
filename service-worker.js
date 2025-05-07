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


self.addEventListener('install', (event) => {
    self.skipWaiting(); // Forza la activación del nuevo SW inmediatamente
    // Otras tareas de instalación, como cachear archivos
});


self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['my-cache-v2']; // Actualiza el nombre del caché
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Elimina cachés antiguos
                    }
                })
            );
        })
    );
});


self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Si la respuesta de la red es válida, actualizamos el caché
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            });

            // Si ya hay algo en caché, lo devolvemos, pero seguimos buscando el archivo en la red
            return cachedResponse || fetchPromise;
        })
    );
});


self.addEventListener('activate', (event) => {
    event.waitUntil(
        clients.claim().then(() => {
            // Enviar un mensaje a todas las páginas activas de la aplicación
            clients.matchAll({ type: 'window' }).then((clients) => {
                clients.forEach(client => {
                    client.postMessage({ type: 'NEW_VERSION' });
                });
            });
        })
    );
});
