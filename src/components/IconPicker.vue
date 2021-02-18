<template>
  <div>
    <label for="select"><h4>Icon</h4></label>
    <Multiselect
      name="select"
      :value="iconFileName"
      @input="iconFileNameChanged"
      :options="icons"
      :options-limit="3000"
      @open="loadIcons"
      :loading="loading"
      :allow-empty="false"
      deselect-label=""
      hide-selected
      selected-label=""
      select-label=""
      :option-height="30"
      placeholder="Select Icon"
      style="max-width: 115px"
    >
      <template
        slot="singleLabel"
        slot-scope="props"
      >
        <div class="option__desc">
          <img :src="'/icons/' + props.option">
        </div>
      </template>
      <template
        slot="option"
        slot-scope="props"
      >
        <div class="option__desc">
          <img :src="'/icons/' + props.option">
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

const icons = require
  .context("@/../public/icons", true, /\.png$/)
  .keys();
  // .map((key) => key.substring("./icons/".length, key.length));

// const iconLabels = icons.map((icon) =>
//   icon.substring(0, icon.lastIndexOf("/") + 1)
// );

export default Vue.extend({
  name: "IconPicker",
  components: {
    Multiselect
  },
  data() {
    return {
      icons: [] as string[],
      loading: false
    };
  },
  props: {
    volume: {
      type: Number,
      default: 0.5
    },
    iconFileName: {
      type: String,
      default: ""
    }
  },
  created() {
    if (this.iconFileName) {
      this.icons.push(this.iconFileName);
    }
  },
  methods: {
    loadIcons() {
      if (this.icons.length > 1) return;
      this.loading = true;
      this.icons.splice(0);
      this.$set(this, "icons", icons);
      this.loading = false;
    },
    iconFileNameChanged(value) {
      this.$emit("icon-file-name-changed", value);
    }
  }
});
</script>

  <style>
  img {
    height:70px;
  }
  .multiselect__option {
    padding:4px;
  }
  </style>
