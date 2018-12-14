<template>
  <section id="calendar">
    <h2 class="calendar">
      <font-awesome-icon icon="calendar-alt"/>Calendar
    </h2>
    <pa-calendar-month/>
  </section>
</template>

<script>
import CalendarMonth from "./CalendarMonth";

export default {
  name: "Calendar",
  components: {
    "pa-calendar-month": CalendarMonth
  },
  props: {
    onDashboard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
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
</style>
