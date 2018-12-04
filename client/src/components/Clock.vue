<template>
  <div class="clock">
    <div class="date">{{ clock.date }}</div>
    <div class="time">{{ clock.time }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clock: {
        time: '',
        date: ''
      },
      week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      timerID: '',
      showYear: false
    }
  },
  created() {
    this.timerID = setInterval(this.updateTime, 1000);
  },
  methods: {
    padZeros(n, td){
			var ns = n.toString(), l = ns.length, z = '';
			if (td > l) {
					for (var i = l; i < td; i++) {
							z += '0';
					}
			}
      return z + ns;
    },
    updateTime() {
      let cd = new Date();
      let pz = this.padZeros;
      this.clock.time = pz(cd.getHours(), 2) + ':' + pz(cd.getMinutes(), 2) + ':' + pz(cd.getSeconds(), 2);
      if (this.showYear) {
        this.clock.date += ' ' + cd.getFullYear();
      }
      if (cd.getDate() !== this.dayOfMonth) {
        this.updateDate(cd);
        this.dayOfMonth = cd.getDate();
      }
    },
    updateDate(cd) {
      this.clock.date = this.week[cd.getDay()] + ' ' + this.month[cd.getMonth()] + ' ' + cd.getDate();
    }
  }
}
</script>

<style scoped>
.clock {
  margin: 0em 1em;
  display: inline-block;
  font-family: monospace;
  color: #ffffff;
  text-align: center;
  vertical-align: middle;
  color: #daf6ff;
  text-shadow: 0 0 20px rgba(10, 175, 230, 1), 0 0 20px rgba(10, 175, 230, 0);
}
.time {
  letter-spacing: 0.2em;
}
.date {
  letter-spacing: 0.1em;
}
</style>
