const CACHE_NAME = 'cumpleanos-v1';
const urlsToCache = [
  './',
  './carta-moderna.html',
  './styles-moderna.css',
  './script-moderna.js',
  './manifest.json',
  './yupi.mp3',
  './musica/'
];

// Instalar el Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, retornar cache
        if (response) {
          return response;
        }
        
        // Si no, hacer petición de red
        return fetch(event.request)
          .then(response => {
            // Verificar si es una respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar la respuesta
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
      .catch(() => {
        // Si falla la red, intentar con cache
        return caches.match(event.request);
      })
  );
});

// Limpiar cache antiguo
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Sincronización en segundo plano
self.addEventListener('sync', event => {
  if (event.tag === 'sync-playlist') {
    event.waitUntil(syncPlaylist());
  }
});

function syncPlaylist() {
  // Aquí podrías sincronizar la playlist con un servidor
  console.log('Sincronizando playlist...');
}

// Notificaciones push
self.addEventListener('push', event => {
  const options = {
    body: '¡Tienes un mensaje especial de cumpleaños!',
    icon: './icon-192.png',
    badge: './icon-96.png',
    vibrate: [200, 100, 200],
    data: {
      url: './carta-moderna.html'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Carta de Cumpleaños', options)
  );
});
