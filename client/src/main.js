import Vue from "vue";
import App from "./App";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faAlignJustify, // list layout
  faBan, // cancel
  faCheck, // check
  faCheckCircle, // save, ok
  faEdit, // edit
  faEllipsisV, // ellipsis vertical
  faMinusCircle, // remove
  faPlusCircle, // add
  faSignInAlt, // log/sign in
  faSignOutAlt, // log/sign out
  faSortAmountDown, // sort down
  faSortAmountUp, // sort up
  faSpinner,
  faStickyNote, // notes
  faTachometerAlt, // dashboard
  faTh, // grid layout
  faTrashAlt, // delete
  faUserCheck, // logged-in user
  faUserPlus // register new user
} from "@fortawesome/free-solid-svg-icons";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

library.add(
  faAlignJustify,
  faBan,
  faCheck,
  faCheckCircle,
  faEdit,
  faEllipsisV,
  faMinusCircle,
  faPlusCircle,
  faSignInAlt,
  faSignOutAlt,
  faSortAmountDown,
  faSortAmountUp,
  faSpinner,
  faStickyNote,
  faTachometerAlt,
  faTh,
  faTrashAlt,
  faUserCheck,
  faUserPlus
);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
