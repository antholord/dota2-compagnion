import {GameStateModel} from "@/server/model/game-state-model";
import {TimedEventModel} from "@/server/model/timed-event-model";
import {EventTypeEnumeration} from "@/server/enumeration/event-type-enumeration";

interface RegisteredEvent {
  event: TimedEventModel;
  dueTime: number;
  callbackFunction: (event: TimedEventModel, eventType: EventTypeEnumeration) => any;
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
        // TODO temporary log to see all temporary actions
        if (this._time % 10 === 0) {
          console.log(`${registeredEvent.event.name} still waiting for ${registeredEvent.dueTime}`);
        }
        // trigger event when its registered and keep the index for removal
        if (this._time >= registeredEvent.dueTime) {
          registeredEvent.callbackFunction(registeredEvent.event, EventTypeEnumeration.Expired);
          return index;
        } else if (this._time < registeredEvent.dueTime && this._time === registeredEvent.dueTime - registeredEvent.event.notificationLength) {
          registeredEvent.callbackFunction(registeredEvent.event, EventTypeEnumeration.Notification);
        }
      }).filter((value) => value !== undefined)
        // remove all events that occurred
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
    // if the game server time and the in game time is different, we have to adjust the game server time.
    if (gameTime != null && this._time !== gameTime) {
      console.log(`Game time correction from ${this._time} to ${gameTime}`);
      this._eventList = this._eventList.map(registeredEvent => {
        const timeDifference: number = (gameTime - this._time);
        console.log(`Event '${registeredEvent.event.name}' time correction from ${registeredEvent.dueTime} adding ${timeDifference}`);
        return { event: registeredEvent.event, dueTime: registeredEvent.dueTime, callbackFunction: registeredEvent.callbackFunction };
      });

      this._time = gameTime;
    }
  }

  public registerEvent(event: TimedEventModel, callback: (anEvent: TimedEventModel, eventType: EventTypeEnumeration) => any) {
    const eventTime = this._time + event.length;
    console.log(`Registering ${event.name} occurring at ${eventTime}`);
    this._eventList.push({ event: event, dueTime: eventTime, callbackFunction: callback });
  }
}
