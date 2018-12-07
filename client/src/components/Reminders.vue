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
        />
      </transition-group>
    </div>
  </section>
</template>

<script>
import Reminder from "./Reminder";
import CreateReminder from "./CreateEditReminder";
import Clock from "./Clock";

// Get reminders as "Reactive Lists with Live Queries"
// https://feathers-plus.github.io/v1/feathers-vuex/common-patterns.html
import { mapState, mapGetters, mapActions } from "vuex";

const NRMILLISECINMINUTE = 1000 * 60;
const NRMILLISECINHOUR = NRMILLISECINMINUTE * 60;
const NRMILLISECINDAY = NRMILLISECINHOUR * 24;

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
      correctDateForReminderWindow: true
    };
  },
  created() {
    // Find all reminders from server. We'll filter/sort on the client.
    this.findReminders({ query: {} })
      .then(resp => console.log({ remindersResp: resp }))
      .catch(err => {
        console.log({ remindersErr: err });
      });
  },
  methods: {
    ...mapActions("reminders", { findReminders: "find" }),
    createReminder(newReminder) {
      console.log("Create reminder ", newReminder);
      // create reminder instance
      const { Reminder } = this.$FeathersVuex;
      const reminder = new Reminder(newReminder);
      reminder.save().then(reminder => {
        console.log("Reminder created ", reminder);
      });
    },
    deleteReminder(reminder) {
      console.log("Delete reminder ", reminder);
      // delete the reminder
      reminder.remove().then(() => {
        console.log("remove succesful");
      });
    },
    editReminder(props) {
      console.log("Edit reminder ", props);
      // save the modifictions
      props.reminder.text = props.mod.text;
      props.reminder.date = props.mod.date;
      props.reminder.time = props.mod.time;
      props.reminder.window = props.mod.window;
      props.reminder.snooze = props.mod.snooze;
      props.reminder.update().then(reminder => {
        console.log("edit succesful", reminder);
      });
    },
    sortByDate(a, b) {
      // a and b are reminders
      if (!this.correctDateForReminderWindow) {
        return this.timeDiff(this.date(a), this.date(b));
      } else {
        return this.timeDiff(this.correctedDate(a), this.correctedDate(b));
      }
    },
    correctedDate(reminder) {
      let date = this.date(reminder);
      if (!this.isPastDue(date) && reminder.window) {
        let correction =
          NRMILLISECINDAY * (reminder.window[3] || 0) +
          NRMILLISECINHOUR * (reminder.window[4] || 0) +
          NRMILLISECINMINUTE * (reminder.window[5] || 0);
        let time = date.getTime();
        return new Date().setTime(time + correction);
      } else {
        return this.date(reminder);
      }
    },
    date(reminder) {
      // return Date object for reminder:{date, time} object
      if (reminder.time) {
        return new Date(reminder.date + "T" + reminder.time);
      } else {
        return new Date(reminder.date + "T00:00:00");
      }
    },
    dayDiff(d1, d2) {
      // d1 and d2 must be date objects
      if (
        typeof d1.getTime === "function" &&
        typeof d2.getTime === "function"
      ) {
        let d1clone = new Date(d1.getTime());
        let d2clone = new Date(d2.getTime());
        return (
          (d1clone.setHours(0, 0, 0, 0) - d2clone.setHours(0, 0, 0, 0)) /
          NRMILLISECINDAY
        );
      } else {
        return null;
      }
    },
    timeDiff(d1, d2) {
      // d1 and d2 must be date objects
      if (
        typeof d1.getTime === "function" &&
        typeof d2.getTime === "function"
      ) {
        return d1.getTime() - d2.getTime();
      } else {
        return null;
      }
    },
    isPastDue(d1) {
      // d1 must be a date object
      return this.timeDiff(d1, new Date()) < 0;
    },
    uiFilter(reminder) {
      return reminder ? true : false;
    },
    uiPreviewFilter(reminder) {
      let todayDate = new Date();
      let dueDate = this.date(reminder);
      let previewWindowDays = (reminder.window && reminder.window[0]) || 0;
      let timeFromNow = this.timeDiff(dueDate, todayDate);
      let daysFromNow = this.dayDiff(dueDate, todayDate);
      let isDueWithinPreviewWindow = Math.abs(daysFromNow) <= previewWindowDays;
      let isDueToday = daysFromNow === 0;
      let isPastDue = timeFromNow < 0;
      if (isDueWithinPreviewWindow || isDueToday || isPastDue) {
        return true;
      } else {
        return false;
      }
    }
  },
  computed: {
    ...mapState("auth", { user: "payload" }),
    ...mapState("reminders", {
      loading: "isFindPending",
      creating: "isCreatePending"
    }),
    ...mapGetters("reminders", { findRemindersInStore: "find" }),
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
          return this.remindersUnfiltered.filter(this.uiPreviewFilter);
        }
      } else {
        return this.remindersUnfiltered.filter(this.uiFilter);
      }
    },
    remindersUnfiltered() {
      return this.user
        ? this.findRemindersInStore({
            query: this.query
          }).data.sort(this.sortByDate)
        : [];
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
.reminders-list-cell + .reminders-list-cell {
  border-top: 1px dashed #454545;
}
</style>
