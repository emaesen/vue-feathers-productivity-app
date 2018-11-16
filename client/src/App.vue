<template>
  <div id="app">
    <div id="nav">
      <div v-if="user" class="nav-item">
        <span class="info">
          <font-awesome-icon icon="user-check" /> {{ userName }}
        </span>
        <button @click="logout" class="action button"><font-awesome-icon icon="sign-out-alt" /> Logout</button>
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
      return "Logged in as “" + this.user.username + "” ➔ ";
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
  background-color: #17161c;
  margin: 9px;
}
body, input, textarea, select, button {
  color: #e9e4f2;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14px;
}
h2 {
  margin: 0 0 .5em .2em;
}
section {
  padding: 5px;
  background-color: #212027;
  border: 1px solid #2c2b31;
  border-radius: 5px;
  position: relative;
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
textarea {
  min-height:4em;
  height:8em;
  width: 90%;
  width: -moz-available;
  width: -webkit-fill-available;
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
input[type="submit"]:disabled,
button:disabled {
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
input {
  margin-bottom:1em;
}
pre {
  margin: .5em;
  padding: .5em;
}
code {
  padding: 0 .2em;
}
pre, code {
  background-color: #27262d;
  border: 1px solid #474650;
  border-radius: 5px;
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
  vertical-align: middle;
  font-weight: bold;
  border:1px solid #62518c;
  background-color: #3e2200;
  padding: 2px 5px;
  margin: 5px 0;
  display: inline-block;
  border-radius: 5px;
  min-height: 25px;
}
.action.button + .action.button{
  margin-left: 5px;
}
button,
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
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.top {
  top: 0;
}
.right {
  right: 0;
}
.nav-item {
  display: inline;
}
.svg-inline--fa {
  color: #cec0a1;
}
</style>
