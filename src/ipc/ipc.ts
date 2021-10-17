import * as electron from "electron";
import { StrictIpcMain, StrictIpcRenderer } from "typesafe-ipc";
import { TimedEventModel } from "../server/model/timed-event-model";
import { ISettings } from "../settings";

interface IpcMap {
    "validate-game-config": string;
    "game-time": number;
    "game-event-notification": TimedEventModel;
    "reset-settings": void;
    "get-settings": void;
    "update-settings": ISettings;
}

const ipcRenderer: StrictIpcRenderer<IpcMap> = electron.ipcRenderer;
const ipcMain: StrictIpcMain<IpcMap> = electron.ipcMain;

export { ipcRenderer, ipcMain };
