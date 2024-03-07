console.warn("sw file in public ")
let cacheData = "appv1";

this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            cache.addAll([
                '/static/js/bundle.js',
                '/index.html',
                '/',
                '/reports'
            ])
        })
    )
})

this.addEventListener("fetch", (event) => {
    if(!navigator.onLine){
        console.log("Fetching from offline");
        event.respondWith(
            caches.match(event.request).then((res) => {
                if(res){
                    return res;
                }
                let requestUrl = event.request.clone();
                fetch(requestUrl);
            })
        )
    }
    else{
        console.log("Fetching from online");
    }
    
})