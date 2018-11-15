import Vue from 'vue'
import App from './App'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBan, // cancel
  faCheckCircle, // save, ok
  faEdit, // edit
  faMinusCircle, // remove
  faPlusCircle, // add
  faSignInAlt, // log/sign in
  faSignOutAlt, // log/sign out
  faSpinner,
  faStickyNote, // notes
  faTachometerAlt, // dashboard
  faTrashAlt, // delete
  faUserCheck, // logged-in user
  faUserPlus, // register new user
} from '@fortawesome/free-solid-svg-icons'
import router from './router'
import store from './store'
import './registerServiceWorker'

library.add(
  faBan,
  faCheckCircle,
  faEdit,
  faMinusCircle,
  faPlusCircle,
  faSignInAlt,
  faSignOutAlt,
  faSpinner,
  faStickyNote,
  faTachometerAlt,
  faTrashAlt,
  faUserCheck,
  faUserPlus,
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
