<template>
<div
    class="md-layout volume-layout"
  >
    <div
      class="md-subheading"
    >
      <label for="volume">Volume</label>
    </div>
    <div class="md-layout md-alignment-center-left">
      <input
        name="volume"
        type="range"
        :value="volume"
        @change="volumeChanged"
        min="0"
        max="1"
        step="0.05"
      >
      <div style="display:inline-flex;width:25px;">
        {{ value * 100 }}%
      </div>
      <md-button
        class="md-icon-button"
        @click="playSound"
        style="color:green;"
      >
        <md-icon class="md-size-2x md-raised">
          play_arrow
        </md-icon>
      </md-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ISettings } from "@/settings";

export default Vue.extend({
  name: "VolumeSlider",
  components: {
  },
  props: {
    value: {
      type: Number,
      default() {
        return 0.35;
      }
    }
  },
  created() {
    this.volume = this.value;
  },
  data() {
    return {
      volume: 0
    };
  },
  mounted() {

  },
  methods: {
    volumeChanged(event: any) {
      this.volume = event.target.value;
      this.$emit("input", this.volume);
    },
    playSound(event: any) {
      const audio = new Audio("sounds/bounty.wav");
      audio.volume = this.volume;
      audio.play();
    }
  }
});
</script>

<style>
.volume-layout {
    flex-direction:column;
    padding-top:10px;
    padding-bottom:15px;
}

</style>
