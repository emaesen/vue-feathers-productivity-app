<template>
  <div class="day-content" :class="classes">
    <div :class="{'day-compact':onCalendar, 'day-full':!onCalendar}">
      <button v-if="!onCalendar" class="action button absolute top right spaced" @click="deFocus">
        <font-awesome-icon icon="check-circle"/>close
      </button>
      <h4 v-if="!onCalendar">{{ day }}</h4>
      <div class="events">
        <div v-if="onCalendar">
          <div
            class="event"
            :class="[{allday: !event.time.start && !event.time.end}, 'clr-' + event.color]"
            v-for="event in todaysEvents"
            :key="event._id"
          >
            <span class="time" v-if="event.time.start">{{ event.time.start }}-{{event.time.end}}</span>
            <span class="title">{{ event.title }}</span>
          </div>
        </div>
        <transition-group
          v-if="!onCalendar && todaysEvents && todaysEvents[0]"
          tag="div"
          name="events-list"
          class="events-list"
        >
          <pa-event
            v-for="event in todaysEvents"
            :event="event"
            :key="event._id"
            :categories="eventCategories"
            @delete-event="deleteEvent"
            @edit-event="editEvent"
          />
        </transition-group>
      </div>
      <div class="reminders" v-if="!(onCalendar && isDayInThePast)">
        <div
          class="reminder"
          :class="{allday: !reminder.time, recurring: reminder.recurring}"
          v-for="reminder in todaysReminders"
          :key="reminder._id"
        >
          <font-awesome-icon v-if="!reminder.recurring" icon="bell" class="deemph"/>
          <font-awesome-icon v-if="reminder.recurring" icon="recycle" class="deemph"/>
          <span class="time" v-if="reminder.time">{{ reminder.time }}</span>
          <span class="text">{{ reminder.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Event from "./Event";
import { mapMutations } from "vuex";
import calendarUtils from "../utils/calendar";

export default {
  name: "CalendarDay",
  components: {
    "pa-event": Event
  },
  props: {
    date: {
      type: Object
    },
    events: {
      type: Array
    },
    reminders: {
      type: Array
    },
    eventCategories: {
      type: Array
    },
    onCalendar: {
      type: Boolean,
      default: false
    },
    classes: {
      type: Array
    }
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    day() {
      return calendarUtils.formattedDate(this.date.date, {
        showYear: true
      });
    },
    isDayInThePast() {
      return this.classes && this.classes.includes("past");
    },
    todaysReminders() {
      let today = calendarUtils.yyyy_mm_dd(this.date.date);
      let todayNumeric = calendarUtils.yyyymmdd(this.date.date);
      let weekday = this.date.date.getDay();
      let reminders = this.reminders
        .filter(
          rem =>
            rem.date === today ||
            (rem.weekdays &&
              (rem.date.start === "" ||
                calendarUtils.yyyymmdd(rem.date.start) <= todayNumeric) &&
              rem.weekdays.includes(weekday) &&
              (rem.date === "" ||
                calendarUtils.yyyymmdd(rem.date) >= todayNumeric))
        )
        .map(rem => {
          return {
            _id: rem._id,
            text: rem.text,
            time: rem.time,
            recurring: rem.weekdays && rem.weekdays.length > 0
          };
        })
        .sort(
          (a, b) => 1 * a.time.replace(":", ".") - 1 * b.time.replace(":", ".")
        );
      return reminders;
    },
    todaysEvents() {
      let today = this.date.date;
      let todayString = calendarUtils.yyyy_mm_dd(today);
      let todayNumeric = calendarUtils.yyyymmdd(today);
      let weekday = today.getDay();
      const occursToday = evt => {
        const isRecurring = evt.weekdays && evt.weekdays.length > 0;
        const startDateNumeric = evt.date.start.replace(/-/g, "");
        const endDateNumeric = evt.date.end.replace(/-/g, "") || 
          (isRecurring ? "99999999" : startDateNumeric);
        const isWithinRange = 
          todayNumeric >= startDateNumeric
          && todayNumeric <= endDateNumeric;
        return (
          todayString === evt.date.start ||
          (!isRecurring && isWithinRange) ||
          (isRecurring && isWithinRange && evt.weekdays.includes(weekday))
        );
      };
      let events = this.events
        .filter(
          evt =>
            occursToday(evt)
        )
        .sort(
          (a, b) =>
            1 * a.time.start.replace(":", ".") -
            1 * b.time.start.replace(":", ".")
        );
      return events;
    }
  },
  methods: {
    ...mapMutations(["SET_CALENDAR_DAYINFOCUS"]),
    deFocus() {
      this.SET_CALENDAR_DAYINFOCUS(null);
    },
    deleteEvent(props) {
      // pass-through event
      this.$emit("delete-event", props);
    },
    editEvent(props) {
      // pass-through event
      this.$emit("edit-event", props);
    }
  },
  watch: {
    reminders() {
      // console.log("in CalendarDay watch reminders", {
      //   day: this.day,
      //   events: this.events,
      //   reminders: this.reminders
      // });
    }
  }
};
</script>

<style scoped>
.day-content {
  position: relative;
}
h4 {
  text-align: center;
  margin-top: 0;
}
.day-full {
  min-height: 300px;
  border: 1px solid #555;
  padding: 3px;
  border-radius: 5px;
}
.events {
  min-height: 4em;
}
.reminders {
  min-height: 2em;
}
.event,
.reminder {
  color: #dfcaa8;
}
.event {
  background-color: #462d2d;
  padding: 2px;
  margin-bottom: 2px;
  border-left: 2px solid #000;
  border-right: 2px solid #000;
}
.event.clr-red {
  border-color: #f91414;
  background-color: #f9141418;
}
.event.clr-blue {
  border-color: #2b2bff;
  background-color: #2b2bff36;
}
.event.clr-green {
  border-color: #14f926;
  background-color: #14f92618;
}
.event.clr-yellow {
  border-color: #ffea02;
  background-color: #ffea0218;
}
.event.clr-purple {
  border-color: #c114f9;
  background-color: #c114f918;
}

.day-compact {
  font-size: 75%;
}
.day-compact .event,
.day-compact .reminder {
  display: flex;
  flex-direction: row;
}
.text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.time {
  margin-right: 0.5em;
  color: #596583;
}
.day-full .time {
  color: #7685aa;
}
.allday {
  color: #b1bcdb;
}
.recurring {
  color: #8c924082;
}
.day-full .recurring {
  color: #8c9240;
}
.svg-inline--fa.deemph {
  color: #596583;
}
.day-content.not-current * {
  color: #84808a !important;
  opacity: 0.7;
}
.day-content.past * {
  color: #84808a !important;
  opacity: 0.9;
}
.events-list-cell:nth-child(odd) {
  background-color: #1e1d21;
}
.events-list-cell {
  border: 1px dashed #454545;
}

@media all and (max-width: 800px) {
  .day-compact .event,
  .day-compact .reminder {
    flex-direction: column;
  }
}
</style>
