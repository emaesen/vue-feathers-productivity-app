<template>
  <div class="calendar-body">
    <div class="days-header">
      <div class="day-label" v-for="day in 7" :key="day">{{ dayName(day - 1) }}</div>
    </div>

    <div class="days-body">
      <div
        class="week-row"
        v-for="(week, key) in calendarMonth"
        :key="key"
        :class="weekClasses(week)"
      >
        <div
          :key="key"
          class="week-day"
          :class="dayClasses(day)"
          v-for="(day, key) in week"
          @click.stop="expandDay(day)"
        >
          <transition name="fade" mode="out-in">
            <div :key="day.date.getTime()" class="day-container">
              <div class="day-number">{{ day.monthDay }}</div>
              <pa-calendar-events-box></pa-calendar-events-box>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarEventsBox from "./CalendarEventsBox";
import calendarUtils from "../utils/calendar";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "CalendarBody",
  components: {
    "pa-calendar-events-box": CalendarEventsBox
  },
  props: {
    events: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      firstDay: 0
    };
  },
  computed: {
    ...mapGetters({ calendarState: "calendar" }),
    calendarMonth() {
      return calendarUtils.calendarMonth(this.monthStart, this.firstDay);
    },
    monthStart() {
      return this.calendarState.month.start || calendarUtils.firstDateOfMonth();
    }
  },
  methods: {
    ...mapMutations(["SET_CALENDAR_DAYINFOCUS"]),
    dayName(day) {
      let dayIndex = parseInt(day + this.firstDay) % 7;
      return calendarUtils.names.daysShort[dayIndex];
    },
    weekClasses(week) {
      const classes = {
        past: week[6].isPast
      };
      return Object.keys(classes).filter(key => classes[key] === true);
    },
    dayClasses(day) {
      const classes = {
        past: day.isPast,
        today: day.isToday,
        sunday: day.isSunday,
        weekend: day.isWeekend,
        saturday: day.isSaturday,
        "not-current": !day.isCurrentMonth
      };

      return Object.keys(classes).filter(key => classes[key] === true);
    },
    expandDay(day) {
      this.SET_CALENDAR_DAYINFOCUS(day);
      console.log("in expandDay", { day });
    }
  }
};
</script>

<style>
.calendar-body {
  display: grid;
  background-color: #1e1d21;
}
.days-header {
  line-height: 2em;
  display: grid;
  grid-auto-columns: 14.286%;
  grid-template-areas: "a b c d e f g";
  background-color: #121017;
  border-top: 1px solid #121017;
  border-left: 1px solid #121017;
  border-bottom: 1px solid #121017;
}
.days-body {
  display: grid;
  grid-template-rows: auto;
}
.day-number {
  text-align: right;
  margin-right: 10px;
}
.day-label {
  text-align: center;
  border-right: 1px solid #121017;
}
.week-row {
  display: grid;
  grid-template-areas: "a b c d e f g";
  grid-row-gap: 5px;
  grid-auto-columns: 14.286%;
}
.week-row {
  border-left: 1px solid #121017;
}
.week-day {
  min-height: 3em;
  padding: 4px;
  border-right: 1px solid #121017;
  border-bottom: 1px solid #121017;
  overflow: hidden;
}
.week-day.today {
  border: 1px dashed #91948b;
  border-radius: 5px;
}
.day-number {
  font-style: italic;
}
.week-day.today > .day-number {
  color: #d5c4ff;
}
.day-label .current {
  font-style: italic;
}
.week-day.events {
  color: #dfcaa8;
}
.week-row.past {
  opacity: 0.7;
}
.week-day.not-current {
  color: #84808a;
}
.week-day.past {
  color: #84808a;
}
.day-container {
  transition: all 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-9px);
}
</style>
