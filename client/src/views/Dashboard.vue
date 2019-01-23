<template>
  <div @click="toggleCollapse">
    <h1>
      <font-awesome-icon icon="tachometer-alt"/>Dashboard
    </h1>
    <pa-reminders view="dashboard" :onDashboard="true" class="section"/>
    <pa-todos view="dashboard" :onDashboard="true" class="section"/>
    <pa-calendar view="dashboard" :onDashboard="true" class="section"/>
    <pa-notes view="dashboard" :onDashboard="true" class="section"/>
  </div>
</template>


<script>
// @ is an alias to /src
import Reminders from "@/components/Reminders.vue";
import Todos from "@/components/Todos.vue";
import Notes from "@/components/Notes.vue";
import Calendar from "@/components/Calendar.vue";

export default {
  name: "Dashboard",
  components: {
    "pa-reminders": Reminders,
    "pa-todos": Todos,
    "pa-notes": Notes,
    "pa-calendar": Calendar
  },
  data() {
    return {};
  },
  methods: {
    setContentStyleProps(el, doSet) {
      doSet = doSet === false ? false : true;
      let elHeight = el.offsetHeight;
      if (doSet) {
        // set max-height to actual section height
        // (to allow for non-delay smooth open/close transition)
        el.style.maxHeight = elHeight + "px";
        // calculate transition duration such that the transition speed
        // is fairly consistent for each dashboard section. (in seconds)
        el.style.transitionDuration = 0.3 + elHeight / 500 + "s";
      } else {
        el.style.maxHeight = "";
      }
    },
    toggleCollapse(evt) {
      let className = "section-collapsed";
      let el = evt.target;
      if (el.localName === "section" && el.classList) {
        if (el.classList.contains(className)) {
          el.classList.remove(className);
          setTimeout(() => this.setContentStyleProps(el, false), 2000);
        } else {
          this.setContentStyleProps(el);
          this.$nextTick(function() {
            el.classList.add(className);
          });
        }
      }
    }
  }
};
</script>

<style>
.section {
  transition: all 0.6s;
}
.section-collapsed {
  min-height: 1em !important;
  max-height: 2em !important;
  overflow: hidden;
}
.section-collapsed .button.absolute,
.section-collapsed > div.controls {
  display: none !important;
}
</style>