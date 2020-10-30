import { EventTimeTypeEnum } from "@/server/enums/events";

export interface TimedEventModel {
  duration: number;
  notificationDuration: number;
  name: string;
  eventTimeType: EventTimeTypeEnum;
  soundFileName: string;
}

export const timedEvents = Object.freeze({
  bounty: { duration: 600, notificationDuration: 12, name: "Bounty Runes", eventTimeType: EventTimeTypeEnum.Relative, soundFileName: "bounty.wav" } as TimedEventModel,
  outpost: { duration: 600, notificationDuration: 45, name: "Shrines exp event", eventTimeType: EventTimeTypeEnum.Relative, soundFileName: "outpost.wav" } as TimedEventModel
});

export const defaultTimedEvent = {
  name: "",
  duration: 0,
  notificationDuration: 0,
  soundFileName: "",
  eventTimeType: EventTimeTypeEnum.Relative
};
