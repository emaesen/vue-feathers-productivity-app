<template>
  <section id="reminders">
    <h2 class="reminders">
      <font-awesome-icon icon="bell"/>Reminders
    </h2>
    <div class="controls convert-to-block-on-small-device">
      <button @click="minimize=!minimize" class="action button">
        <font-awesome-icon
          :icon="minimize? 'align-justify' : ['far','window-minimize']"
          class="flush-right"
        />
      </button>
      <pa-clock v-if="!onDashboard"/>
    </div>
    <div class>
      <pa-create-reminder @create-reminder="createReminder"/>
      <div v-if="loading" class="loading">loading...</div>
      <transition-group
        v-if="!loading && reminders && reminders[0]"
        tag="div"
        name="reminders-list"
      >
        <pa-reminder
          v-for="reminder in reminders"
          :reminder="reminder"
          :key="reminder._id"
          @delete-reminder="deleteReminder"
          @edit-reminder="editReminder"
          @dismiss-reminder="dismissReminder"
        />
      </transition-group>
    </div>
  </section>
</template>

<script>
import calendarUtils from "../utils/calendar";
import Reminder from "./Reminder";
import CreateReminder from "./CreateEditReminder";
import Clock from "./Clock";

// Get reminders as "Reactive Lists with Live Queries"
// https://feathers-plus.github.io/v1/feathers-vuex/common-patterns.html
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

const NRMILLISECINMINUTE = calendarUtils.NRMILLISECINMINUTE;
const NRMILLISECINHOUR = calendarUtils.NRMILLISECINHOUR;
const NRMILLISECINDAY = calendarUtils.NRMILLISECINDAY;

export default {
  name: "Reminders",
  components: {
    "pa-reminder": Reminder,
    "pa-create-reminder": CreateReminder,
    "pa-clock": Clock
  },
  props: {
    onDashboard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      minimize: this.onDashboard,
      displayOnlyOne: false,
      correctDateForReminderWindow: true,
      tock: 1
    };
  },
  created() {
    // Find all reminders from server. We'll filter/sort on the client.
    this.loadReminders();
  },
  methods: {
    ...mapActions("reminders", { findReminders: "find" }),
    ...mapMutations(["SET_NR_PAST_DUE_REMINDERS"]),
    handleError(e) {
      console.error("Reminders Error: ", e);
      if (e.name === "NotAuthenticated") {
        this.$router.push("/login");
      }
    },
    loadReminders() {
      // Find all reminders from server. We'll filter/sort on the client.
      this.findReminders({ query: {} })
        .then(resp => console.log({ findRemindersResp: resp }))
        .catch(err => {
          this.handleError(err);
        });
    },
    createReminder(newReminder) {
      console.log("Create reminder ", newReminder);
      // create reminder instance
      const { Reminder } = this.$FeathersVuex;
      const reminder = new Reminder(newReminder);
      reminder
        .save()
        .then(reminder => {
          console.log("Reminder created ", reminder);
        })
        .catch(e => {
          this.handleError(e);
        });
    },
    deleteReminder(reminder) {
      console.log("Delete reminder ", reminder);
      // delete the reminder
      reminder
        .remove()
        .then(() => {
          console.log("remove succesful");
        })
        .catch(e => {
          this.handleError(e);
        });
    },
    editReminder(props) {
      console.log("Edit reminder ", props);
      // save the modifictions
      props.reminder.text = props.mod.text;
      props.reminder.date = props.mod.date;
      props.reminder.time = props.mod.time;
      props.reminder.window = props.mod.window;
      props.reminder.weekdays = props.mod.weekdays;
      props.reminder
        .update()
        .then(reminder => {
          console.log("edit succesful", reminder);
        })
        .catch(e => {
          this.handleError(e);
        });
    },
    sortByDate(a, b) {
      // a and b are reminders
      if (!this.correctDateForReminderWindow) {
        return calendarUtils.timeDiff(a._dateObj, b._dateObj);
      } else {
        return calendarUtils.timeDiff(
          this.correctedDate(a),
          this.correctedDate(b)
        );
      }
    },
    correctedDate(reminder) {
      let date = reminder._dateObj;
      if (reminder.window) {
        let correction =
          NRMILLISECINDAY * (reminder.window[3] || 0) +
          NRMILLISECINHOUR * (reminder.window[4] || 0) +
          NRMILLISECINMINUTE * (reminder.window[5] || 0);
        let time = date.getTime();
        return new Date(time + correction);
      } else {
        return date;
      }
    },
    isPastDue(d1) {
      // d1 must be a date object
      return calendarUtils.timeDiff(d1, new Date()) < 0;
    },
    uiFilter(reminder) {
      return reminder ? true : false;
    },
    uiPreviewFilter(reminder) {
      let todayDate = new Date();
      let dueDate = reminder._dateObj;
      let previewWindowDays = (reminder.window && reminder.window[0]) || 0;
      let timeFromNow = calendarUtils.timeDiff(dueDate, todayDate);
      let daysFromNow = calendarUtils.dayDiff(dueDate, todayDate);
      let isDueWithinPreviewWindow = Math.abs(daysFromNow) <= previewWindowDays;
      let isDueToday = daysFromNow === 0;
      let isPastDue = timeFromNow < 0;
      if (isDueWithinPreviewWindow || isDueToday || isPastDue) {
        return true;
      } else {
        return false;
      }
    },
    dismissReminder() {
      // on receiving a "dismissed reminder" event, force an update of
      // the reminders list by changing a dependent dummy property
      this.tock += 1;
    }
  },
  computed: {
    ...mapState("auth", { user: "payload" }),
    ...mapState("reminders", {
      loading: "isFindPending",
      creating: "isCreatePending"
    }),
    ...mapGetters("reminders", { findRemindersInStore: "find" }),
    ...mapGetters({ calendarState: "calendar" }),
    today() {
      return this.calendarState.today;
    },
    category() {
      // For large datasets, an option is to implement a query-selector.
      // But for the Reminders service, we can just filter on the client.
      return null;
    },
    query() {
      // it is not necessary to define ownerId in the query:
      // The 'before' hooks in reminders.hooks.js guarantee that only
      // the current user's reminders are returned.
      // In combination with reminders service clearAll on logout
      let query = {};

      return query;
    },
    reminders() {
      let nextReminder = this.remindersUnfiltered[0];
      if (this.minimize) {
        if (this.displayOnlyOne) {
          return [nextReminder];
        } else {
          let remindersArray = this.remindersUnfiltered.filter(
            this.uiPreviewFilter
          );
          return remindersArray.length > 0 ? remindersArray : [nextReminder];
        }
      } else {
        return this.remindersUnfiltered.filter(this.uiFilter);
      }
    },
    remindersUnfiltered() {
      return this.user && this.tock
        ? this.findRemindersInStore({
            query: this.query
          })
            .data.map(r => {
              // add a dateObj Date object for the reminder date
              if (r.weekdays && r.weekdays.length > 0) {
                // in case this is a recurring reminder, calculate next reminder date
                r._dateObj = calendarUtils.upcomingDate(r);
              } else {
                r._dateObj = calendarUtils.dateObj(r);
              }
              return r;
            })
            .sort(this.sortByDate)
        : [];
    }
  },
  watch: {
    today: "loadReminders",
    remindersUnfiltered() {
      const reducer = (acc, curr) => {
        if (this.isPastDue(this.correctedDate(curr))) {
          return acc + 1;
        } else {
          return acc;
        }
      };
      let nrPastDueReminders = this.remindersUnfiltered.reduce(reducer, 0);
      this.SET_NR_PAST_DUE_REMINDERS(nrPastDueReminders);
    }
  }
};
</script>

