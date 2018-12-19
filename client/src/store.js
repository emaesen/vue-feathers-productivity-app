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
    timeTick: new Date().getTime(),
    calendar: {
      today: null,
      month: {
        start: null,
        end: null
      },
      dayInFocus: null
    }
  },
  getters: {
    timeTick: state => state.timeTick,
    calendar: state => state.calendar
  },
  mutations: {
    // can be used directly for synchronous events
    SET_TIME_TICK: (state, tick) => (state.timeTick = tick),
    SET_CALENDAR_MONTH: (state, payload) => {
      state.calendar.month.start = payload.start;
      state.calendar.month.end = payload.end;
    },
    SET_CALENDAR_DAYINFOCUS: (state, day) => {
      state.calendar.dayInFocus = day;
    },
    SET_CALENDAR_TODAY: (state, day) => {
      state.calendar.today = day;
    }
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
        window: [],
        weekdays: []
      }
    }),
    // Setup the auth plugin.
    auth({ userService: "users" })
  ]
});
