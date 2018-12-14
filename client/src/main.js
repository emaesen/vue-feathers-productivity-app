import Vue from "vue";
import App from "./App";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faAlignJustify, // list layout
  faAngleLeft, // angle left
  faAngleRight, // angle right
  faBan, // cancel
  faBell, // reminders
  faCalendarAlt, // calendar
  faCheck, // check
  faCheckCircle, // save, ok
  faEdit, // edit
  faEllipsisV, // ellipsis vertical
  faFilter, // filter
  faMinusCircle, // remove
  faPlusCircle, // add
  faQuestionCircle, // info
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
  faUserPlus, // register new user
  faWindowMinimize // single list item
} from "@fortawesome/free-solid-svg-icons";
import {
  faWindowMinimize as farWindowMinimize // single list item
} from "@fortawesome/free-regular-svg-icons";

import router from "./router";
import store from "./store";

import "./registerServiceWorker";

library.add(
  faAlignJustify,
  faAngleLeft,
  faAngleRight,
  faBan,
  faBell,
  faCalendarAlt,
  faCheck,
  faCheckCircle,
  faEdit,
  faEllipsisV,
  faFilter,
  faMinusCircle,
  faPlusCircle,
  faQuestionCircle,
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
  faUserPlus,
  faWindowMinimize,
  farWindowMinimize
);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
