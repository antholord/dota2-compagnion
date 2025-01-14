"use strict";
import { app, BrowserWindow, protocol } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { GameStateModel } from "@/server/model/game-state-model";
import GameEventService from "./service/game-event-service";
import ElectronStore, { setupConfigEvents } from "@/server/electron-store";
import OverlayWindow from "./windows/overlay-window";
import { setupGameConfigEvents } from "./service/game-config-service";

export const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;
let overlay: BrowserWindow | null;
let server: any | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 700,
    height: 800,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true as boolean,
      enableRemoteModule: true,
      zoomFactor: 0.75
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    // if (!process.env.IS_TEST) win.webContents.openDevTools({ mode: "detach" });
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
    // temp
    overlay = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (server) {
    server.close();
    server = null;
  }

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async() => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  setupConfigEvents();
  setupGameConfigEvents();
  // load events from config to service?
  createWindow();
  createHttpServer();
  overlay = OverlayWindow.createWindow();
  if (overlay) { // should always be true
    GameEventService.startService(overlay);
  }
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

app.on("before-quit", () => {
  if (server) {
    server.close();
    server = null;
  }
});

export function createHttpServer() {
  const http = require("http");
  server = http.createServer(function(req: any, res : any) {
    const data: any[] = [];

    req.on("data", (chunk: any) => {
      data.push(chunk);
    });
    req.on("end", () => {
      console.log("got update");
      // console.log(data);
      const state = JSON.parse(data as any) as GameStateModel;
      const time = GameEventService.updateState(state);
      // overlay?.webContents.send("game-time", time);
    });
  });
  server.listen(4000);
}
