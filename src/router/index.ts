import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import App from "../App.vue";
import Overlay from "../pages/Overlay.vue";
import Settings from "../pages/Settings.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/overlay",
    name: "Overlay",
    component: Overlay
  },
  {
    path: "/",
    name: "Settings",
    component: Settings
  }
];

const router = new VueRouter({
  routes
});

export default router;
