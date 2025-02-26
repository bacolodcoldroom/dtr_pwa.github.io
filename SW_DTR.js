/* ORIG SERVICE WORKER OF ESTORE */
const cacheName = '123_110429';
const staticAssets = [
  './',
  './index.html',
  './gfx/icon-512x512.png',  './gfx/icon-192x192.png',  
  './gfx/jadmin.jpg',

  './misc/jbe_fmlib.js', './misc/jbe_map.js',
  './main_styles.css',   './mobile.css',

  './js/leaflet.js',              './js/leaflet.css',
  './js/images/jRedMarker.png',   './js/images/jblueMarker.png',
  './js/images/layers.png',       

  './js/axios.min.js',  './js/enadlib.js',   './js/coke.js',     './js/je_msg.js',
    
   
  './app_admin.js', 
  './app_camera.js', 
  './app_daily.js',   
  './app_db.js', 
  './app_dtr.js', 
  './app_main.js', 
  './app_prn.js', 
  './app_report.js', 
  './app_setting.js',     
  
  
  './gfx/proc_logo.gif',  

  './gfx/avatar.png',    './gfx/dots.png',    
  './gfx/jadd.png',      './gfx/jback.png',  
  './gfx/jbell.png',     './gfx/jcall.png',
  './gfx/jcam.png',      './gfx/jcancel.png', 
  './gfx/jcart.png',     './gfx/jcategory.png', 
  './gfx/jchat.png',     './gfx/jdele.png',  
  './gfx/jedit.png',     './gfx/jham.png',   
  './gfx/jhome.png',     './gfx/jimage.png', 
  './gfx/jimg_error.png',     './gfx/jNext.png', 
  
  './gfx/jnotif.png',    './gfx/jPrev.png', 
  './gfx/jproduct.png',    './gfx/jshare.png', 
  './gfx/jpromo.png',    './gfx/jpurchase.png',  
  './gfx/jrefresh.png',  './gfx/jsave.png',
  './gfx/jsearch.png',   './gfx/jsend.png',
  './gfx/jsite.png',     './gfx/jsms.png',   
  './gfx/landmark.png',  
    
  './manifest.webmanifest'
];

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
