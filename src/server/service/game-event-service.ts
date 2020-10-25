import { GameStateModel } from "@/server/model/game-state-model";
import { TimedEventModel } from "@/server/model/timed-event-model";
import { EventTypeEnumeration } from "@/server/enumeration/event-type-enumeration";
import { EventTimeTypeEnumeration } from "@/server/enumeration/event-time-type-enumeration";

interface RegisteredEvent {
  event: TimedEventModel;
  dueTime: number;
  callbackFunction: (event: TimedEventModel, eventType: EventTypeEnumeration) => any;
}

let gameTime = 0;
const events: RegisteredEvent[] = [];

const loop = setInterval(executeEventLoop, 1000);
executeEventLoop();

function executeEventLoop() {
  events.forEach((timedEvent, i, array) => {
    if (gameTime % 10 === 0) {
      console.log(`${timedEvent.event.name} still waiting for ${timedEvent.dueTime}`);
    }

    if (gameTime >= timedEvent.dueTime) {
      timedEvent.callbackFunction(timedEvent.event, EventTypeEnumeration.Expired);
      array.splice(i, 1);
    } else if (gameTime < timedEvent.dueTime && gameTime === timedEvent.dueTime - timedEvent.event.notificationLength) {
      timedEvent.callbackFunction(timedEvent.event, EventTypeEnumeration.Notification);
    }
  });
  gameTime++;
}

function registerEvent(event: TimedEventModel, callback: (anEvent: TimedEventModel, eventType: EventTypeEnumeration) => any) {
  const eventTime = event.eventTimeType === EventTimeTypeEnumeration.Relative ? getRelativeTime(event.length, gameTime) : getAbsoluteTime(event.length, gameTime);

  console.log(`Registering ${event.name} occurring at ${eventTime}`);
  events.push({ event: event, dueTime: eventTime, callbackFunction: callback });
};

function getRelativeTime(eventTime: number, currentTime: number) {
  console.log(`current time: ${currentTime} event time: ${eventTime}`);
  return currentTime < eventTime ? eventTime : (Math.floor(currentTime / eventTime) + 1) * eventTime;
};

function getAbsoluteTime(eventTime: number, currentTime: number) {
  return currentTime + eventTime;
};

function updateState(gameState: GameStateModel): number {
  if (gameState.map == null) {
    gameTime = 0;
    return gameTime;
  }
  const newGameTime: number = gameState.map.clock_time;
  // if the game server time and the in game time is different, we have to adjust the game server time.
  // TODO delta de 2 sec et plus
  const timeDifference: number = (newGameTime - gameTime);

  if (gameTime != null && Math.abs(timeDifference) > 1) {
    console.log(`Game time correction from ${gameTime} to ${newGameTime}`);
    events.forEach(registeredEvent => {
      const eventTime = registeredEvent.event.eventTimeType === EventTimeTypeEnumeration.Relative ? getRelativeTime(registeredEvent.event.length, gameTime) : registeredEvent.dueTime + timeDifference;
      console.log(`Event '${registeredEvent.event.name}' time correction from ${registeredEvent.dueTime} adding ${eventTime}`);
      registeredEvent.dueTime = eventTime;
    });

    gameTime = newGameTime;
  }
  return gameTime;
};

export default {
  getGameTime: () => gameTime,
  registerEvent,
  updateState
};
