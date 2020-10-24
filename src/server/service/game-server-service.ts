import { GameStateModel } from "@/server/model/game-state-model";
import { TimedEventModel } from "@/server/model/timed-event-model";

interface RegisteredEvent {
  event: TimedEventModel;
  dueTime: number;
  callbackFunction: (anEvent: TimedEventModel) => any;
}

export class GameServerService {
  private static instance: GameServerService;
  private _time: number = 0;
  private _eventList: Array<RegisteredEvent> = new Array();

  // eslint-disable-next-line no-useless-constructor
  private constructor() {
    setInterval(() => {
      this._time++;
      this._eventList.map((registeredEvent, index) => {
        if (this._time % 10 === 0) {
          console.log(registeredEvent.event.name + " still waiting for " + registeredEvent.dueTime);
        }
        if (this._time >= registeredEvent.dueTime) {
          registeredEvent.callbackFunction(registeredEvent.event);
          return index;
        }
      }).filter((value) => value !== undefined)
        .forEach(index => {
          // @ts-ignore
          this._eventList.splice(index, 1);
        });
    }, 1000);
  }

  public static getInstance(): GameServerService {
    if (!GameServerService.instance) {
      GameServerService.instance = new GameServerService();
    }

    return GameServerService.instance;
  }

  public updateAssets(gameState: GameStateModel) {
    const gameTime: number = gameState.map.game_time;
    if (gameTime != null && this._time !== gameTime) {
      console.log("Updating time from " + this._time + " to " + gameTime);
      this._eventList = this._eventList.map(registeredEvent => {
        const difference: number = (gameTime - this._time);
        console.log("Changing time from " + registeredEvent.dueTime + " + " + difference);
        return { event: registeredEvent.event, dueTime: registeredEvent.dueTime, callbackFunction: registeredEvent.callbackFunction };
      });

      this._time = gameTime;
    }
  }

  public registerEvent(event: TimedEventModel, callback: (anEvent: TimedEventModel) => any) {
    console.log("Registering " + event.name);
    this._eventList.push({ event: event, dueTime: this._time + event.length, callbackFunction: callback });
  }
}
