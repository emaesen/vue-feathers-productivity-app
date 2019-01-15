<template>
  <div class="calendar-container">
    <pa-calendar-head/>
    <pa-calendar-body :events="events" :reminders="reminders" :eventCategories="eventCategories"/>
  </div>
</template>

<script>
import CalendarHead from "./CalendarHead";
import CalendarBody from "./CalendarBody";

export default {
  name: "CalendarMonth",
  components: {
    "pa-calendar-head": CalendarHead,
    "pa-calendar-body": CalendarBody
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
    return {};
  },
  mounted() {},
  watch: {},
  methods: {}
};
</script>

<style scoped>
.calendar-container {
  display: grid;
  margin: 0 auto;
  border: 1px solid #555;
  padding: 3px;
  border-radius: 5px;
}
</style>