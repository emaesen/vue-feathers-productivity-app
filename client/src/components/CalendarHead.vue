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
      <transition :name="'slide-' + transitionDirection" mode="out-in">
        <span :key="year+'-'+month" class="title">{{ month }} {{ year }}</span>
      </transition>
      <button @click="goNext" class="action button next-month">
        <font-awesome-icon icon="angle-right" class="flush-right"/>
      </button>
    </div>
    <div class="head-right"></div>
  </div>
</template>

<script>
import calendarUtils from "../utils/calendar";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "CalendarHead",
  props: {},
  data() {
    return {
      monthStart: null,
      transitionDirection: ""
    };
  },
  created() {
    this.setMonthStart();
  },
  computed: {
    ...mapGetters({ calendarState: "calendar" }),
    today() {
      return this.calendarState.today;
    },
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
    setMonthStart() {
      this.monthStart =
        (this.calendarState &&
          this.calendarState.month &&
          this.calendarState.month.start) ||
        calendarUtils.firstDateOfMonth();
    },
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
      this.transitionDirection = "right";
      this.monthStart = calendarUtils.shiftMonth(this.monthStart, 1);
      this.blurTargetButton(evt);
    },
    goNext(evt) {
      this.transitionDirection = "left";
      this.monthStart = calendarUtils.shiftMonth(this.monthStart, -1);
      this.blurTargetButton(evt);
    },
    showCurrentMonth(evt) {
      this.transitionDirection = "up";
      this.monthStart = calendarUtils.firstDateOfMonth();
      this.blurTargetButton(evt);
    }
  },
  watch: {
    today: "setMonthStart",
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
  transition: all 0.2s;
}
.slide-left-enter,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(18px);
}
.slide-right-enter,
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-18px);
}
.slide-up-enter,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-9px);
}
.prev-month,
.next-month {
  cursor: pointer;
  width: 2em;
}
</style>