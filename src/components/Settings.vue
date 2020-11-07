<template>
  <div
    class="md-layout settings-layout"
  >
    <h1>Settings</h1>
    <VolumeSlider v-model.number="settings.volume" />
    <div
      class="md-headline event-title"
    >
      <div>
        Events
      </div>
      <md-button
        class="md-icon-button"
        @click="resetSettings"
        title="Reset all settings to default"
      >
        <md-icon style="color:white;">
          restore
        </md-icon>
      </md-button>
    </div>
    <div
      class="md-layout"
    >
      <div
        class="md-layout-item md-size-35 event-list"
      >
        <md-list
          style="padding:0px;"
          class="md-dense"
        >
          <md-list-item @click="addEvent">
            <div>
              <md-icon style="margin-top:-3px;padding-right:5px;">
                add_alarm
              </md-icon>
              <span style="padding-left:7px;">Add new Event</span>
            </div>
          </md-list-item>
          <md-list-item
            v-for="(event, i) in settings.customEvents"
            :key="event.name"
            @click="updateSelectedEvent(event)"
            :class="{ selected: event === selectedEvent, error: $v.settings.customEvents.$each[i].$invalid }"
          >
            <div style="display:flex;align-items:center">
              <md-checkbox
                v-model="event.enabled"
                class="list-checkbox"
                title="Toggle this event on/off"
              />
              <span :class="{ selected: event === selectedEvent}">{{ event.name }}</span>
            </div>
          </md-list-item>
        </md-list>
      </div>
      <div class="md-layout-item event-container">
        <TimerEvent
          v-if="selectedEvent"
          :model="selectedEvent"
          :save="save"
          :volume="settings.volume"
          @delete-event="deleteEvent"
        />
      </div>
    </div>
    <div class="md-layout md-alignment-center-right" style="padding-top:10px;" >
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
import TimerEvent from "./TimerEvent.vue";
import VolumeSlider from "./VolumeSlider.vue";
import ValidationMixin from "../mixins/ValidationMixin";
import mixins from "vue-typed-mixins";
import { ISettings } from "@/settings";
import { DefaultTimedEvent, TimedEventModel, TimedEventModelValidation } from "@/server/model/timed-event-model";
import { EventTimeTypeEnum } from "@/server/enums/events";
import { required, between, integer, minLength, maxLength } from "vuelidate/lib/validators";

export default mixins(ValidationMixin).extend({
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
    this.validate(this);
  },
  methods: {
    addEvent(): TimedEventModel {
      const newLength = this.settings.customEvents.push(Object.assign({}, DefaultTimedEvent));
      const newEvent = this.settings.customEvents[newLength - 1];
      this.updateSelectedEvent(newEvent);
      return newEvent;
    },
    deleteEvent(model: TimedEventModel) {
      const response = confirm("Are you sure you want to delete the Event?");
      const index = this.settings.customEvents.indexOf(model);
      if (response === true && index > -1) {
        this.settings.customEvents.splice(index);
        this.updateSelectedEvent(this.settings.customEvents[0]);
      }
    },
    updateSelectedEvent(newEvent) {
      if (this.selectedEvent) {
        // save old event
      }
      this.selectedEvent = newEvent;
    },
    save() {
      const valid = this.validate(this);
      if (valid) {
        this.settings = Object.assign({}, this.$electron.ipcRenderer.sendSync("update-settings", this.settings));
      } else {
        alert("Fix errors before saving");
      }
    },
    resetSettings() {
      const response = confirm("Are you sure you want to reset settings to default?");
      if (response === true) {
        const newSettings = this.$electron.ipcRenderer.sendSync("reset-settings");
        location.reload();
      }
    }
  },
  validations: {
    settings: {
      volume: {
        required,
        between: between(0, 100)
      },
      customEvents: {
        $each: TimedEventModelValidation
      }
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
  display:flex;
  justify-content: space-between;
}
.event-title > div {
  padding-left:10px;
  height:42px;
  line-height:42px;
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

.md-list-item.error {
  background-color:crimson;
  color:white;
}
.md-list-item {
  height: 40px;
}

.list-checkbox {
  margin: 0px 10px 0px 0px !important;
}
</style>
