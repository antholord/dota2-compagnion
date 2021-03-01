<template>
  <div
    class="md-layout path-section"
    :class="pathSectionClass"
  >
    <md-button
      class="md-icon-button md-dense"
      @click="toggleDialog"
      style=""
    >
      <md-icon style="{'validated': validationResult === true}">
        {{ pathSectionIcon }}
      </md-icon>
    </md-button>
    <label style="padding-top:8px;">{{ label }}</label>
  </div>
</template>

<script lang="ts">
import { OpenDialogReturnValue } from "electron";
import Vue from "vue";
import { getTrimmedGamePath } from "../../../server/service/game-config-service";

export default Vue.extend({
  name: "ExecPath",
  props: {
    value: { type: String, default: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta" }
  },
  data() {
    return {
      gamePath: "",
      validated: false,
      validationResult: false
    };
  },
  created() {
    this.gamePath = this.value;
  },
  mounted() {
    if (this.value) {
      this.validateGameConfig(this.value);
    }
  },
  methods: {
    toggleDialog(): void {
      const dialog = this.$electron.remote.dialog;
      const path = getTrimmedGamePath(this.value);
      dialog.showOpenDialog({
        title: "Select Dota 2 Game Directory",
        defaultPath: path,
        properties: ["openDirectory", "dontAddToRecent"]
      }).then(result => {
        if (result) {
          this.processDialogResult(result);
        }
      }).catch(err => {
        console.log(err);
      });
      this.validated = false;
      this.validationResult = false;
    },
    processDialogResult(result: OpenDialogReturnValue): void {
      if (result.canceled === true) return;
      const files = result.filePaths;
      if (files.length !== 1) {
        console.error("Should be one file selected");
        return;
      }
      this.validateGameConfig(files[0]);
    },
    validateGameConfig(path: string): void {
      const validGameResponse = this.$electron.ipcRenderer.sendSync("validate-game-config", path);
      this.validated = true;
      if (typeof (validGameResponse) !== "string") {
        alert("There was an error setting up Dota 2 Timers App with your game client. Please run this program as administrator, or visit xxx to do the manual setup");
        this.validationResult = false;
      } else {
        this.validationResult = true;
        this.$emit("input", validGameResponse);
      }
    }
  },
  computed: {
    label(): string {
      if (!this.validated) {
        return "Verifying your setup...";
      } else if (this.validationResult === false) {
        return "Could not setup the App. Please restart as administrator or do the setup manually";
      }
      return "App setup correctly";
    },
    pathSectionClass(): string {
      if (!this.validated) {
        return "";
      }
      if (this.validated && this.validationResult === false) {
        return "invalid";
      }
      return "valid";
    },
    pathSectionIcon(): string {
      if (this.validationResult === true) {
        return "check_circle_outline";
      }
      return "folder";
    }
  }
});
</script>

<style scoped>
.path-section {
  border: 2px solid black;
  margin-bottom:10px;
}

.path-section.valid {
  border: 2px solid lightgreen;
}

.path-section.invalid {
  border: 2px solid red;
}

.path-section > label {
  padding:5px;
}

.md-icon.validated {
  color:green;
}
</style>
