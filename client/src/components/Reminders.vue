<template>
  <section id="reminders">
    <h2 class="reminders">
      <font-awesome-icon icon="bell"/>Reminders
    </h2>
    <div class="controls convert-to-block-on-small-device">
      <button @click="displayOnlyOne=!displayOnlyOne" class="action button">
        <font-awesome-icon :icon="displayOnlyOne? 'align-justify' : ['far','window-minimize']"/>
      </button>
      <pa-clock v-if="!onDashboard"/>
    </div>
    <div class>
      <pa-create-reminder @create-reminder="createReminder"/>
      <div v-if="loading" class="loading">loading...</div>
      <transition-group v-if="!loading" tag="div" name="reminders-list">
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
      displayOnlyOne: this.onDashboard
    };
  },
  created() {
    // Find all reminders from server. We'll filter/sort on the client.
    this.findReminders({ query: {} }).then();
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
      let dateTimeDiff;
      dateTimeDiff = new Date(a.date) - new Date(b.date);
      return dateTimeDiff;
    },
    uiFilter(reminder) {
      return reminder ? true : false;
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
      if (this.displayOnlyOne) {
        return [this.remindersUnfiltered[0]];
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
.clr-red {
  background-color: #f9141436;
}
.clr-blue {
  background-color: #141bf936;
}
.clr-green {
  background-color: #14f92627;
}
.clr-yellow {
  background-color: #ffea0245;
}
.clr-purple {
  background-color: #c114f936;
}
</style>
