<template>
  <div class="clock">
    <div class="date">{{ clock.date }}</div>
    <div class="time">
      {{ clock.time }}
      <span class="ampm">{{ clock.ampm }}</span>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import calendarUtils from "../utils/calendar";

export default {
  name: "Clock",
  data() {
    return {
      clock: {
        time: "",
        date: "",
        ampm: ""
      },
      timerID: "",
      showYear: false,
      showSeconds: false,
      showAMPM: true,
      updateCounter: 0
    };
  },
  created() {
    this.startClock();
  },
  updated() {
    this.updateCounter++;
    // (re)start (resync) the clock each hour
    if (this.updateCounter > 60) {
      this.startClock();
      this.updateCounter = 0;
    }
  },
  destroyed() {
    this.stopClock();
  },
  methods: {
    ...mapMutations(["SET_TIME_TICK"]),
    startClock() {
      this.stopClock();
      let multiplier = this.showSeconds ? 1 : 60;
      let delay = 0;
      console.log("Start the clock");
      if (!this.showSeconds) {
        delay = 60 - new Date().getSeconds();
        this.updateClockDisplay();
      }
      setTimeout(() => {
        this.updateClockDisplay();
        this.timerID = setInterval(this.updateClockDisplay, multiplier * 1000);
      }, delay * 1000);
    },
    stopClock() {
      if (this.timerID) {
        console.log("Stop the clock");
        clearInterval(this.timerID);
      }
    },
    updateClockDisplay() {
      let cd = new Date();
      // store time centrally
      // so we only have to run one clock in our application
      this.SET_TIME_TICK(cd.getTime());
      let time = calendarUtils.formattedTime(cd, {
        ampm: this.showAMPM,
        seconds: this.showSeconds
      });
      if (this.showAMPM) {
        if (this.clock.ampm !== time.ampmStr) {
          this.clock.ampm = time.ampmStr;
        }
        this.clock.time = time.timeStr;
      } else {
        this.clock.time = time;
      }

      if (cd.getDate() !== this.dayOfMonth) {
        this.clock.date = calendarUtils.formattedDate(cd, {
          showYear: this.showYear,
          shortForm: true
        });
        this.dayOfMonth = cd.getDate();
      }
    }
  }
};
</script>

<style scoped>
.clock {
  margin: 0em 2em;
  display: inline-block;
  font-family: monospace;
  text-align: center;
  vertical-align: middle;
  color: #daf6ff;
  text-shadow: 0 0 9px rgb(157, 225, 248),
               0 0 18px rgba(50, 199, 248, 0.836),  
               0 0 3px rgb(144, 225, 248);
}
.time {
  letter-spacing: 0.2em;
}
.date {
  letter-spacing: 0.1em;
}
.ampm {
  margin-left: -0.5em;
  font-size: 75%;
}
</style>
