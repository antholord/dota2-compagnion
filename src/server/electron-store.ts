import Store from "electron-store";
import { settings, ISettings } from "@/settings.ts";
import { ipcMain } from "electron";

const store = new Store<ISettings>({
  defaults: settings
});

export function setupConfigEvents() {
  // store.reset("customEvents");
  ipcMain.on("get-settings", (e) => {
    e.returnValue = store.store;
  });
  ipcMain.on("update-settings", (e, settings) => {
    store.store = settings;
    e.returnValue = store.store;
  });
}

export default store;
