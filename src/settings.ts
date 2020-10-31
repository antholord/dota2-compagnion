import { EventTimeTypeEnum } from "./server/enums/events";
import { TimedEventModel } from "./server/model/timed-event-model";

export interface ISettings {
  volume: number;
  customEvents: TimedEventModel[]
}

export const settings: ISettings = {
  volume: 0.35,
  customEvents: [
    { duration: 60, notificationDuration: 25, name: "Bounty Runes", eventTimeType: EventTimeTypeEnum.Relative, soundFileName: "bounty.wav" },
    { duration: 600, notificationDuration: 45, name: "Shrines exp event", eventTimeType: EventTimeTypeEnum.Relative, soundFileName: "outpost.wav" }
  ]
};
