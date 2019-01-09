<template>
  <div class="container">
    <div v-if="onCalendar">
      <div class="reminders">
        <div v-for="reminder in todaysReminders" :key="reminder.time">
          <span class="time">{{ reminder.time }}</span>
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
      <div class="day">{{ date }}</div>
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
      let reminders = this.reminders
        .filter(rem => rem.date === today)
        .map(rem => {
          return { text: rem.text, time: rem.time };
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
</style>
