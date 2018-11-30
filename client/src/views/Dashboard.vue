<template>
  <div>
    <h1><font-awesome-icon icon="tachometer-alt" /> Dashboard</h1>
    <Reminders view="dashboard"/>
    <Notes view="dashboard"/>
  </div>
</template>


<script>
// @ is an alias to /src
import Reminders from "@/components/Reminders.vue";
import Notes from "@/components/Notes.vue";

export default {
  name: "Dashboard",
  components: {
    Reminders,
    Notes
  },
  data: function() {
    return {};
  }
};
</script>
