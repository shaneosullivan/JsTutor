// Service Worker for JavaScript Adventure PWA
// Minimal implementation for installability and basic caching

const CACHE_NAME = "js-adventure-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/android-chrome-192x192.png",
  "/icons/android-chrome-512x512.png",
  "/logo.svg",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker installed");
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache when offline, network first for dynamic content
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip API routes from caching entirely
  if (event.request.url.includes("/api/")) {
    return;
  }

  // Network first strategy for dynamic content
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response for caching
        const responseClone = response.clone();

        // Cache successful GET responses only (POST requests cannot be cached)
        if (response.status === 200 && event.request.method === "GET") {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }

        return response;
      })
      .catch(() => {
        // Fall back to cache if network fails
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Return a basic offline page for navigation requests
          if (event.request.mode === "navigate") {
            return new Response(
              `<!DOCTYPE html>
                <html>
                <head>
                  <title>JavaScript Adventure - Offline</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { 
                      font-family: Arial, sans-serif; 
                      text-align: center; 
                      padding: 50px; 
                      background: #f8fafc;
                    }
                    .offline-message {
                      max-width: 400px;
                      margin: 0 auto;
                      padding: 20px;
                      background: white;
                      border-radius: 8px;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                  </style>
                </head>
                <body>
                  <div class="offline-message">
                    <h1>🚀 JavaScript Adventure</h1>
                    <h2>You're offline!</h2>
                    <p>Please check your internet connection and try again.</p>
                    <button onclick="window.location.reload()">Retry</button>
                  </div>
                </body>
                </html>`,
              {
                headers: { "Content-Type": "text/html" },
              },
            );
          }

          // For other requests, return a simple error response
          return new Response("Offline", { status: 503 });
        });
      }),
  );
});

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
