<template>
  <div>
    <h1>Dashboard</h1>
  </div>
</template>


<script>
import { mapActions } from 'vuex';

export default {
  name: 'Dashboard',
  data: function() {
    return {
    };
  },
  created: function() {
    this.authenticate().then(resp => {
      console.log('authenticated user: ', resp);
      //stay
    }).catch(e => {
      console.error('Authentication error: ', e);
      this.$router.push('/login');
    })

  },
  methods: {
    ...mapActions('auth', ['authenticate'])
  }
};
</script>
