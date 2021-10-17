
import { BrowserWindow, screen } from "electron";
import { isDevelopment } from "../main";
import { GameWatcher } from "../service/game-watcher";

let gameActiveHandler: (isActive: boolean) => void;
let overlay : BrowserWindow | null;

const createGameActiveHandler = (overlay: BrowserWindow) => {
  if (isDevelopment) {
    return () => { if (!overlay?.isVisible) overlay?.show(); };
  } else {
    return (isActive : boolean) => {
      if (!overlay) return;
      if (isActive) {
        overlay.show();
        // GameWatcher.focusGame();
      } else {
        // DEBUG
        overlay.hide();
      }
    };
  }
};

export default {
  createWindow(): BrowserWindow {
    // Create the browser window.
    if (overlay == null) {
      const areaSize = screen.getPrimaryDisplay().workAreaSize;
      overlay = new BrowserWindow({
        width: areaSize.width,
        maxWidth: areaSize.width,
        height: areaSize.height,
        maxHeight: areaSize.height,
        maximizable: false,
        fullscreenable: false,
        skipTaskbar: true,
        show: isDevelopment,
        frame: false, // debug
        y: 0,
        x: 0,
        transparent: true,
        movable: false,
        resizable: false,
        opacity: 1,
        webPreferences: {
          nodeIntegration: true,
          webSecurity: false
        }
      });

      overlay.removeMenu();
      overlay.setAlwaysOnTop(true, "pop-up-menu");
      overlay.setIgnoreMouseEvents(true, { forward: true });

      GameWatcher.startWatch();
      gameActiveHandler = createGameActiveHandler(overlay);
      GameWatcher.on("game-window-changed", gameActiveHandler);

      if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        console.log(process.env.WEBPACK_DEV_SERVER_URL + "#/overlay");
        overlay.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "#/overlay");
        // if (!process.env.IS_TEST) win.webContents.openDevTools();
      } else {
        // Load the index.html when not in development
        overlay.loadURL("app://./#/overlay");
      }
      overlay.webContents.openDevTools({ mode: "detach" });
    } else {
    //   if (overlay.isVisible()) {
    //     overlay.close();
    //     overlay = null;
    //   } else {
    //     // winContainer[windowName]!.show();
    //   }
    }

    overlay!.once("closed", () => {
      console.log("once closed");
      overlay = null;
      GameWatcher.off("game-window-changed", gameActiveHandler);
    });

    return overlay;
  }
};
