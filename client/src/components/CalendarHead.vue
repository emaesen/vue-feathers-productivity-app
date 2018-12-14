<template>
  <div class="calendar-head">
    <div class="head-left">
      <button
        v-if="!isCurrentMonth"
        @click="showCurrentMonth"
        class="action button today"
      >{{ currentMonth }}</button>
    </div>
    <div class="head-center">
      <button @click="goPrev" class="action button prev-month">
        <font-awesome-icon icon="angle-left"/>
      </button>
      <span class="title">{{ month }} {{ year }}</span>
      <button @click="goNext" class="action button next-month">
        <font-awesome-icon icon="angle-right" class="flush-right"/>
      </button>
    </div>
    <div class="head-right"></div>
  </div>
</template>

<script>
import calendarUtils from "../utils/calendar";
import { mapMutations } from "vuex";

export default {
  name: "CalendarHead",
  props: {},
  data() {
    return {
      monthStart: null
    };
  },
  created() {
    this.monthStart = calendarUtils.firstDateOfMonth();
  },
  computed: {
    year() {
      return this.monthStart.getFullYear();
    },
    month() {
      return calendarUtils.names.months[this.monthStart.getMonth()];
    },
    isCurrentMonth() {
      let today = new Date();
      return (
        today.getFullYear() == this.monthStart.getFullYear() &&
        today.getMonth() == this.monthStart.getMonth()
      );
    },
    currentMonth() {
      let today = new Date();
      return (
        calendarUtils.names.monthsShort[today.getMonth()] +
        " " +
        today.getFullYear()
      );
    }
  },
  methods: {
    ...mapMutations(["SET_CALENDAR_MONTH"]),
    blurTargetButton(evt) {
      if (evt.target.localName === "button") {
        evt.target.blur();
      } else {
        if (evt.target.localName === "svg") {
          evt.target.parentElement.blur();
        } else {
          evt.target.viewportElement.parentElement.blur();
        }
      }
    },
    goPrev(evt) {
      this.monthStart = calendarUtils.shiftMonth(this.monthStart, 1);
      this.blurTargetButton(evt);
    },
    goNext(evt) {
      this.monthStart = calendarUtils.shiftMonth(this.monthStart, -1);
      this.blurTargetButton(evt);
    },
    showCurrentMonth(evt) {
      this.monthStart = calendarUtils.firstDateOfMonth();
      this.blurTargetButton(evt);
    }
  },
  watch: {
    monthStart(monthStart) {
      const monthEnd = calendarUtils.lastDateOfMonth(monthStart);
      this.SET_CALENDAR_MONTH({ start: monthStart, end: monthEnd });
    }
  }
};
</script>

<style scoped>
.calendar-head {
  display: flex;
  align-items: center;
}
.head-left,
.head-right {
  flex: 1;
  text-align: center;
}
.head-center {
  flex: 5;
  text-align: center;
}
.title {
  display: inline-block;
  margin: 0 5px;
  min-width: 11em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.prev-month,
.next-month {
  cursor: pointer;
  width: 2em;
}
</style>