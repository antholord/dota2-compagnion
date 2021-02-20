<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "App"
});
</script>

<style>
html {
   background-color: transparent !important;
 }
/* body {
   background-color: transparent;
 }
 #app {
   background-color: transparent;
 } */
</style>
