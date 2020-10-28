<template>
  <md-field>
    <label for="name">Name</label>
    <!-- <md-input
      name="name"
      v-model="model.name"
      :disabled="sending"
    />
    <span
      class="md-error"
      v-if="!$v.form.firstName.required"
    >The first name is required</span>
    <span
      class="md-error"
      v-else-if="!$v.form.firstName.minlength"
    >Invalid first name</span> -->
  </md-field>
</template>

<script lang="ts">
import Vue from "vue";
import { ISettings } from "@/settings";
import { defaultTimedEvent, TimedEventModel } from "@/server/model/timed-event-model";
import { EventTimeTypeEnum } from "@/server/enums/events";

export default Vue.extend({
  props: {
    model: {
      type: Object as () => TimedEventModel,
      default() {
        return Object.assign({}, defaultTimedEvent);
      }
    }
  },
  name: "TimerEvent",
  created() {

  },
  mounted() {

  }
});
</script>

<style>

</style>
