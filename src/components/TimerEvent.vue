<template>
  <div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label for="name">Name</label>
          <md-input
            name="name"
            v-model="model.name"
          />
        </md-field>
        <div
          class="md-layout-item"
        >
          <md-field style="width:75px;">
            <label for="duration">Duration (seconds)</label>
            <md-input
              name="duration"
              v-model="model.duration"
            />
          </md-field>
        </div>
        <div
          class="md-layout-item"
        >
          <md-field>
            <label for="notification">Notification Duration</label>
            <md-input
              name="notification"
              v-model="model.notification"
            />
          </md-field>
        </div>
        <div
          class="md-layout-item"
        >
          <md-autocomplete
            v-model="model.soundFileName"
            :md-options="countries"
          >
            <label>Country</label>
          </md-autocomplete>
        </div>
      </div>
    </div>
    <md-button
      class="md-dense md-raised md-primary"
      @click="save"
    >
      UPDATE
    </md-button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ISettings } from "@/settings";
import { defaultTimedEvent, TimedEventModel } from "@/server/model/timed-event-model";
import { EventTimeTypeEnum } from "@/server/enums/events";

export default Vue.extend({
  name: "TimerEvent",
  props: {
    model: {
      type: Object as () => TimedEventModel,
      default() {
        return Object.assign({}, defaultTimedEvent);
      }
    },
    save: {
      type: Function,
      required: true
    }
  },
  data() {

  },
  created() {

  },
  mounted() {

  }
});
</script>

<style>

</style>
