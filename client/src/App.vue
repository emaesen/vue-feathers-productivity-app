<template>
  <div id="app">
    <div id="nav">
      <div v-if="user" class="nav-item">
        <span class="info">
          {{ userName }}
        </span>
        <a href="#" @click.prevent="logout" class="action button">Logout</a>
      </div>
    </div>
    <router-view/>
  </div>
</template>


<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',
  data: function() {
    return {
    };
  },
  computed: {
    ...mapState('auth', { user: 'user' }),
    userName() {
      console.log({user: this.user});
      return "Logged in as “" + this.user.username + "” ⇾ ";
    }
  },
  methods: {
    ...mapActions('auth', { authLogout: 'logout'}),
    logout() {
      console.log("logging out...");
      this.authLogout().then(() => this.$router.push('login'));
    }
  }
};
</script>

<style lang="less">
body {
  color: #e9e4f2;
  background-color: #17161c;
  margin: 9px;
}
section {
  padding: 5px;
  background-color: #212027;
  border: 1px solid #2c2b31;
  border-radius: 5px;
}
input, textarea, select, button {
  background-color: #000;
  color: #e9e4f2;
  border: 1px solid #333;
  border-radius: 5px;
  padding: 5px 10px;
}
input:focus {
  outline-color: #888;
}
input[type="submit"] {
  cursor: pointer;
}
input[type="submit"]:hover {
  border-color: #888;
}
input[type="submit"]:disabled {
  cursor: default;
  color: #e9e4f250;
}
input[type="submit"].loading:disabled {
  color: #e9e4f290;
}
input:invalid + span.icon:after {
  content: '✖';
  color: #f00;
  padding-left: 5px;
}
input:valid + span.icon:after {
  content: '✓';
  color: #26b72b;
  padding-left: 5px;
}
fieldset {
  border: 1px solid #555;
  border-radius: 10px;
  display: inline-block;
}
legend {
  margin:1em 0;
  font-size: 1.1rem;
}
label {
  display:flex;
}
input {
  margin-bottom:1em;
}
#app {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14px;
}
#nav {
  position: absolute;
  right: 9px;
  a {
    font-weight: bold;
    &.router-link-exact-active {
      color: #edf2e4;
      cursor: default;
    }
  }
}
a, .action {
  cursor:pointer;
  text-decoration: none;
  letter-spacing: 1px;
  color: #bdb1db;
  font-style: normal;
}
.action.button {
  border:1px solid #62518c;
  background-color: #150550;
  padding: 2px 5px;
  margin: 5px 0;
  display: inline-block;
  border-radius: 5px;
}
.action.button + .action.button{
  margin-left: 5px;
}
.actionable {
  cursor:pointer;
}
.info {
  color: #e9e4f272;
}
.float {
  float: left;
}
.float.right {
  float: right;
}
.nav-item {
  display: inline;
}
</style>
