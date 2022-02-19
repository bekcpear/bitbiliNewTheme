import { registerRoute, setCatchHandler } from 'workbox-routing';
import { cleanupOutdatedCaches, precacheAndRoute, matchPrecache } from 'workbox-precaching';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { messageSW } from 'workbox-window';
// Used for filtering matches based on status code, header, or both
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
// Used to limit entries in cache, remove entries after a certain period of time
import { ExpirationPlugin } from 'workbox-expiration';

// Ensure your build step is configured to include /offline.html as part of your precache manifest.
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
// Catch routing errors, like if the user is offline
setCatchHandler(async ({ event }) => {
  // Return the precached offline page if a document is being requested
  if (event.request.destination === 'document') {
    return matchPrecache('/offline.html');
  }
  return Response.error();
});

// custom Plugin
const myPlugin = {
  cacheDidUpdate: async ({cacheName, request, oldResponse, newResponse, event, state}) => {
    // remove the old same caches
    caches.open(cacheName).then((cache) => {
      cache.matchAll(request, {ignoreSearch: true}).then((response) => {
        if ( response.length > 1 ) {
          var newestItem = response[0];
          for ( var i = 1; i < response.length; i++ ) {
            if ( Date.parse(response[i].headers.get('date')) > Date.parse(newestItem.headers.get('date')) ) {
              cache.delete(newestItem.url, {ignoreSearch: false});
              newestItem = response[i];
            }
          }
        }
      });
    })
  },
  fetchDidFail: async ({originalRequest, request, error, event, state}) => {
    self.clients.get(event.resultingClientId).then((client) => {
      client.postMessage({type: "FETCH_DID_FAIL"});
    });
  },
  handlerDidComplete: async ({request, response, error, event, state}) => {
    self.clients.get(event.resultingClientId).then((client) => {
      client.postMessage({type: "HANDLER_DID_COMPLETE", status: response.status});
    });
  }
}

// Cache page navigations (html) with a Network First strategy
registerRoute(
  // Check to see if the request is a navigation to a new page
  ({ request }) => request.mode === 'navigate',
  // Use a Network First caching strategy
  new NetworkFirst({
    // Put all cached files in a cache named 'pages'
    cacheName: 'pages',
    plugins: [
      myPlugin,
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      // expire them after 30 days
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
      }),
    ],
    // ignore URL params when matching cache
    matchOptions: {
      ignoreSearch: true,
    },
  }),
);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
  // Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  // Use a Stale While Revalidate caching strategy
  new StaleWhileRevalidate({
    // Put all cached files in a cache named 'assets'
    cacheName: 'assets',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      // expire them after 30 days
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
      }),
    ],
  }),
);

// Cache images with a Cache First strategy
registerRoute(
  // Check to see if the request's destination is style for an image
  ({ request }) => request.destination === 'image',
  // Use a Cache First caching strategy
  new CacheFirst({
    // Put all cached files in a cache named 'images'
    cacheName: 'images',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      // Don't cache more than 50 items, and expire them after 30 days
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
      }),
    ],
  }),
);

addEventListener('install', (event) => {
  // delete my previous cacheStorage
  caches.delete("sw-precache-bitbili-net");
  // skip waiting phase
  self.skipWaiting();
});
