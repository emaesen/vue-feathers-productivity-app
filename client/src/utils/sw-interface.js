
export const isServiceWorkerSupported = "serviceWorker" in navigator;

// not serviceworker functionality
// but we show notifications through the service worker
// (to support future push notifications)
export const isNotificationSupported = "Notification" in window;
export const areNotificationsDenied = Notification.permission === "denied";
export const areNotificationsAvailable = isServiceWorkerSupported 
  && isNotificationSupported 
  && !areNotificationsDenied;

export function send_message_to_sw(msg) {
  // based on http://craig-russell.co.uk/2016/01/29/service-worker-messaging.html
  return new Promise(function(resolve, reject){
    // Create a Message Channel
    var msg_chan = new MessageChannel();

    // Handler for recieving message reply from service worker
    msg_chan.port1.onmessage = function(event){
      console.log("[u/sw-api] return message received ", event);
      if(event.data.error){
        reject(event.data.error);
      }else{
        resolve(event.data);
      }
    };

    if ('serviceWorker' in navigator) {
      console.log("[u/sw-api] checking if service worker is active...");
      navigator.serviceWorker.ready
        .then(function(swreg) {
          console.log("[u/sw-api] sending message to service worker... accepting reply...");
          swreg.active.postMessage(msg, [msg_chan.port2]);
        })
        .catch(err => {
          reject(err);
        });
    } else {
      reject("'serviceWorker' is not available");
    }
  });
}

export function getAppUpdate() {
  console.log("[u/sw-api] in getAppUpdate()");
  // get the new service worker that is in waiting state, and make it active
  navigator.serviceWorker.getRegistration().then((swreg) =>
    swreg.waiting.postMessage("skipWaiting")
  )
}

export function addAppMessageListeners(callback) {
  console.log("[u/sw-api] in addAppMessageListeners()");
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .addEventListener('message', event => {
        callback(event.data && event.data.msg);
      });
  }
}
