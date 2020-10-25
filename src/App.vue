<template>
  <div id="app">
    <pre>{{ gameTime }}</pre>
    <pre>{{ gameNotifications }}</pre>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GameStateModel } from "./server/model/game-state-model";

export default Vue.extend({
  name: "App",
  data: function() {
    return { gameTime: "00:00", gameNotifications: "" };
  },
  mounted() {
    this.$electron.ipcRenderer.on("game-notifications", (event, data) => {
      this.gameNotifications = data;
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
