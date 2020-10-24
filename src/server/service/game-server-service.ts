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
      this._eventList.map((value, index) => {
        if (this._time % 10 === 0) {
          console.log(value[0].event + " still waiting for " + value[1]);
        }
        if (this._time >= value[1]) {
          const callback: (anEvent: TimedEventModel) => any = value[2];

          callback(value[0]);
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
      this._eventList = this._eventList.map(value => {
        const difference: number = (gameTime - this._time);
        console.log("Changing time from " + value[1] + " + " + difference);
        return [value[0], value[1] + difference, value[2]];
      });

      this._time = gameTime;
    }

  }

  public registerEvent(event: TimedEventModel, callback: (anEvent: TimedEventModel) => any) {
    console.log("Registering " + event.event);
    this._eventList.push([event, this._time + event.event, callback]);
  }
}
