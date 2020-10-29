<template>
  <div>
    <h1>Settings</h1>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-list>
          <md-list-item
            v-for="event in settings.customEvents"
            :key="event.name"
            @click="updateSelectedEvent(event)"
          >
            {{ event.name }}
          </md-list-item>
        </md-list>
      </div>
      <div class="md-layout-item">
        <TimerEvent
          v-if="selectedEvent"
          :model="selectedEvent"
          :save="save"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ISettings } from "@/settings";
import TimerEvent from "./TimerEvent.vue";
import { TimedEventModel } from "@/server/model/timed-event-model";

export default Vue.extend({
  name: "Settings",
  components: {
    TimerEvent
  },
  data() {
    return { settings: {} as ISettings, selectedEvent: null as TimedEventModel | null };
  },
  created() {
    this.settings = Object.assign({}, this.$electron.ipcRenderer.sendSync("get-settings"));
    console.log(this.settings);
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

</style>
