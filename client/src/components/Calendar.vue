<template>
  <section id="calendar">
    <h2 class="calendar">
      <font-awesome-icon icon="calendar-alt"/>Calendar
    </h2>
    <transition name="fade" mode="out-in">
      <pa-calendar-day
        v-if="dayInFocus"
        key="day"
        :date="dayInFocus"
        :events="events"
        :reminders="reminders"
      />
      <pa-calendar-month v-if="!dayInFocus" key="month" :events="events" :reminders="reminders"/>
    </transition>
  </section>
</template>

<script>
import CalendarMonth from "./CalendarMonth";
import CalendarDay from "./CalendarDay";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "Calendar",
  components: {
    "pa-calendar-month": CalendarMonth,
    "pa-calendar-day": CalendarDay
  },
  props: {
    onDashboard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mounted() {
    console.log("in Calendar.mounted() ", {
      events: this.events,
      reminders: this.reminders,
      loadingReminders: this.loadingReminders
    });
    // If the calendar is viewed on the dashboard,
    //    then the reminders are loaded by the Reminders widget.
    // If the calendar is viewed stand-alone,
    //    then it may have to load the reminders by itself.
    if (this.reminders.length === 0 && !this.loadingReminders) {
      this.loadReminders();
    }
  },
  computed: {
    ...mapState("auth", { user: "payload" }),
    ...mapGetters({ calendarState: "calendar" }),
    dayInFocus() {
      return this.calendarState.dayInFocus;
    },
    ...mapGetters("reminders", { findRemindersInStore: "find" }),
    ...mapState("reminders", {
      loadingReminders: "isFindPending"
    }),
    events() {
      // TODO - placeholder
      return [];
    },
    reminders() {
      return this.user ? this.findRemindersInStore({ query: {} }).data : [];
    }
  },
  methods: {
    ...mapActions("reminders", { findReminders: "find" }),
    handleError(e) {
      console.error("Error: ", e);
      if (e.name === "NotAuthenticated") {
        this.$router.push("/login");
      }
    },
    loadReminders() {
      // Find all reminders from server.
      this.findReminders({ query: {} })
        .then(resp =>
          console.log({
            loadRemindersInCalendarResp: resp,
            reminders: this.reminders
          })
        )
        .catch(err => {
          this.handleError(err);
        });
    }
  }
};
</script>

<style>
h2.calendar {
  display: inline-block;
  margin-right: 1em;
  vertical-align: top;
}
#calendar .controls {
  cursor: pointer;
  display: inline-block;
  position: relative;
  top: -5px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease-in-out, transform 0.4s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-9px);
}
</style>
