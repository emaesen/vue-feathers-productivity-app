<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/register">Register</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: Helvetica, Arial, sans-serif;
  position: relative;
  color: #2c3e50;
  font-size: 14px;
}
#nav {
  padding: 0 0 1em 0;
  position: relative;
  right: 0;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #007bf9;
    }
  }
}
</style>
