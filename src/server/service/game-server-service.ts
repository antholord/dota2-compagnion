import {GameStateModel} from "@/server/model/game-state-model";
import {TimedEventModel} from "@/server/model/timed-event-model";
import {EventTypeEnumeration} from "@/server/enumeration/event-type-enumeration";
import {EventTimeTypeEnumeration} from "@/server/enumeration/event-time-type-enumeration";

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
      console.log(this._time);
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

  public updateAssets(gameState: GameStateModel): number {
    const gameTime: number = gameState.map.game_time | 0;
    // if the game server time and the in game time is different, we have to adjust the game server time.
    // TODO delta de 2 sec et plus
    const timeDifference: number = (gameTime - this._time);
    if (gameTime != null && Math.abs(timeDifference) > 1) {
      console.log(`Game time correction from ${this._time} to ${gameTime}`);
      this._eventList = this._eventList.map(registeredEvent => {
        const eventTime = registeredEvent.event.eventTimeType === EventTimeTypeEnumeration.Relative ? this.getRelativeTime(registeredEvent.event.length, gameTime) : registeredEvent.dueTime + timeDifference;

        console.log(`Event '${registeredEvent.event.name}' time correction from ${registeredEvent.dueTime} adding ${eventTime}`);
        return { event: registeredEvent.event, dueTime: eventTime, callbackFunction: registeredEvent.callbackFunction };
      });

      this._time = gameTime;
    }
    return this._time;
  }

  public registerEvent(event: TimedEventModel, callback: (anEvent: TimedEventModel, eventType: EventTypeEnumeration) => any) {
    const eventTime = event.eventTimeType === EventTimeTypeEnumeration.Relative ? this.getRelativeTime(event.length, this._time) : this.getAbsoluteTime(event.length, this._time);

    console.log(`Registering ${event.name} occurring at ${eventTime}`);
    this._eventList.push({ event: event, dueTime: eventTime, callbackFunction: callback });
  }

  private getRelativeTime(eventTime: number, currentTime: number) {
    console.log(`current time: ${currentTime} event time: ${eventTime}`);
    return currentTime < eventTime ? eventTime : (Math.floor(currentTime / eventTime) + 1) * eventTime;
  }

  private getAbsoluteTime(eventTime: number, currentTime: number) {
    return currentTime + eventTime;
  }
}
