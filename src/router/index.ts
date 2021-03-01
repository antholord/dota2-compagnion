import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import App from "../App.vue";
import Overlay from "../pages/Overlay/Overlay.vue";
import SettingsPage from "../pages/Settings/SettingsPage.vue";
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
    component: SettingsPage
  }
];

const router = new VueRouter({
  routes
});

export default router;
