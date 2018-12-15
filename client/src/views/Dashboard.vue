<template>
  <div @click="toggleCollapse">
    <h1>
      <font-awesome-icon icon="tachometer-alt"/>Dashboard
    </h1>
    <pa-reminders view="dashboard" :onDashboard="true" class="section"/>
    <pa-notes view="dashboard" :onDashboard="true" class="section"/>
    <pa-calendar view="dashboard" :onDashboard="true" class="section"/>
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
.section {
  transition: all 0.6s;
  max-height: 1000px;
  overflow-y: auto;
}
.section-collapsed {
  max-height: 2em;
  overflow: hidden;
}
.section-collapsed .button.absolute,
.section-collapsed > div.controls {
  display: none !important;
}
</style>