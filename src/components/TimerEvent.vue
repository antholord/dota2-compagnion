<template>
  <md-field>
    <label for="name">Name</label>
    <md-input
      name="name"
      :value="value.name"
      @input="$emit('input', $event.target.value)"
    />
  </md-field>
</template>

<script lang="ts">
import Vue from "vue";
import { ISettings } from "@/settings";
import { defaultTimedEvent, TimedEventModel } from "@/server/model/timed-event-model";
import { EventTimeTypeEnum } from "@/server/enums/events";

export default Vue.extend({
  name: "TimerEvent",
  props: {
    value: {
      type: Object as () => TimedEventModel,
      default() {
        return Object.assign({}, defaultTimedEvent);
      }
    }
  },

  created() {

  },
  mounted() {

  }
});
</script>

<style>

</style>
