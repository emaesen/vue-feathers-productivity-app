<template>
  <div class="countdown" :class="animationClass">
    <span v-if="days" class="days">{{ days + "d" }}</span>
    <span v-if="days && hours" class="divider">:</span>
    <span v-if="hours" class="hours">{{ hours + "h" }}</span>
    <span v-if="hours && minutes" class="divider">:</span>
    <span v-if="minutes" class="minutes">{{ minutes + "m" }}</span>
    <span v-if="minutes && seconds" class="divider">:</span>
    <span v-if="seconds" class="seconds">{{ seconds + "s" }}</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const NRSECINMINUTE = 60;
const NRSECINHOUR = 60 * NRSECINMINUTE;
const NRSECINDAY = 24 * NRSECINHOUR;

export default {
  props: {
    targetDate: {
      type: Date
    },
    showSeconds: {
      type: Boolean,
      default: false
    },
    animationClass: {
      type: String,
      default: "pulse"
    }
  },
  data() {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  },
  created() {
    this.setTimeLeft();
  },
  methods: {
    padZeros(n, td) {
      var ns = n.toString(),
        l = ns.length,
        z = "";
      if (td > l) {
        for (var i = l; i < td; i++) {
          z += "0";
        }
      }
      return z + ns;
    },
    setTimeLeft() {
      let secondsLeft = Math.floor(
        (this.targetDate.getTime() - new Date().getTime()) / 1000
      );
      this.days = Math.floor(secondsLeft / NRSECINDAY);
      if (this.days) {
        secondsLeft = secondsLeft % (this.days * NRSECINDAY);
      }
      this.hours = Math.floor(secondsLeft / NRSECINHOUR);
      if (this.hours) {
        secondsLeft = secondsLeft % (this.hours * NRSECINHOUR);
      }
      this.minutes = Math.floor(secondsLeft / NRSECINMINUTE);
      if (this.minutes) {
        secondsLeft = secondsLeft % (this.minutes * NRSECINMINUTE);
      }
      if (this.showSeconds) {
        this.seconds = secondsLeft;
      }
    }
  },
  watch: {
    timeTick() {
      this.setTimeLeft();
    }
  },
  computed: {
    ...mapGetters(["timeTick"])
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
.pulse {
  animation: pulse 5s infinite;
  animation-timing-function: ease-in-out;
}
.pulse.fast {
  animation-duration: 1s;
}
.pulse.slow {
  animation-duration: 15s;
}
@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
