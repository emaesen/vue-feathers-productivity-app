import Vue from "vue";
import Vuex from "vuex";
import feathersVuex from "feathers-vuex";
import feathersClient from "./feathers-client";

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, {
  idField: "_id"
});

Vue.use(Vuex);
Vue.use(FeathersVuex);

export default new Vuex.Store({
  state: {
    timeTick: new Date().getTime()
  },
  getters: {
    timeTick: state => state.timeTick
  },
  mutations: {
    // can be used directly for synchronous events
    SET_TIME_TICK: (state, tick) => (state.timeTick = tick)
  },
  actions: {
    // for async functionality - commit a mutation
    // e.g. setTimeTick: (context, tick) => context.commit("SET_TIME_TICK", tick)
  },
  plugins: [
    service("users", {
      instanceDefaults: {
        username: "",
        password: ""
      }
    }),
    service("notes", {
      instanceDefaults: {
        text: "",
        category: "",
        color: ""
      }
    }),
    service("reminders", {
      instanceDefaults: {
        text: "",
        date: "",
        time: "",
        snooze: ""
      }
    }),
    // Setup the auth plugin.
    auth({ userService: "users" })
  ]
});
