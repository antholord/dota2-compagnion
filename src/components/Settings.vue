<template>
  <md-app>
    <md-app-content>
      <h2>Settings</h2>
      <h3>Timers</h3>
      <TimerEvent
        v-for="event in settings.customEvents"
        :key="event.name"
        :model="event"
      />
    </md-app-content>
  </md-app>
</template>

<script lang="ts">
import Vue from "vue";
import { ISettings } from "@/settings";
import TimerEvent from "./TimerEvent.vue";

export default Vue.extend({
  name: "Settings",
  components: {
    TimerEvent
  },
  data() {
    return { settings: {} as ISettings };
  },
  created() {
    this.settings = this.$electron.ipcRenderer.sendSync("get-settings");
    console.log(this.settings);
  },
  mounted() {

  }
});
</script>

<style>

</style>
