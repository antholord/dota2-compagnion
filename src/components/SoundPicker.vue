<template>
  <div>
    <label for="select"><h4>Trigger Sound</h4></label>
    <Multiselect
      name="select"
      :value="soundFileName"
      @input="soundFileNameChanged"
      :options="sounds"
      :options-limit="3000"
      @open="loadSounds"
      :loading="loading"
      :allow-empty="false"
      deselect-label=""
      select-label=""
      :option-height="30"
      placeholder="Select Sound"
      style="max-width: 600px"
    >
      <template
        slot="singleLabel"
        slot-scope="props"
      >
        <span
          class="option__desc"
        ><span class="option__title">{{ props.option }}</span></span>
      </template>
      <template
        slot="option"
        slot-scope="props"
      >
        <div class="option__desc">
          <span class="option__title">{{ props.option }}</span>
          <div
            style="display: inline-block"
            @click="playSound($event, props.option)"
          >
            <md-icon
              @click="playSound($event, props.option)"
              style="padding-left: 10px; color: green"
            >
              play_arrow
            </md-icon>
          </div>
        </div>
      </template>
    </Multiselect>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { DefaultTimedEvent } from "@/server/model/timed-event-model";
import { EventTimeTypeEnum } from "@/server/enums/events";
import Multiselect from "vue-multiselect";

const sounds = require
  .context("@/../public/", true, /\.wav$/)
  .keys()
  .map((key) => key.substring("./sounds/".length, key.length));

const soundLabels = sounds.map((sound) =>
  sound.substring(0, sound.lastIndexOf("/") + 1)
);

export default Vue.extend({
  name: "SoundPicker",
  components: {
    Multiselect
  },
  data() {
    return {
      sounds: [] as string[],
      loading: false
    };
  },
  props: {
    volume: {
      type: Number,
      default: 0.5
    },
    soundFileName: {
      type: String,
      default: DefaultTimedEvent.soundFileName
    }
  },
  created() {
    this.sounds.push(this.soundFileName);
  },
  mounted() {},
  methods: {
    loadSounds() {
      if (this.sounds.length > 1) return;
      this.loading = true;
      this.sounds.splice(0);
      this.$set(this, "sounds", sounds);
      this.loading = false;
    },
    soundFileNameChanged(value) {
      this.$emit("sound-file-name-changed", value);
    },
    playSound(event: any, sound) {
      event.stopPropagation();
      event.preventDefault();
      const audio = new Audio(`sounds/${sound}`);
      audio.volume = this.volume;
      audio.play();
    }
  }
});
</script>

  <style>
  </style>
