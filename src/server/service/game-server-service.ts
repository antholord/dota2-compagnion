import { GameStateModel } from "@/server/model/game-state-model";
import { TimedEventModel } from "@/server/model/timed-event-model";

type Triple<T, K, Z> = [T, K, Z];

export class GameServerService {
  private static instance: GameServerService;
  private _time: number = 0;
  private _eventList: Array<Triple<TimedEventModel, number, (anEvent: TimedEventModel) => any>> = new Array();

  // eslint-disable-next-line no-useless-constructor
  private constructor() {
    setInterval(() => {
      this._time++;
      console.log(this._time);
    }, 1000);
  }

  public static getInstance(): GameServerService {
    if (!GameServerService.instance) {
      GameServerService.instance = new GameServerService();
    }

    return GameServerService.instance;
  }

  public updateAssets(gameState: GameStateModel) {
    const gameTime: number = gameState.map.clock_time;
    if (this._time !== gameState) {
      console.log("Updating time from " + this._time + " to " + gameTime);
      this._time = gameTime;
      // TODO recalculate all events
    }
    this._eventList.forEach(function(value) {
      console.log("hi")
      if (this.time > value[1]) {
        console.log(value[0]);
      }
    });
  }

  public registerEvent(event: TimedEventModel, callback: (anEvent: TimedEventModel) => any) {
    console.log("Registering " + event.event);
    this._eventList.push([event, this._time, callback]);
  }
}
