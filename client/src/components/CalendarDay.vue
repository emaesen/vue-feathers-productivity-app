<template>
  <div class="container">
    <div v-if="onCalendar">...</div>
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
  computed: {
    day() {
      return calendarUtils.formattedDate(this.date.date, {
        showYear: true
      });
    }
  },
  methods: {
    ...mapMutations(["SET_CALENDAR_DAYINFOCUS"]),
    deFocus() {
      this.SET_CALENDAR_DAYINFOCUS(null);
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
