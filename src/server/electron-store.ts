import Store from "electron-store";
import { settings, ISettings } from "@/settings.ts";
import { ipcMain } from "electron";

const store = new Store<ISettings>({
  defaults: settings
});

export function setupConfigEvents() {
  ipcMain.on("get-settings", (e) => {
    e.returnValue = store.store;
  });
  // ipcMain.on(PUSH_CONFIG, (e, cfg) => {
  //   const old = config.store;
  //   Object.setPrototypeOf(old, Object.prototype);
  //   if (!isDeepEq(cfg, old)) {
  //     batchUpdateConfig(cfg, false);
  //   }
  // });
  // ipcMain.on(CLOSE_SETTINGS_WINDOW, (e, cfg) => {
  //   if (cfg != null) {
  //     batchUpdateConfig(cfg, true);
  //   }
  // });
}

export default store;
