<template>
  <div id="app">
    <md-app>
      <md-app-content>
        <Settings ref="settingsComponent" />
      </md-app-content>
    </md-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Settings from "./Settings.vue";
export default Vue.extend({
  name: "App",
  components: {
    Settings
  }
});
</script>

<style>
#app {
  height: 100vh;
}

.md-app {
  height: 100%;
}
</style>
