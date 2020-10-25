<template>
  <div id="app">
    <pre>{{ gameTime }}</pre>
    <pre>{{ gameNotifications }}</pre>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GameStateModel } from "./server/model/game-state-model";
import { TimedEventModel, timedEvents } from "@/server/model/timed-event-model";
// @ts-ignore
import bounty from "./assets/bounty.wav";
// @ts-ignore
import outpost from "./assets/outpost.wav";

export default Vue.extend({
  name: "App",
  data: function() {
    return { gameTime: "00:00", gameNotifications: "" };
  },
  mounted() {
    this.$electron.ipcRenderer.on("game-event-notification", (event, data: TimedEventModel) => {
      this.gameNotifications = `Event ${data.name} happening in ${data.notificationLength}`;
      if (data.name === timedEvents.bounty.name) {
        const audio = new Audio(bounty);
        audio.play();
      } else if (data.name === timedEvents.outpost.name) {
        const audio = new Audio(outpost);
        audio.play();
      }
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
