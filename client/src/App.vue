<template>
  <div id="app">
    <div id="nav">
      <div v-if="user" class="nav-item">
        <span class="info">
          <font-awesome-icon icon="user-check" />
          <span class="remove-on-small-device"> Logged in as</span>
          {{ userName }}
        </span>
        <button @click="logout" class="action button"><font-awesome-icon icon="sign-out-alt" /> Logout</button>
      </div>
    </div>
    <router-view/>
  </div>
</template>


<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "App",
  data: function() {
    return {};
  },
  computed: {
    ...mapState("auth", { user: "user" }),
    userName() {
      console.log({ user: this.user });
      return "“" + this.user.username + "” ➔ ";
    }
  },
  methods: {
    ...mapActions("auth", { authLogout: "logout" }),
    logout() {
      console.log("logging out...");
      this.authLogout().then(() => this.$router.push("login"));
    }
  }
};
</script>

<style lang="less">
body {
  background-color: #17161c;
  margin: 9px;
}
body,
input,
textarea,
select,
button {
  color: #e9e4f2;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14px;
}
h2 {
  margin: 0 0 0.5em 0.2em;
}
section {
  padding: 5px;
  background-color: #212027;
  border: 1px solid #2c2b31;
  border-radius: 5px;
  position: relative;
}
hr {
  border-color: #aca0a072;
  margin: 0.5em 0 0.3em;
}
ul {
  padding-inline-start: 0;
  margin-block-start: 0.5em;
}
ul ul {
  padding-inline-start: 1em;
  margin-block-start: 0;
  margin-block-end: 0.2em;
}
li {
  list-style-type: none;
}
fieldset {
  border: 1px solid #555;
  border-radius: 10px;
  display: inline-block;
}
legend {
  margin: 1em 0;
  font-size: 1.1rem;
}
label {
  display: flex;
  margin-left: 0.3em;
  font-weight: bold;
  letter-spacing: 1px;
  font-style: italic;
  color: #cec0a1;
}
textarea {
  min-height: 4em;
  height: 8em;
  width: 90%;
  width: -moz-available;
  width: -webkit-fill-available;
}
input,
textarea,
select,
button {
  background-color: #000;
  color: #e9e4f2;
  border: 1px solid #333;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 1em;
}
input:focus,
textarea:focus,
select:focus,
button:focus {
  outline-color: #888;
  outline-width: 1px;
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
  content: "✖";
  color: #f00;
  padding-left: 5px;
}
input:valid + span.icon:after {
  content: "✓";
  color: #26b72b;
  padding-left: 5px;
}
pre {
  margin: 0.5em;
  padding: 0.5em;
}
code {
  padding: 0 0.2em;
}
pre,
code {
  color: #daefff;
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
a,
.action {
  cursor: pointer;
  text-decoration: none;
  letter-spacing: 1px;
  color: #bdb1db;
  font-style: normal;
}
.action.button {
  vertical-align: middle;
  font-weight: bold;
  border: 1px solid #62518c;
  background-color: #3e2200;
  padding: 2px 5px;
  margin: 5px 0;
  display: inline-block;
  border-radius: 5px;
  line-height: 21px;
}
.action.button + .action.button {
  margin-left: 5px;
}
button,
.actionable {
  cursor: pointer;
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
.hidden {
  visibility: hidden;
}
.svg-inline--fa {
  color: #cec0a1;
}
@media all and (max-width: 600px) {
  .remove-on-small-device {
    display: none !important;
  }
  .convert-to-block-on-small-device {
    display: block !important;
  }
}
</style>
