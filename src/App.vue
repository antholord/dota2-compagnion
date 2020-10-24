<template>
  <div id="app">
    <pre>{{ lastGameInfo }}</pre>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GameState } from "./definitions/game-state";

export default Vue.extend({
  name: "App",
  data: function() {
    return {
      lastGameInfo: null as GameState | null
    };
  },
  mounted() {
    this.$electron.ipcRenderer.on("game-info-update", (event, data) => {
      this.lastGameInfo = data;
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
