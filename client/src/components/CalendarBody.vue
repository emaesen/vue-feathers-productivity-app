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
              <pa-calendar-day
                :date="day"
                :onCalendar="true"
                :events="events"
                :reminders="reminders"
                :eventCategories="eventCategories"
                :classes="dayClasses(day)"
              ></pa-calendar-day>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarDay from "./CalendarDay";
import calendarUtils from "../utils/calendar";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "CalendarBody",
  components: {
    "pa-calendar-day": CalendarDay
  },
  props: {
    events: {
      type: Array
    },
    reminders: {
      type: Array
    },
    eventCategories: {
      type: Array
    }
  },
  data() {
    return {
      firstDay: 0,
      today: calendarUtils.yyyy_mm_dd(new Date())
    };
  },
  computed: {
    ...mapGetters(["timeTick"]),
    ...mapGetters({ calendarState: "calendar" }),
    tickTock() {
      return this.timeTick;
    },
    calendarMonth() {
      return (
        this.today &&
        calendarUtils.calendarMonth(this.monthStart, this.firstDay)
      );
    },
    monthStart() {
      return this.calendarState.month.start || calendarUtils.firstDateOfMonth();
    }
  },
  methods: {
    ...mapMutations(["SET_CALENDAR_DAYINFOCUS", "SET_CALENDAR_TODAY"]),
    dayName(day) {
      let dayIndex = parseInt(day + this.firstDay) % 7;
      return calendarUtils.names.daysShort[dayIndex];
    },
    weekClasses(week) {
      const classes = {
        past: week[6].isPast,
        "not-current": !week[0].isCurrentMonth && !week[6].isCurrentMonth
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
    }
  },
  watch: {
    timeTick() {
      this.today = calendarUtils.yyyy_mm_dd(new Date());
    },
    today(day) {
      this.SET_CALENDAR_TODAY(day);
    }
  }
};
</script>

<style>
.calendar-body {
  background-color: #1e1d21;
}
.days-header {
  line-height: 2em;
  display: grid;
  grid-auto-columns: 14.286%;
  grid-template-areas: "a b c d e f g";
  background-color: #0a080e;
  border-top: 1px solid #383247;
  border-left: 1px solid #383247;
  border-bottom: 1px solid #383247;
}
.day-number {
  text-align: center;
  margin-right: 10px;
}
.day-label {
  text-align: center;
  border-right: 1px solid #383247;
}
.week-row {
  display: grid;
  grid-template-areas: "k l m n o p q";
  grid-auto-columns: 14.286%;
}
.week-row {
  border-left: 1px solid #383247;
}
.week-row.not-current {
  display: none;
}
.week-day {
  min-height: 6em;
  padding: 4px;
  border-right: 1px solid #383247;
  border-bottom: 1px solid #383247;
  overflow: hidden;
  background-color: #121017;
}
.week-day.today {
  background-color: #200;
  border: 1px solid #91534b;
  border-radius: 5px;
}
.day-number {
  font-style: italic;
}
.week-day.today .day-number {
  color: #ffcbc4;
  font-style: normal;
  font-weight: bold;
}
.day-label .current {
  font-style: italic;
}
.week-day.past {
  opacity: 0.5;
}
.week-day.not-current {
  color: #84808a;
  background-color: #1e1d21;
}
.week-day.past {
  color: #84808a;
}
.week-day:hover {
  cursor: pointer;
  background-color: #160000;
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
