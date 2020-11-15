<template>
  <div>
    <div
      class="md-layout md-gutter"
      style="flex-direction: column"
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
      <div class="md-layout-item">
        <md-field
          style="max-width: 140px"
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
      <div class="md-layout-item">
        <md-field
          style="max-width: 90px"
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

      <div class="md-layout-item">
        <div style="display:flex;">
          <md-checkbox
            v-model="enableTimeRange"
            @change="enableTimeRangeChanged"
          />
          <span
            class="md-subheading"
            style="line-height:52px;"
          >Event activation time range</span>
        </div>
        <div
          v-if="enableTimeRange === true"
          style="display:flex;"
        >
          <md-field
            style="max-width: 70px; margin-right:40px;"
            :class="{ 'md-invalid': !$v.minimumTimeRange.validTime }"
          >
            <label for="minimum-executionTimeRange">Start</label>
            <md-input
              name="minimum-executionTimeRange"
              v-model="minimumTimeRange"
            />

            <span
              class="md-error"
              v-if="!$v.model.notificationDuration.between"
            >
              Must be a valid duration
            </span>
          </md-field>

          <md-field
            style="max-width: 70px;"
            :class="{ 'md-invalid': !$v.maximumTimeRange.validTime }"
          >
            <label for="maximum-executionTimeRange">End</label>
            <md-input
              name="maximum-executionTimeRange"
              v-model="maximumTimeRange"
            />

            <span
              class="md-error"
              v-if="!$v.model.notificationDuration.between"
            >
              Must be a valid duration
            </span>
          </md-field>
        </div>
      </div>
      <div class="md-layout-item">
        <SoundPicker
          :sound-file-name="model.soundFileName"
          @sound-file-name-changed="soundFileNameChanged"
        />
      </div>
      <div
        class="md-layout-item"
        style="padding-top: 10px"
      >
        <md-button
          class="md-accent md-raised"
          @click="$emit('delete-event', model)"
        >
          DELETE
        </md-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ISettings } from "@/settings";
import {
  DefaultTimedEvent,
  TimedEventModel
} from "@/server/model/timed-event-model";
import { EventTimeTypeEnum } from "@/server/enums/events";
import { getTimeInSeconds, getFormattedTime, validateFormattedTime } from "@/server/utils/TimeUtils";
import SoundPicker from "./SoundPicker.vue";
import {
  required,
  integer,
  between,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

export default Vue.extend({
  name: "TimerEvent",
  components: {
    SoundPicker
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
      default() {
        return 0.5;
      }
    }
  },
  data() {
    return {
      sounds: [] as string[],
      originalModelCopy: {} as TimedEventModel,
      minimumTimeRange: "00:00:00" as string,
      maximumTimeRange: "00:00:00" as string,
      enableTimeRange: false
    };
  },
  created() {
    if (this.model.executionTimeRange.startTime !== 0 || this.model.executionTimeRange.endTime !== 0) {
      this.enableTimeRange = true;
    }
    this.originalModelCopy = Object.assign({}, this.model);
    this.minimumTimeRange = getFormattedTime(this.model.executionTimeRange.startTime);
    this.maximumTimeRange = getFormattedTime(this.model.executionTimeRange.endTime);
  },
  watch: {
    minimumTimeRange: function(newVal, oldVal) {
      if (validateFormattedTime(newVal)) {
        this.model.executionTimeRange.startTime = getTimeInSeconds(newVal);
      }
    },
    maximumTimeRange: function(newVal, oldVal) {
      if (validateFormattedTime(newVal)) {
        this.model.executionTimeRange.endTime = getTimeInSeconds(newVal);
      }
    }
  },
  computed: {
    valid: function(): boolean {
      return !this.$v.$invalid;
    }
  },
  methods: {
    enableTimeRangeChanged(value) {
      if (value === false) {
        this.minimumTimeRange = "00:00:00";
        this.maximumTimeRange = "00:00:00";
      }
    },
    reset() {
      // re-assign default values in a way that works nice with Vue's reactive system
      for (const [key, value] of Object.entries(this.originalModelCopy)) {
        this.$set(this.model, key, value);
      }
    },
    deleteEvent() {
      this.$emit("delete-event", this.model);
    },
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
      const audio = new Audio(`sounds/${sound}`);
      audio.volume = this.volume;
      audio.play();
    },
    soundFileNameChanged(value) {
      this.model.soundFileName = value;
    }
  },
  validations: {
    minimumTimeRange: {
      validTime: validateFormattedTime
    },
    maximumTimeRange: {
      validTime: (value) => {
        return validateFormattedTime(value);
      }
    },
    model: {
      duration: {
        required,
        integer,
        between: between(1, 999999)
      },
      notificationDuration: {
        required,
        integer,
        between: between(0, 999999)
      },
      name: {
        required,
        maxLength: maxLength(100)
      },
      executionTimeRange: {
        startTime: {
          validTime: (value) => {
            return value >= 0;
          }
        },
        endTime: {
          validTime: (value) => {
            return value >= 0;
          }
        }
      }
    }
  }
});
</script>

  <style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
  <style>
  </style>
