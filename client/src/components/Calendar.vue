<template>
  <section id="calendar">
    <h2 class="calendar">
      <font-awesome-icon icon="calendar-alt"/>Calendar
    </h2>
    <pa-create-event @create-event="createEvent" :categories="eventCategories"/>

    <transition name="fade" mode="out-in">
      <pa-calendar-day
        v-if="dayInFocus"
        key="day"
        :date="dayInFocus"
        :events="events"
        :reminders="reminders"
        :eventCategories="eventCategories"
        @delete-event="deleteEvent"
        @edit-event="editEvent"
      />
      <pa-calendar-month
        v-if="!dayInFocus"
        key="month"
        :events="events"
        :reminders="reminders"
        :eventCategories="eventCategories"
      />
    </transition>
  </section>
</template>

<script>
import CalendarMonth from "./CalendarMonth";
import CalendarDay from "./CalendarDay";
import CreateEvent from "./CreateEditEvent";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "Calendar",
  components: {
    "pa-calendar-month": CalendarMonth,
    "pa-calendar-day": CalendarDay,
    "pa-create-event": CreateEvent
  },
  props: {
    onDashboard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { eventCategories: [] };
  },
  mounted() {
    // If the calendar is viewed on the dashboard,
    //    then the reminders are loaded by the Reminders widget.
    // If the calendar is viewed stand-alone,
    //    then it may have to load the reminders by itself.
    if (this.reminders.length === 0 && !this.loadingReminders) {
      this.loadReminders();
    }
  },
  created() {
    // Find all event from server.
    this.findEvents({ query: {} })
      .then(resp => {
        console.log({ findEventsResp: resp });
        this.setEventCategories();
      })
      .catch(err => {
        this.handleError(err);
      });
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
    ...mapGetters("events", { findEventsInStore: "find" }),
    ...mapState("events", {
      loadingEvents: "isFindPending"
    }),
    events() {
      return this.user ? this.findEventsInStore({ query: {} }).data : [];
    },
    reminders() {
      return this.user ? this.findRemindersInStore({ query: {} }).data : [];
    }
  },
  methods: {
    ...mapActions("reminders", { findReminders: "find" }),
    ...mapActions("events", { findEvents: "find" }),
    handleError(e) {
      console.error("Calendar Error: ", e);
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
    },
    createEvent(newEvent) {
      console.log("Create event ", newEvent);
      // create event instance
      const { Event } = this.$FeathersVuex;
      const event = new Event(newEvent);
      event
        .save()
        .then(event => {
          console.log("Event created ", event);
          this.setEventCategories();
        })
        .catch(err => {
          this.handleError(err);
        });
    },
    deleteEvent(event) {
      console.log("Delete event ", event);
      // delete the event
      event
        .remove()
        .then(() => {
          console.log("remove succesful");
          this.setEventCategories();
        })
        .catch(err => {
          this.handleError(err);
        });
    },
    editEvent(props) {
      console.log("Edit event ", props);
      // save the modifictions
      props.event.title = props.mod.title;
      props.event.description = props.mod.description;
      props.event.date = props.mod.date;
      props.event.time = props.mod.time;
      props.event.weekdays = props.mod.weekdays;
      props.event.category = props.mod.category;
      props.event.color = props.mod.color;
      props.event
        .update()
        .then(event => {
          console.log("edit succesful", event);
          this.setEventCategories();
        })
        .catch(err => {
          this.handleError(err);
        });
    },
    setEventCategories() {
      // get list of user-defined eventCategories and remove duplicates
      this.eventCategories = this.events
        .map(e => e.category)
        .filter((c, i, s) => s.indexOf(c) === i)
        .sort();
      //console.log({ eventCategories: this.eventCategories });
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
#calendar {
  min-height: 48em;
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
