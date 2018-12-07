<template>
  <div class="countdown">
    {{ targetDate.toLocaleString() }}
    <span v-if="displayDays" class="days">{{ countdown.days }}</span>
    <span v-if="displayHours" class="hours">{{ countdown.hours }}</span>
    <span v-if="displayHours && displayMinutes" class="divider">:</span>
    <span v-if="displayMinutes" class="minutes">{{ countdown.minutes }}</span>
    <span v-if="displayMinutes && displaySeconds" class="divider">:</span>
    <span v-if="displaySeconds" class="seconds">{{ countdown.seconds }}</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    targetDate: {
      type: Date
    }
  },
  data() {
    return {
      countdown: {
        days: "",
        hours: "",
        minutes: "",
        seconds: ""
      }
    };
  },
  computed: {
    ...mapGetters(["timeTick"]),
    displayDays() {
      return !!this.countdown.days;
    },
    displayHours() {
      return !!this.countdown.hours && !this.displayDays;
    },
    displayMinutes() {
      return !!this.countdown.minutes && !this.displayDays;
    },
    displaySeconds() {
      return !!this.countdown.seconds;
    }
  }
};
</script>

<style scoped>
.countdown {
  display: inline-block;
  font-family: monospace;
  text-align: center;
  vertical-align: middle;
  color: #ffebda;
  text-shadow: 0 0 10px rgb(230, 171, 10), 0 0 20px rgba(10, 175, 230, 0.5);
}
</style>
