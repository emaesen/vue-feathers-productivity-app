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
  faBellSlash, // dismiss
  faCalendarAlt, // calendar
  faCheck, // check
  faCheckCircle, // save, ok
  faClipboardList, // to do list
  faEdit, // edit
  faEllipsisV, // ellipsis vertical
  faFilter, // filter
  faMinusCircle, // remove
  faPlay, // start, play
  faPlusCircle, // add
  faQuestionCircle, // info
  faRecycle, // recycle
  faSignInAlt, // log/sign in
  faSignOutAlt, // log/sign out
  faSortAmountDown, // sort down
  faSortAmountUp, // sort up
  faSpinner,
  faStickyNote, // notes
  faStop, // stop
  faTachometerAlt, // dashboard
  faTh, // grid layout
  faThumbtack, // pin
  faTrashAlt, // delete
  faUserCheck, // logged-in user
  faUserPlus, // register new user
  faWindowMinimize // single list item
} from "@fortawesome/free-solid-svg-icons";
import {
  faWindowMinimize as farWindowMinimize, // single list item
  faBellSlash as farBellSlash // dismiss
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
  faBellSlash,
  farBellSlash,
  faCalendarAlt,
  faCheck,
  faCheckCircle,
  faClipboardList,
  faEdit,
  faEllipsisV,
  faFilter,
  faMinusCircle,
  faPlay,
  faPlusCircle,
  faQuestionCircle,
  faRecycle,
  faSignInAlt,
  faSignOutAlt,
  faSortAmountDown,
  faSortAmountUp,
  faSpinner,
  faStickyNote,
  faStop,
  faTachometerAlt,
  faTh,
  faThumbtack,
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
