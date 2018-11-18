import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Register from "./views/Register.vue";
import Login from "./views/Login.vue";

import store from "./store";

Vue.use(Router);

function checkAuth(to, from, next, target) {
  store
    .dispatch("auth/authenticate")
    .then(() => {
      console.log("authenticated ...");
      // authentication succeeded
      // if target is defined, redirect to target, else stay on page
      next(target);
    })
    .catch(() => {
      console.log("not authenticated ...");
      // authentication failed
      // redirect to login
      next("/login");
    });
}
function logOut(to, from, next) {
  console.log("logging out...");
  store.dispatch("auth/logout").then(() => {
    // Clear the store state of the notes userService
    // To prevent data from previous logins to bleed through
    store.commit("notes/clearAll");
    next();
  });
}

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      beforeEnter(to, from, next) {
        checkAuth(to, from, next, "dashboard");
      }
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      beforeEnter(to, from, next) {
        logOut(to, from, next);
      },
      meta: {
        title: "Register"
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      beforeEnter(to, from, next) {
        logOut(to, from, next);
      },
      meta: {
        title: "Login"
      }
    },
    {
      path: "/dashboard",
      name: "dashboard",
      // route level code-splitting
      // this generates a separate chunk (dashboard.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "dashboard" */ "./views/Dashboard.vue"),
      beforeEnter: checkAuth,
      meta: {
        title: "Dashboard"
      }
    }
  ]
});

// Hook to set page tile and meta tags
// (https://alligator.io/vuejs/vue-router-modify-head/)
// usage:
/*
meta: {
      title: 'My Page Title',
      metaTags: [
        {
          name: 'description',
          content: 'My description.'
        },
        {
          property: 'og:description',
          content: 'My description'
        }
      ]
    },
*/
// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
    el => el.parentNode.removeChild(el)
  );

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map(tagDef => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create, so we don't interfere with other ones.
      tag.setAttribute("data-vue-router-controlled", "");

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router;
