/* eslint-disable no-self-assign */
<template>
  <div id="overlay-container">
    <UpcomingNotifications
      :notifications="upcomingNotifications"
      @upcoming-notification-expired="upcomingNotificationExpired"
    />
    <ActiveNotifications
      :notifications="activeNotifications"
      @active-notification-expired="activeNotificationExpired"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GameStateModel } from "@/server/model/game-state-model";
import { TimedEventModel } from "@/server/model/timed-event-model";
import ActiveNotifications from "@/pages/Overlay/ActiveNotifications.vue";
import UpcomingNotifications from "@/pages/Overlay/UpcomingNotifications.vue";

export interface UINotification {
  id : number
  message?: string,
  icon: string,
  expireAt: number,
  createdAt: number
}

export const gameInfo = Vue.observable({ time: 0 });

export default Vue.extend({
  name: "App",
  components: {
    ActiveNotifications,
    UpcomingNotifications
  },
  data: function() {
    return {
      upcomingNotifications: [] as UINotification[],
      activeNotifications: [] as UINotification[]
    };
  },
  created() {
    this.$electron.ipcRenderer.on("game-event-notification", (event, data: TimedEventModel) => {
      this.upcomingNotifications.push({
        id: Date.now() + Math.random(),
        icon: data.icon,
        expireAt: gameInfo.time + data.duration,
        createdAt: gameInfo.time
      });
    });
    this.$electron.ipcRenderer.on("game-event-trigger", (event, data: TimedEventModel) => {
    });

    this.$electron.ipcRenderer.on("game-time", (event, data) => {
      gameInfo.time = data;
    });
  },
  methods: {
    activeNotificationExpired(notification: UINotification) {
      const index = this.activeNotifications.findIndex(n => n.id === notification.id);
      if (index) {
        this.$delete(this.activeNotifications, index);
        // this.activeNotifications.splice(index, 1);
      }
    },
    upcomingNotificationExpired(notification: UINotification) {
      const index = this.upcomingNotifications.findIndex(n => n.id === notification.id);
      console.log(index);
      if (index > -1) {
        this.$delete(this.upcomingNotifications, index);
      }
    }
  },
  beforeDestroy() {
    this.$electron.ipcRenderer.removeAllListeners("game-event-notification");
    this.$electron.ipcRenderer.removeAllListeners("game-event-trigger");
    this.$electron.ipcRenderer.removeAllListeners("game-time");
  }
});
</script>

<style scoped>
  #overlay-container {
    width:100%;
    height:30%;
  }
  #side-notifications {
    float:right;
  }
  #middle-notifications {
    position: relative;
    text-align: center;
    color:white;
  }
  img {
    height:70px !important;
  }
</style>
