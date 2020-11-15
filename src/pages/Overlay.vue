<template>
  <div id="overlay">
    {{ gameTime }}
    {{ gameNotifications }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GameStateModel } from "@/server/model/game-state-model";
import { TimedEventModel } from "@/server/model/timed-event-model";
import Settings from "@/components/Settings.vue";

export default Vue.extend({
  name: "App",
  components: {
    // Settings
  },
  data: function() {
    return { gameTime: "00:00", gameNotifications: "" };
  },
  created() {
    this.$electron.ipcRenderer.on("game-event-notification", (event, data: TimedEventModel) => {
      console.log("received event");
      this.gameNotifications = `Event ${data.name} happening in ${data.notificationDuration}`;
    });
    this.$electron.ipcRenderer.on("game-event-trigger", (event, data: TimedEventModel) => {
      console.log("received event");
      this.gameNotifications = `Event ${data.name} happening now!!`;
    });
    this.$electron.ipcRenderer.on("game-time", (event, data) => {
      const minutes: number = Math.floor(data / 60);
      const seconds: number = data % 60;
      this.gameTime = `${minutes}:${seconds}`;
    });
  }
});
</script>

<style>

</style>
