import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Register from './views/Register.vue'
import Login from './views/Login.vue'

import store from './store';

Vue.use(Router)

function checkAuth(to, from, next, target) {
  store.dispatch('auth/authenticate').then(() => {
    console.log("authenticated ...");
    // authentication succeeded
    // if target is defined, redirect to target, else stay on page
    next(target);
  }).catch(() => {
    console.log("not authenticated ...");
    // authentication failed
    // redirect to login
    next('/login');
  });
}
function logOut(to, from, next) {
  console.log("logging out...");
  store.dispatch('auth/logout').then(() => {
    next();
  });
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter(to, from, next) {
        checkAuth(to, from, next, 'dashboard')
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      beforeEnter(to, from, next) {
        logOut(to, from, next)
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter(to, from, next) {
        logOut(to, from, next)
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      // route level code-splitting
      // this generates a separate chunk (dashboard.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue'),
      beforeEnter: checkAuth
    }
  ]
})
