
importScripts('js/sw-utils.js')


const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const CACHE_DYNAMIC_LIMIT = 100;


const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg', 
    'img/avatars/wolverine.jpg', 
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css', 
    'js/libs/jquery.js'
];
// Proceso de Instalación
self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => {
            cache.addAll(APP_SHELL)
        });
    const cacheInmutable = caches.open(INMUTABLE_CACHE)
    .then(cache => {
        cache.addAll(APP_SHELL_INMUTABLE)
    });


    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]))
})

// Para que borre los caches que no se utilizan
    self.addEventListener('activate', e => {

        const resActivate = caches.keys()
        .then(keys => {
            keys.forEach( key => {
                //static-v4
                if (key !== STATIC_CACHE && key.includes('static')) {
                    return caches.delete(key)
                }
            })
        })


        e.waitUntil(resActivate)
    });


  // Estrategia 2- Cache with Network Fallback
  self.addEventListener('fetch', e=> {

      const respuesta = caches.match( e.request )
          .then( res => {
  
              if ( res ) {
                return res;
              } else {

                  return fetch( e.request ).then( newResp => {

                    return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newResp);
      
                  });

              }
  
  
  
  
          });

          e.respondWith( respuesta );
  })



