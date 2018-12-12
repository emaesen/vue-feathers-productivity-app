<template>
  <div @click="toggleCollapse">
    <h1>
      <font-awesome-icon icon="tachometer-alt"/>Dashboard
    </h1>
    <pa-reminders view="dashboard" :onDashboard="true"/>
    <pa-notes view="dashboard" :onDashboard="true"/>
    <pa-calendar view="dashboard" :onDashboard="true"/>
  </div>
</template>


<script>
// @ is an alias to /src
import Reminders from "@/components/Reminders.vue";
import Notes from "@/components/Notes.vue";
import Calendar from "@/components/Calendar.vue";

export default {
  name: "Dashboard",
  components: {
    "pa-reminders": Reminders,
    "pa-notes": Notes,
    "pa-calendar": Calendar
  },
  data: function() {
    return {};
  },
  methods: {
    toggleCollapse(evt) {
      let className = "section-collapsed";
      let el = evt.target;
      if (el.localName === "section" && el.classList) {
        if (el.classList.contains(className)) {
          el.classList.remove(className);
        } else {
          el.classList.add(className);
        }
      }
    }
  }
};
</script>

<style>
.section-collapsed {
  height: 2em;
  overflow: hidden;
}
.section-collapsed > div {
  display: none !important;
}
</style>