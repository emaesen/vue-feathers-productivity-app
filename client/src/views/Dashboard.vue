<template>
  <div>
    <h1><font-awesome-icon icon="tachometer-alt" /> Dashboard</h1>
    <pa-reminders view="dashboard" :onDashboard="true"/>
    <pa-notes view="dashboard" :onDashboard="true"/>
  </div>
</template>


<script>
// @ is an alias to /src
import Reminders from "@/components/Reminders.vue";
import Notes from "@/components/Notes.vue";

export default {
  name: "Dashboard",
  components: {
    'pa-reminders': Reminders,
    'pa-notes': Notes
  },
  data: function() {
    return {};
  }
};
</script>

<style>
</style>