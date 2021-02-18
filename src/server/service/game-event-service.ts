import { ISettings } from "@/settings.ts";
import { BrowserWindow, ipcMain } from "electron";
import { GameStateModel } from "@/server/model/game-state-model";
import { TimedEventModel } from "@/server/model/timed-event-model";
import { EventTypeEnum, EventTimeTypeEnum } from "@/server/enums/events";
import ElectronStore from "@/server/electron-store";

interface RegisteredEvent {
  event: TimedEventModel;
  dueTime: number;
  callbackFunction: (event: TimedEventModel, eventType: EventTypeEnum) => any;
}

let gameTime = 0;
const events: RegisteredEvent[] = [];

let loop: NodeJS.Timeout;
let window: BrowserWindow | null = null;

function setGameTime(time) {
  gameTime = time;
  window?.webContents.send("game-time", gameTime);
}

function startGame() {
  loop = setInterval(executeEventLoop, 1000);
  executeEventLoop();
}

function executeEventLoop() {
  events.forEach((timedEvent, i, array) => {
    if (timedEvent.event.enabled === false) return;

    if (gameTime % 10 === 0) {
      console.log(`${timedEvent.event.name} still waiting for ${timedEvent.dueTime}`);
    }

    if (gameTime >= timedEvent.dueTime) {
      timedEvent.callbackFunction(timedEvent.event, EventTypeEnum.Expired);
      array.splice(i, 1);
    } else if (gameTime < timedEvent.dueTime && gameTime === timedEvent.dueTime - timedEvent.event.notificationDuration) {
      timedEvent.callbackFunction(timedEvent.event, EventTypeEnum.Notification);
    }
  });
  setGameTime(gameTime + 1);
}

function registerEvent(event: TimedEventModel, callback: (anEvent: TimedEventModel, eventType: EventTypeEnum) => any) {
  const eventTime = event.eventTimeType === EventTimeTypeEnum.Relative ? getRelativeTime(event.duration, gameTime) : getAbsoluteTime(event.duration, gameTime);
  console.log(`Registering ${event.name} occurring at ${eventTime}`);

  // When we don't have an executionTimeRange, the event will always be registered
  // When the executionTimeRange exists, the event time must be between the range

  // start == 0 && end == 0
  // min = 0
  // max = 0

  // start < event && end == 0
  // min = 100
  // max = 0

  //  start < event > end
  // min = 0
  // max = 100

  //  start < event > end
  // min = 100
  // max = 200
  if (
    (event.executionTimeRange.endTime === 0 && event.executionTimeRange.startTime === 0) ||
    (event.executionTimeRange.endTime === 0 && event.executionTimeRange.startTime < eventTime) ||
    (event.executionTimeRange.startTime < eventTime && event.executionTimeRange.endTime > eventTime)) {
    events.push({ event: event, dueTime: eventTime, callbackFunction: callback });
  }
};

function getRelativeTime(eventTime: number, currentTime: number) {
  console.log(`current time: ${currentTime} event time: ${eventTime}`);
  return currentTime < eventTime ? eventTime : (Math.floor(currentTime / eventTime) + 1) * eventTime;
};

function getAbsoluteTime(eventTime: number, currentTime: number) {
  return currentTime + eventTime;
};

function updateState(gameState: GameStateModel): number {
  if (!loop) startGame();

  if (gameState.map == null) {
    setGameTime(0);
    return gameTime;
  }
  const newGameTime: number = gameState.map.clock_time;
  // if the game server time and the in game time is different, we have to adjust the game server time.
  // TODO delta de 2 sec et plus
  const timeDifference: number = (newGameTime - gameTime);

  if (gameTime != null && Math.abs(timeDifference) > 1) {
    console.log(`Game time correction from ${gameTime} to ${newGameTime}`);
    events.forEach(registeredEvent => {
      const eventTime = registeredEvent.event.eventTimeType === EventTimeTypeEnum.Relative
        ? getRelativeTime(registeredEvent.event.duration, gameTime)
        : registeredEvent.dueTime + timeDifference;

      console.log(`Event '${registeredEvent.event.name}' time correction from ${registeredEvent.dueTime} adding ${eventTime}`);
      registeredEvent.dueTime = eventTime;
    });

    setGameTime(newGameTime);
  }
  return gameTime;
};

const defaultEventCallback = (event: TimedEventModel, eventType: EventTypeEnum): void => {
  if (eventType === EventTypeEnum.Notification) {
    console.log(`Event notification '${event.name}' will occur in ${event.notificationDuration}`);
    window?.webContents.send("game-event-notification", event);
  } else if (eventType === EventTypeEnum.Expired) {
    console.log(`Event occurred '${event.name}'`);
    window?.webContents.send("game-event-trigger", event);
    if (event.eventTimeType === EventTimeTypeEnum.Relative) {
      registerEvent(event, defaultEventCallback);
    }
  }
};

const reloadEvents = () => {
  console.log("game-event-service updating settings");
  events.length = 0;
  ElectronStore.store.customEvents.forEach(e => {
    registerEvent(e, defaultEventCallback);
  });
};

function startService(win: BrowserWindow) {
  window = win;
  // ElectronStore.reset("customEvents");
  const settings = ElectronStore.store;
  settings.customEvents.forEach(e => {
    registerEvent(e, defaultEventCallback);
  });

  ipcMain.on("update-settings", reloadEvents);
  ipcMain.on("reset-settings", reloadEvents);
}

export default {
  getGameTime: () => gameTime,
  startService,
  updateState
};
