const cacheName = 'WATER-09072022';
const staticAssets = [
  './',
  './index.html',
  
  './app_styles.css',  
  
  './js/axios.min.js','./js/coke.js','./js/je_msg.js','./js/enadlib.js',

  './app_admin.js','./app_db.js','./app_main.js','./app_meter.js','./app_meter2.js','./app_pages.js','./app_upload.js',

  //'./refreshDB.php','./server.php','./z_tanan.php','./z_uploadMETER.php',

  './gfx/apple-touch-iphone.png','./gfx/author.png','./gfx/bg_app.jpg','./gfx/eMeter.png',
  './gfx/favicon.ico','./gfx/icon-192x192.png','./gfx/img_empty.png','./gfx/jadmin.png',
  './gfx/jback.png', './gfx/jcam.png','./gfx/jcancel.png','./gfx/jclose.png','./gfx/jdown.png',
  './gfx/jdownload.png','./gfx/jedit.png','./gfx/jham.png','./gfx/jimage.png','./gfx/jprn.png',
  './gfx/jsave.png','./gfx/jsend.png','./gfx/upload.png',
  './gfx/proc_logo.gif', 
  
  './manifest.webmanifest'
];

/*
self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});
*/

/*
self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if(url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req){
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req,fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
*/

/*
self.addEventListener('fetch', function(event) {
  event.respondWith(async function() {
     try{
       var res = await fetch(event.request);
       var cache = await caches.open('cache');
       cache.put(event.request.url, res.clone());
       return res;
     }
     catch(error){
       return caches.match(event.request);
      }
    }());
});
*/

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(async function() {
    try{
      var res = await fetch(event.request);
      var cache = await caches.open('cache');
      cache.put(event.request.url, res.clone());
      return res;
    }
    catch(error){
      return caches.match(event.request);
    }
  }());
});


