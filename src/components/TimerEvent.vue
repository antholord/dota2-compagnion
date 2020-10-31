<template>
  <div>
    <div
      class="md-layout md-gutter"
      style="flex-direction:column"
    >
      <div class="md-layout-item">
        <md-field>
          <label for="name">Name</label>
          <md-input
            name="name"
            v-model="model.name"
          />
        </md-field>
      </div>
      <div
        class="md-layout-item"
      >
        <md-field style="max-width:200px;">
          <label for="duration">Trigger every X seconds</label>
          <md-input
            name="duration"
            v-model="model.duration"
          />
        </md-field>
      </div>
      <div
        class="md-layout-item"
      >
        <md-field style="max-width:200px;">
          <label for="notification">Warning Delay</label>
          <md-input
            name="notification"
            v-model="model.notification"
          />
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
          :options-limit="100"
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
                <PlayIcon
                  size="30"
                  @click="playSound($event, props.option)"
                  style="padding-left:5px;color:green;"
                />
              </div>
            </div>
          </template>
        </Multiselect>
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
import PlayIcon from "mdi-vue/Play";
import Multiselect from "vue-multiselect";

export default Vue.extend({
  name: "TimerEvent",
  components: {
    Multiselect,
    PlayIcon
  },
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
    playSound(event: any, sound) {
      event.stopPropagation();
      event.preventDefault();
      const audio = new Audio(`/sounds/${sound}`);
      audio.volume = 0.3;
      audio.play();
    }
  }
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>

</style>
