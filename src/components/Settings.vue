<template>
  <div
    class="md-layout settings-layout"
  >
    <h1>Settings</h1>
    <VolumeSlider v-model.number="settings.volume" />
    <div
      class="md-headline event-title"
    >
      <div style="padding-left:10px;height:42px;">
        Events
      </div>
    </div>
    <div
      class="md-layout"
    >
      <div
        class="md-layout-item md-size-30 event-list"
      >
        <md-list style="padding:0px;">
          <md-list-item
            v-for="event in settings.customEvents"
            :key="event.name"
            @click="updateSelectedEvent(event)"
            :class="{ selected: event === selectedEvent}"
          >
            <span :class="{ selected: event === selectedEvent}">{{ event.name }}</span>
          </md-list-item>
        </md-list>
      </div>
      <div
        class="md-layout-item event-container"
      >
        <TimerEvent
          v-if="selectedEvent"
          :model="selectedEvent"
          :save="save"
        />
      </div>
    </div>
    <div
      class="md-layout md-alignment-center-right"
      style="padding-top:10px;"
    >
      <md-button
        class="md-dense md-raised md-primary"
        @click="save"
      >
        SAVE SETTINGS
      </md-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ISettings } from "@/settings";
import TimerEvent from "./TimerEvent.vue";
import VolumeSlider from "./VolumeSlider.vue";
import { TimedEventModel } from "@/server/model/timed-event-model";

export default Vue.extend({
  name: "Settings",
  components: {
    TimerEvent,
    VolumeSlider
  },
  data() {
    return { settings: {} as ISettings, selectedEvent: null as TimedEventModel | null };
  },
  created() {
    this.settings = Object.assign({}, this.$electron.ipcRenderer.sendSync("get-settings"));
    console.log(this.settings);
    if (this.settings.customEvents.length > 0) {
      this.updateSelectedEvent(this.settings.customEvents[0]);
    }
  },
  mounted() {

  },
  methods: {
    updateSelectedEvent(newEvent) {
      if (this.selectedEvent) {
        // save old event
      }
      this.selectedEvent = newEvent;
    },
    save() {
      this.settings = Object.assign({}, this.$electron.ipcRenderer.sendSync("update-settings", this.settings));
    }
  }
});
</script>

<style>
.settings-layout {
  flex-direction:column;
  max-width:800px;
}

.event-title {
  background-color:black;
  color:white;
  line-height: 40px;
}
.event-list {
  border: 2px solid black;
  border-right:5px solid black;
  padding: 0px !important;
}

.event-container {
  border: 2px solid black;
  padding:10px;
}

.selected {
  background-color:black;
  color:white;
}
</style>
