import { ipcMain } from "electron";
import fs from "fs";
import path from "path";

declare const __static: string;
export function setupGameConfigEvents(): void {
  ipcMain.on("validate-game-config", (e, gamePath: string) => {
    try {
      if (!gamePath) return;

      const localProjectConfigPath = getProjectConfig();
      if (!localProjectConfigPath) {
        console.error("Could not find local config");
        return;
      }

      const cfgPath = getCfgPath(gamePath);
      if (!cfgPath) {
        console.error("Could not find full config path");
        return;
      }

      const fullPathToConfigFolder = path.join(cfgPath, "gamestate_integration");
      const fullPathToFile = path.join(fullPathToConfigFolder, "gsi_dota2_timers.cfg");

      if (fs.existsSync(fullPathToFile)) {
        // config is already setup properly
        e.returnValue = fullPathToFile;
        return;
      }

      if (!fs.existsSync(fullPathToConfigFolder)) {
        fs.mkdirSync(fullPathToConfigFolder);
      }
      fs.copyFileSync(localProjectConfigPath, fullPathToConfigFolder);
      if (fs.existsSync(path.join(fullPathToConfigFolder, "gsi_dota2_timers.cfg"))) {
        e.returnValue = path.join(fullPathToConfigFolder, "gsi_dota2_timers.cfg");
      }
    } catch (e) {
      console.error(e);
    }
  });
}

function getProjectConfig(): string | null {
  const projectConfigPath = path.join(__static, "gamestate_integration/gsi_dota2_timers.cfg");
  return fs.existsSync(projectConfigPath) ? projectConfigPath : null;
}

function getCfgPath(gamePath: string): string | null {
  const realPath = getTrimmedGamePath(gamePath);

  const endOfPath = "/game/dota/cfg";
  const fullPath = path.join(realPath, endOfPath);

  if (!fs.existsSync(fullPath)) {
    console.error("Could not construct full path");
    return null;
  }
  return fullPath;
}

export function getTrimmedGamePath(path: string): string {
  if (path.includes("dota 2 beta")) {
    return path.substring(0, path.lastIndexOf("dota 2 beta") + 11);
  } else if (path.includes("dota 2")) {
    return path.substring(0, path.lastIndexOf("dota 2") + 6);
  }
  return path;
}
