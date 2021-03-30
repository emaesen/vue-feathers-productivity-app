/* eslint-disable no-console */
// executes in the client app

import { register } from 'register-service-worker'

function postMsg(msg, swreg) {
  if (swreg && swreg.active) {
    swreg.active.postMessage({msg});
  } else {
    self.navigator.serviceWorker.ready.then(function(reg) {
      reg.active.postMessage({msg});
    })  
  }
}

if (process.env.NODE_ENV === 'production') {
  console.log(`[rsw] About to register ${process.env.BASE_URL}service-worker.js.`);
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready (swreg) {
      console.log('[rsw] App is served from cache.');
      postMsg("sw:ready", swreg)
    },
    registered (swreg) {
      console.log('[rsw] Service worker has been registered.')
      postMsg("sw:registered", swreg)
    },
    cached (swreg) {
      console.log('[rsw] Content has been cached for offline use.')
      postMsg("sw:cached", swreg)
    },
    updatefound (swreg) {
      console.log('[rsw] New content is downloading.')
      postMsg("sw:updatefound", swreg)
    },
    updated (swreg) {
      console.log('[rsw] New content is available; please refresh.')
      // need to instruct client/user to invoke skipWaiting(),
      // to activate updated service worker.
      // https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68
      // The proposed solution in the above article doesn't work, 
      // but the one implemented below does:
      // https://github.com/BuildTeamDev/tokenbb-web-client/pull/28/files
      // Prepare to reload page if client initiates a service worker update (skipWaiting)
      let refreshing;
      self.navigator.serviceWorker.addEventListener( 'controllerchange',
        () => {
          if ( refreshing ) {
            return;
          }
          refreshing = true;
          window.location.reload();
        }
      );
      postMsg("sw:updated", swreg)
    },
    offline () {
      console.log('[rsw] No internet connection found. App is running in offline mode.')
      postMsg("sw:offline")
    },
    error (error) {
      //console.error('[rsw] Error during service worker registration:', error)
      postMsg("sw:error:" + error);
    }
  })
}
