<template>
  <div v-if="notifications.length > 0">
    <div
      v-for="n in notifications"
      :key="n.id"
    >
      <div id="middle-notification">
        <img :src="'icons/' + n.icon">
        {{ gameTime }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GameStateModel } from "@/server/model/game-state-model";
import { TimedEventModel } from "@/server/model/timed-event-model";
import Settings from "@/components/Settings.vue";
import { gameInfo, UINotification } from "./Overlay.vue";

export default Vue.extend({
  name: "App",
  components: {
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    notifications: {
      type: Array as () => UINotification[]
    }
  },
  computed: {
    gameTime(): number {
      return gameInfo.time;
    }
  },
  watch: {
    gameTime: function(newTime) {
      this.notifications.forEach(n => {
        if (n.expireAt <= newTime) {
          this.$emit("active-notification-expired", n);
          console.log("notification ended");
        }
      });
    }
  }
});
</script>

<style scoped>
  #middle-notification {
    position: relative;
    text-align: center;
    color:white;
  }
  img {
    height:70px !important;
  }
</style>
