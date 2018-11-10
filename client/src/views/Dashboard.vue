<template>
  <div>
    <h1>Dashboard</h1>
    <Notes view="dashboard"/>
  </div>
</template>


<script>
// @ is an alias to /src
import Notes from '@/components/Notes.vue'

export default {
  name: 'Dashboard',
  components: {
    Notes
  },
  data: function() {
    return {
    };
  }
};
</script>
