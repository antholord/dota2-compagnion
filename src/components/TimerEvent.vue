<template>
  <div>
    <div
      class="md-layout md-gutter"
      style="flex-direction:column"
    >
      <div class="md-layout-item">
        <md-field :class="getValidationClass('name')">
          <label for="name">Name</label>
          <md-input
            name="name"
            v-model="model.name"
          />
          <span
            class="md-error"
            v-if="!$v.model.name.required"
          >
            Field is required.
          </span>
        </md-field>
      </div>
      <div
        class="md-layout-item"
      >
        <md-field
          style="max-width:200px;"
          :class="getValidationClass('duration')"
        >
          <label for="duration">Trigger every X seconds</label>
          <md-input
            name="duration"
            v-model.number="model.duration"
          />
          <span
            class="md-error"
            v-if="!$v.model.duration.between"
          >
            Must be a valid duration
          </span>
        </md-field>
      </div>
      <div
        class="md-layout-item"
      >
        <md-field
          style="max-width:200px;"
          :class="getValidationClass('notificationDuration')"
        >
          <label for="notification">Warning Delay</label>
          <md-input
            name="notification"
            v-model.number="model.notificationDuration"
          />
          <span
            class="md-error"
            v-if="!$v.model.notificationDuration.between"
          >
            Must be a valid duration
          </span>
        </md-field>
      </div>
      <div
        class="md-layout-item"
      >
        <label for="select"><h4>Trigger Sound</h4></label>
        <Multiselect
          name="select"
          v-model="model.soundFileName"
          :options="sounds"
          :options-limit="3000"
          select-label=""
          placeholder="Select Sound"
          style="max-width:400px;"
        >
          <template
            slot="singleLabel"
            slot-scope="props"
          >
            <span class="option__desc"><span class="option__title">{{ props.option }}</span></span>
          </template>
          <template
            slot="option"
            slot-scope="props"
          >
            <div class="option__desc">
              <span class="option__title">{{ props.option }}</span>
              <div
                style="display:inline-block"
                @click="playSound($event, props.option)"
              >
                <md-icon
                  @click="playSound($event, props.option)"
                  style="padding-left:10px;color:green;"
                  class="md-size-2x"
                >
                  play_arrow
                </md-icon>
              </div>
            </div>
          </template>
        </Multiselect>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ISettings } from "@/settings";
import { DefaultTimedEvent, TimedEventModel, TimedEventModelValidation } from "@/server/model/timed-event-model";
import { EventTimeTypeEnum } from "@/server/enums/events";
import Multiselect from "vue-multiselect";
import { required, integer, between, minLength, maxLength } from "vuelidate/lib/validators";

export default Vue.extend({
  name: "TimerEvent",
  components: {
    Multiselect
  },
  props: {
    model: {
      type: Object as () => TimedEventModel,
      default() {
        return Object.assign({}, DefaultTimedEvent);
      }
    },
    volume: {
      type: Number,
      default() { return 0.5; }
    }
  },
  data() {
    return {
      sounds: [] as string[]
    };
  },
  async created() {
    this.sounds = require.context("@/../public/", true, /\.wav$/).keys().map(key => key.substring("./sounds/".length, key.length));
  },
  mounted() {

  },
  computed: {
    soundLabels: function() : string[] {
      return this.sounds.map(sound => sound.substring(0, sound.lastIndexOf("/") + 1));
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.model[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid
        };
      }
    },
    playSound(event: any, sound) {
      event.stopPropagation();
      event.preventDefault();
      const audio = new Audio(`/sounds/${sound}`);
      audio.volume = this.volume;
      audio.play();
    }
  },
  validations: {
    model: TimedEventModelValidation
  }
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>

</style>
