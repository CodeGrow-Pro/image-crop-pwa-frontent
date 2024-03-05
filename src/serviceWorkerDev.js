import { toast } from "react-toastify";

export default function serviceWorkerDev() {
    const swUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`
    if(navigator?.serviceWorker){
        navigator.serviceWorker.register(swUrl).then((response) => {
            console.warn("Response", response);
        })
    }
    else{
        toast.error("Service Worker not supported")
    }
    
}