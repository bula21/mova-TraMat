/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import VueRouter, { Location, Route, RouteConfig } from "vue-router";
import DirectusAPI from "@/services/DirectusAPI";
import Login from "../views/LoginView.vue";

Vue.use(VueRouter);

// eslint-disable-next-line no-unused-vars
function ensureLoggedIn(to: Route, from: Route, next: { (to?: string | false | void | Location | ((vm: Vue) => any) | undefined): void; (): void; }) {
  if (!(to.matched.some((record) => record.meta.public))) {
    if (DirectusAPI.getToken()) {
      if (DirectusAPI.getlocalExp() > Date.now()) {
        next();
      } else {
        next({
          name: "login",
        });
      }
    } else {
      next({
        name: "login",
      });
    }
  } else {
    next();
  }
}

// eslint-disable-next-line no-unused-vars
function redirectLoggedIn(to: Route, from: Route, next: { (to?: string | false | void | Location | ((vm: Vue) => any) | undefined): void; (): void; }) {
  if (to.matched.some((record) => record.meta.disableIfLoggedIn)) {
    if (DirectusAPI.getToken()) {
      if (DirectusAPI.getlocalExp() > Date.now()) {
        next({
          name: "home",
        });
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    next();
  }
}

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "login",
    component: Login,
    beforeEnter(to, from, next) {
      redirectLoggedIn(to, from, next);
    },
    meta: {
      public: true,
      disableIfLoggedIn: true,
    },
  },
  {
    path: "/main",
    name: "main",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "search" */ "../views/MainView.vue"),
    beforeEnter(to, from, next) {
      ensureLoggedIn(to, from, next);
    },
    meta: {
      public: false,
    },
    redirect: {
      name: "home",
    },
    children: [
      {
        path: "/home",
        name: "home",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "search" */ "../components/Home.vue"),
        beforeEnter(to, from, next) {
          ensureLoggedIn(to, from, next);
        },
        meta: {
          public: false,
        },
      },
      {
        path: "/search",
        name: "search",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "search" */ "../components/SearchShipment.vue"),
        beforeEnter(to, from, next) {
          ensureLoggedIn(to, from, next);
        },
        meta: {
          public: false,
        },
      },
      {
        path: "/account",
        name: "account",
        component: () => import(/* webpackChunkName: "search" */ "../components/Account.vue"),
        beforeEnter(to, from, next) {
          ensureLoggedIn(to, from, next);
        },
        meta: {
          public: false,
        },
      },
      {
        path: "/customer",
        name: "customer",
        component: () => import(/* webpackChunkName: "search" */ "../components/Customer.vue"),
        beforeEnter(to, from, next) {
          ensureLoggedIn(to, from, next);
        },
        meta: {
          public: false,
        },
      },
      {
        path: "/new",
        name: "new",
        component: () => import(/* webpackChunkName: "search" */ "../components/NewShipment.vue"),
        beforeEnter(to, from, next) {
          ensureLoggedIn(to, from, next);
        },
        meta: {
          public: false,
        },
      },
    ],
  },
  {
    // catch all 404 - define at the very end
    path: "*",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
