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

export default {
  name: "Clock",
  data() {
    return {
      clock: {
        time: "",
        date: "",
        ampm: ""
      },
      week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      month: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
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
        this.updateTime();
      }
      setTimeout(() => {
        this.updateTime();
        this.timerID = setInterval(this.updateTime, multiplier * 1000);
      }, delay * 1000);
    },
    stopClock() {
      if (this.timerID) {
        console.log("Stop the clock");
        clearInterval(this.timerID);
      }
    },
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
    updateTime() {
      let cd = new Date();
      let pz = this.padZeros;
      let hours = cd.getHours();
      let ampm = "";
      // store time centrally
      // so we only have to run one clock in our application
      this.SET_TIME_TICK(cd.getTime());
      if (this.showAMPM) {
        ampm = hours > 12 ? "PM" : "AM";
        if (this.clock.ampm !== ampm) {
          this.clock.ampm = ampm;
        }
        if (hours > 12) {
          hours = hours - 12;
        }
      }
      this.clock.time = hours + ":" + pz(cd.getMinutes(), 2);
      if (this.showSeconds) {
        this.clock.time += ":" + pz(cd.getSeconds(), 2);
      }
      if (cd.getDate() !== this.dayOfMonth) {
        this.updateDate(cd);
        this.dayOfMonth = cd.getDate();
      }
    },
    updateDate(cd) {
      this.clock.date =
        this.week[cd.getDay()] +
        " " +
        this.month[cd.getMonth()] +
        " " +
        cd.getDate();
      if (this.showYear) {
        this.clock.date += " " + cd.getFullYear();
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
  text-shadow: 0 0 10px rgba(10, 175, 230, 1), 0 0 20px rgba(10, 175, 230, 0.5);
}
.time {
  letter-spacing: 0.2em;
}
.date {
  letter-spacing: 0.1em;
}
.ampm {
  margin-left: 0.5em;
  font-size: 75%;
}
</style>
