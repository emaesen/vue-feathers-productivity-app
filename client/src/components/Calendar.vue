<template>
  <section id="calendar">
    <h2 class="calendar">
      <font-awesome-icon icon="calendar-alt"/>Calendar
    </h2>
    <transition name="fade" mode="out-in">
      <pa-calendar-day v-if="dayInFocus" :date="dayInFocus" key="day"/>
      <pa-calendar-month v-if="!dayInFocus" key="month"/>
    </transition>
  </section>
</template>

<script>
import CalendarMonth from "./CalendarMonth";
import CalendarDay from "./CalendarDay";
import { mapGetters } from "vuex";

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
  computed: {
    ...mapGetters({ calendarState: "calendar" }),
    dayInFocus() {
      return this.calendarState.dayInFocus;
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
