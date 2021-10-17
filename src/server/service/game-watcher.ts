import { EventEmitter } from "events";
import { windowManager, Window } from "node-window-manager";
import { settings } from "../../settings";

let lastWindow : Window | null = null;

interface GameWatcherClass {
  on(event: "game-window-changed", listener: (isActive: boolean) => void): this
}

let loop: NodeJS.Timeout | null;

class GameWatcherClass extends EventEmitter {
  startWatch() {
    if (!loop) {
      // initial check if window is opened, so we dont need alt tab to make it appear
      const currentWindow = windowManager.getActiveWindow();
      if (currentWindow?.getTitle() === settings.gameWindowName) {
        console.log("game window changed");
        this.emit("game-window-changed", true);
      }
      this.loop();
    } else {
      console.error("GameWatcher is already started");
    }
  }

  private async loop() {
    const currentWindow = windowManager.getActiveWindow();
    if (!currentWindow) return;

    if (!lastWindow) lastWindow = currentWindow;
    // console.log("lastWindow : " + lastWindow.getTitle());
    // console.log("currentWindow :" + currentWindow.getTitle());
    if (currentWindow.id !== lastWindow.id) {
      if (currentWindow.getTitle() === settings.gameWindowName) {
        this.emit("game-window-changed", true);
      } else if (lastWindow.getTitle() === settings.gameWindowName) {
        this.emit("game-window-changed", false);
      }
      lastWindow = currentWindow;
    }
    loop = setTimeout(async() => {
      this.loop();
    }, 500);
  }

  focusGame() {
    const gameWindow = windowManager.getWindows().find(w => w.getTitle() === settings.gameWindowName);
    if (!gameWindow) {
      console.error("Could not find Game Window!");
      return;
    }

    gameWindow.bringToTop();
  }
}

export const GameWatcher = new GameWatcherClass();
