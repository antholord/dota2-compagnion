<template>
  <div id="overlay-container">
    <UpcomingNotifications
      :notifications="upcomingNotifications"
      @upcoming-notification-expired="upcomingNotificationExpired"
      @upcoming-notification-trigger="upcomingNotificationTrigger"
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
import { ISettings } from "../../settings";

export type UINotification = {
  id : number
  message?: string,
  icon: string,
  soundFileName: string,
  expireAt: number,
  createdAt: number,
  wasTriggered: boolean
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
      settings: {} as ISettings,
      upcomingNotifications: [] as UINotification[],
      activeNotifications: [] as UINotification[]
    };
  },
  created() {
    this.settings = Object.assign({}, this.$electron.ipcRenderer.sendSync("get-settings"));
    this.$electron.ipcRenderer.on("game-event-notification", (event, data: TimedEventModel) => {
      console.log(data);
      this.upcomingNotifications.push({
        id: Date.now() + Math.random(),
        icon: data.icon,
        soundFileName: data.soundFileName,
        expireAt: gameInfo.time + data.duration,
        createdAt: gameInfo.time,
        wasTriggered: false
      });
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
      }
    },
    upcomingNotificationExpired(notification: UINotification) {
      const index = this.upcomingNotifications.findIndex(n => n.id === notification.id);
      console.log(index);
      if (index > -1) {
        this.$delete(this.upcomingNotifications, index);
      }
    },
    upcomingNotificationTrigger(notification: UINotification) {
      this.triggerEvent(notification);
      notification.wasTriggered = true;
    },
    triggerEvent(notification: UINotification) {
      const audio = new Audio(`sounds/${notification.soundFileName}`);
      audio.volume = this.settings.volume ?? 0.5;
      audio.play();
    }
  },
  beforeDestroy() {
    this.$electron.ipcRenderer.removeAllListeners("game-event-notification");
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
