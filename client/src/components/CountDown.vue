<template>
  <div class="countdown" :class="[animationClass, {reverse:isReversed},  {pause:isPaused}]">
    <span v-if="isReversed && !isPaused">-</span>
    <span v-if="displayDays" class="days">{{ days + "d" }}</span>
    <span v-if="displayDays && displayHours" class="divider">:</span>
    <span v-if="displayHours" class="hours">{{ hours + "h" }}</span>
    <span v-if="displayHours && displayMinutes" class="divider">:</span>
    <span v-if="displayMinutes" class="minutes">{{ minutes + "m" }}</span>
    <span v-if="displayMinutes && displaySeconds" class="divider">:</span>
    <span v-if="displaySeconds" class="seconds">{{ seconds + "s" }}</span>
    <span v-if="isPaused">⊘</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const NRSECINMINUTE = 60;
const NRSECINHOUR = 60 * NRSECINMINUTE;
const NRSECINDAY = 24 * NRSECINHOUR;

export default {
  name: "CountDown",
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
      seconds: 0,
      minutesToShowSeconds: 5,
      hoursToShowMinutes: 3,
      daysToShowHours: 1,
      intervalTimerId: null,
      isReversed: false,
      isPaused: false,
      minutesToPauseAtEnd: 5
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
      const minutesLeft = Math.abs(secondsLeft / 60);

      if (secondsLeft < 0) {
        this.isReversed = true;
        secondsLeft = -secondsLeft;
      } else {
        this.isReversed = false;
      }

      this.days =
        secondsLeft > this.daysToShowHours * NRSECINDAY
          ? Math.round(secondsLeft / NRSECINDAY)
          : Math.floor(secondsLeft / NRSECINDAY);
      if (Math.floor(secondsLeft / NRSECINDAY)) {
        secondsLeft =
          secondsLeft % (Math.floor(secondsLeft / NRSECINDAY) * NRSECINDAY);
      }

      this.hours =
        secondsLeft > this.hoursToShowMinutes * NRSECINHOUR
          ? Math.round(secondsLeft / NRSECINHOUR)
          : Math.floor(secondsLeft / NRSECINHOUR);
      if (Math.floor(secondsLeft / NRSECINHOUR)) {
        secondsLeft =
          secondsLeft % (Math.floor(secondsLeft / NRSECINHOUR) * NRSECINHOUR);
      }

      this.minutes =
        secondsLeft > this.minutesToShowSeconds * NRSECINMINUTE
          ? Math.round(secondsLeft / NRSECINMINUTE)
          : Math.floor(secondsLeft / NRSECINMINUTE);

      if (Math.floor(secondsLeft / NRSECINMINUTE)) {
        secondsLeft =
          secondsLeft %
          (Math.floor(secondsLeft / NRSECINMINUTE) * NRSECINMINUTE);
      }

      this.seconds = secondsLeft;

      if (
        minutesLeft < this.minutesToShowSeconds &&
        !this.showSeconds &&
        !this.intervalTimerId &&
        !this.isReversed &&
        !this.isPaused
      ) {
        this.intervalTimerId = setInterval(this.setTimeLeft, 1000);
        this.setTimeLeft();
        setTimeout(() => {
          clearInterval(this.intervalTimerId);
          this.seconds = 0;
          this.intervalTimerId = null;
          this.isPaused = true;
          this.setTimeLeft();
          if (this.minutesToPauseAtEnd) {
            setTimeout(() => {
              this.isPaused = false;
              this.setTimeLeft();
            }, this.minutesToPauseAtEnd * 60 * 1000);
          }
        }, 1000 * 60 * minutesLeft);
      }
    }
  },
  watch: {
    timeTick() {
      if (!this.intervalTimerId && !this.isPaused) {
        this.setTimeLeft();
      }
    }
  },
  computed: {
    ...mapGetters(["timeTick"]),
    displayDays() {
      return !this.isPaused && this.days > 0;
    },
    displayHours() {
      return (
        !this.isPaused && this.days < this.daysToShowHours && this.hours > 0
      );
    },
    displayMinutes() {
      return (
        !this.isPaused &&
        this.days < this.daysToShowHours &&
        this.hours < this.hoursToShowMinutes &&
        this.minutes > 0
      );
    },
    displaySeconds() {
      return !this.isPaused && (this.showSeconds || this.intervalTimerId);
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
  color: #fff3e8;
  text-shadow: 0 0 10px rgb(255, 188, 2), 0 0 20px rgba(255, 188, 2, 0.5);
}
.reverse,
.pause {
  color: #ffdfde;
  text-shadow: 0 0 10px rgb(255, 0, 0), 0 0 20px rgba(255, 0, 0, 0.5);
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
  0%,
  100% {
    opacity: 0.75;
  }
  50% {
    opacity: 1;
  }
}
</style>