<style>
h2.reminders {
  display: inline-block;
  margin-right: 1em;
  vertical-align: top;
}
#reminders .controls {
  cursor: pointer;
  display: inline-block;
  position: relative;
  top: -5px;
}
.reminders-list-cell {
  transition: all 1s;
}
.reminders-list-enter,
.reminders-list-leave-to {
  opacity: 0;
  transform: translate(0, -100px);
}
.reminders-list-leave-active {
  position: absolute;
}
.reminders-list-cell:nth-child(odd) {
  background-color: #1e1d21;
}
.reminders-list-cell:nth-child(even) {
  background-color: #212027;
}
.reminders-list-cell + .reminders-list-cell {
  border-top: 1px dashed #454545;
}
.reminders-list-cell.duesoon {
  position: fixed;
  top: 34px;
  left: 0;
  right: 0;
  z-index: 9999;
}
.reminders-list-cell.pastdue,
.reminders-list-cell.duesoon {
  margin: 2px;
  background: #560000;
  border: 1px solid #f00;
}
.reminders-list-cell.duesoon {
  background: #6d2400;
}
.reminders-list-cell.pastdue .reminder,
.reminders-list-cell.duesoon .reminder {
  margin-bottom: 0;
}
.reminders-list-cell.duesoon ~ .duesoon {
  position: relative;
  top: 0;
  z-index: auto;
}
.reminders-list-cell.duesoon .countdown-timer {
  right: 15px;
  font-size: 171%;
  line-height: 20px;
}
.reminders-list-cell.duesoon ~ .reminders-list-cell.duesoon .countdown-timer {
  font-size: 126%;
  line-height: 25px;
}
</style>
