<template>
  <div id="side-notifications">
    <div v-if="notifications.length > 0">
      <div
        v-for="(n) in notifications"
        :key="n.id"
      >
        {{ gameTime }}
        <progress
          :value="gameTime - n.createdAt"
          :max="n.expireAt - gameTime"
        ></progress>
        <img :src="'icons/' + n.icon">
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
          this.$emit("upcoming-notification-expired", n);
          console.log("notification ended");
        }
      });
    }
  }
});
</script>

<style scoped>
  #side-notifications {
    position: absolute;
    top: 10vh;
    right: 1vh;
  }
  img {
    height:40px !important;
  }
   progress {
     -webkit-appearance: none;
   appearance: none;
    width:100px;
    height:20px;
    padding-right:5px;
  }
  progress[value]::-webkit-progress-bar {
  background-color: #eee;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
}
@-webkit-keyframes animate-stripes {
   100% { background-position: -100px 0px; }
}

@keyframes animate-stripes {
   100% { background-position: -100px 0px; }
}

</style>
