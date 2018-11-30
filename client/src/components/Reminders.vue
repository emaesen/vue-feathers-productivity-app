<template>
  <section id="reminders">
    <h2 class="reminders"><font-awesome-icon icon="bell" /> Reminders</h2>
    <div class="">
      <create-reminder
        @create-reminder="createReminder"
      />
      <reminder
        :reminder="reminder"
        :key="reminder._id"
        @delete-reminder="deleteReminder"
        @edit-reminder="editReminder"
      />
    </div>
  </section>
</template>

<script>
import Reminder from "./Reminder";
import CreateReminder from "./CreateEditReminder";


// Get reminders as "Reactive Lists with Live Queries"
// https://feathers-plus.github.io/v1/feathers-vuex/common-patterns.html
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "Reminders",
  components: {
    Reminder,
    CreateReminder
  },
  props: {},
  data() {
    return {
    }
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
      props.reminder.snooze = props.mod.snooze;
      props.reminder.update().then(reminder => {
        console.log("edit succesful", reminder);
      });
    },
    sortByDate(a,b) {
      let dateTimeDiff
      dateTimeDiff = new Date(b.date) - new Date(a.date) 
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
      return this.remindersUnfiltered
          .filter(this.uiFilter)
          .sort(this.sortByDate);
    },
    remindersUnfiltered() {
      return this.user
        ? this.findRemindersInStore({
            query: this.query
          }).data
        : [];
    },
    reminder() {
      return this.reminders[0] || {};
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
</style>
