<template>
  <div class="container">
    <div v-if="onCalendar" class="compact">
      <div class="reminders">
        <div
          class="reminder"
          :class="{allday: !reminder.time, recurring: reminder.recurring}"
          v-for="reminder in todaysReminders"
          :key="reminder.time"
        >
          <font-awesome-icon icon="bell"/>
          <font-awesome-icon v-if="reminder.recurring" icon="recycle"/>
          <span class="time" v-if="reminder.time">{{ reminder.time }}</span>
          <span class="text">{{ reminder.text }}</span>
        </div>
      </div>
      <div class="events"></div>
    </div>
    <div v-else>
      <button class="action button absolute top right spaced" @click="deFocus">
        <font-awesome-icon icon="check-circle"/>done
      </button>
      <h4>{{ day }}</h4>
      <div class="day">
        <div class="reminders">
          <div
            class="reminder"
            :class="{allday: !reminder.time, recurring: reminder.recurring}"
            v-for="reminder in todaysReminders"
            :key="reminder.time"
          >
            <font-awesome-icon icon="bell"/>
            <font-awesome-icon v-if="reminder.recurring" icon="recycle"/>
            <span class="time" v-if="reminder.time">{{ reminder.time }}</span>
            <span class="text">{{ reminder.text }}</span>
          </div>
        </div>
        <div class="events"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import calendarUtils from "../utils/calendar";

export default {
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
    }
  },
  data() {
    return {};
  },
  mounted() {
    // console.log("in CalendarDay mounted", {
    //   day: this.day,
    //   events: this.events,
    //   reminders: this.reminders
    // });
  },
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
              calendarUtils.yyyymmdd(rem.date) >= todayNumeric)
        )
        .map(rem => {
          return {
            text: rem.text,
            time: rem.time,
            recurring: rem.weekdays && rem.weekdays.length > 0
          };
        })
        .sort(
          (a, b) => 1 * a.time.replace(":", ".") - 1 * b.time.replace(":", ".")
        );
      return reminders;
    }
  },
  methods: {
    ...mapMutations(["SET_CALENDAR_DAYINFOCUS"]),
    deFocus() {
      this.SET_CALENDAR_DAYINFOCUS(null);
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
.container {
  position: relative;
}
.top {
  top: -2.8em;
}
h4 {
  text-align: center;
  margin-top: 0;
}
.day {
  min-height: 300px;
}
.event,
.reminder {
  color: #dfcaa8;
}
.compact {
  font-size: 75%;
}
.compact .event,
.compact .reminder {
  display: flex;
  overflow: auto;
  max-height: 2em;
}
.time {
  margin-right: 0.5em;
}
.allday,
.allday .svg-inline--fa {
  color: #b1bcdb;
}
.recurring,
.recurring .svg-inline--fa {
  color: #8c924082;
}
</style>
