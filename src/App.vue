<template>
  <div id="app">
    <md-app>
      <md-app-content>
        <pre>{{ gameTime }}</pre>
        <pre>{{ gameNotifications }}</pre>

        <Settings ref="settingsComponent" />
      </md-app-content>
    </md-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GameStateModel } from "./server/model/game-state-model";
import { TimedEventModel, timedEvents } from "@/server/model/timed-event-model";
import Settings from "@/components/Settings.vue";

export default Vue.extend({
  name: "App",
  components: {
    Settings
  },
  data: function() {
    return { gameTime: "00:00", gameNotifications: "" };
  },
  mounted() {
    this.$electron.ipcRenderer.on("game-event-notification", (event, data: TimedEventModel) => {
      this.gameNotifications = `Event ${data.name} happening in ${data.notificationDuration}`;
      const audio = new Audio(`/sounds/${data.soundFileName}`);
      // this is a hack since no vuex
      audio.volume = (this.$refs.settingsComponent as any)?.settings?.volume || 0.5;
      audio.play();
    });
    this.$electron.ipcRenderer.on("game-event-trigger", (event, data: TimedEventModel) => {
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
#app {
  height: 100vh;
}

.md-app {
  height: 100%;
}
</style>
