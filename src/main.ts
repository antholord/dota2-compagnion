import Vue from "vue";
import App from "./App.vue";

// ts-ignore
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
// import "vue-material/dist/theme/default-dark.css";

import VueElectron from "vue-electron";

Vue.config.productionTip = false;
Vue.use(VueElectron as any);
Vue.use(VueMaterial);
new Vue({
  render: h => h(App)
}).$mount("#app");
