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
            :class="{allday: !event.time.start && !event.time.end}"
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
            @delete-event="deleteEvent"
            @edit-event="editEvent"
          />
        </transition-group>
      </div>
      <div class="reminders">
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
    todaysReminders() {
      let today = calendarUtils.yyyy_mm_dd(this.date.date);
      let todayNumeric = calendarUtils.yyyymmdd(this.date.date);
      let weekday = this.date.date.getDay();
      let reminders = this.reminders
        .filter(
          rem =>
            rem.date === today ||
            (rem.weekdays &&
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
      const occursToday = event => {
        return (
          todayString === event.date.start ||
          (todayNumeric >= event.date.start.replace(/-/g, "") &&
            todayNumeric <= event.date.end.replace(/-/g, ""))
        );
      };
      let events = this.events
        .filter(
          evt =>
            occursToday(evt) ||
            (evt.weekdays &&
              evt.weekdays.includes(weekday) &&
              (evt.date === "" ||
                calendarUtils.yyyymmdd(evt.date) >= todayNumeric))
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
.day-compact {
  font-size: 75%;
}
.day-compact .event,
.day-compact .reminder {
  display: flex;
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
  opacity: 0.7;
}
.events-list-cell:nth-child(odd) {
  background-color: #1e1d21;
}
.events-list-cell {
  border: 1px dashed #454545;
}
</style>
