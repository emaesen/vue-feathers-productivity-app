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
    nrPastDueReminders: 0,
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
    nrPastDueReminders: state => state.nrPastDueReminders,
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
    },
    SET_NR_PAST_DUE_REMINDERS: (state, nr) => {
      nr = nr || 0;
      state.nrPastDueReminders = nr;
    },
    INCREASE_NR_PAST_DUE_REMINDERS: (state, nr) => {
      nr = nr || 1;
      state.nrPastDueReminders += nr;
    },
    DECREASE_NR_PAST_DUE_REMINDERS: (state, nr) => {
      nr = nr || 1;
      state.nrPastDueReminders -= nr;
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
        color: "",
        isPinned: false
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
    service("events", {
      instanceDefaults: {
        title: "",
        description: "",
        date: "",
        time: ""
      }
    }),
    // Setup the auth plugin.
    auth({ userService: "users" })
  ]
});
