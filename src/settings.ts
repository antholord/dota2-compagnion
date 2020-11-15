import { EventTimeTypeEnum } from "./server/enums/events";
import { TimedEventModel } from "./server/model/timed-event-model";

export interface ISettings {
  volume: number;
  customEvents: TimedEventModel[],
  executableName: string
}

export const settings: ISettings = {
  volume: 0.35,
  customEvents: [
    { enabled: true, executionTimeRange: { startTime: 0, endTime: 0 }, duration: 60, notificationDuration: 25, name: "Bounty Runes", eventTimeType: EventTimeTypeEnum.Relative, soundFileName: "item/gold.wav" },
    { enabled: true, executionTimeRange: { startTime: 601, endTime: 0 }, duration: 600, notificationDuration: 45, name: "Shrines exp event", eventTimeType: EventTimeTypeEnum.Relative, soundFileName: "object/shrine/armorboost.wav" },
    { enabled: true, executionTimeRange: { startTime: 0, endTime: 0 }, duration: 120, notificationDuration: 15, name: "Middle runes", eventTimeType: EventTimeTypeEnum.Relative, soundFileName: "combat/explosion/explosionlarge2.wav" }
  ],
  executableName: "Dota 2"
};
