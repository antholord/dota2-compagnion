import { EventTimeTypeEnum } from "@/server/enums/events";

export interface TimedEventModel {
  recurring: boolean;
  duration: number;
  notificationDuration: number;
  name: string;
  eventTimeType: EventTimeTypeEnum;
  soundFileName: string;
}

export const timedEvents = Object.freeze({
  bounty: { recurring: true, duration: 600, notificationDuration: 12, name: "Bounty Runes", eventTimeType: EventTimeTypeEnum.Relative, soundFileName: "bounty.wav" } as TimedEventModel,
  outpost: { recurring: true, duration: 600, notificationDuration: 45, name: "Shrines exp event", eventTimeType: EventTimeTypeEnum.Relative, soundFileName: "outpost.wav" } as TimedEventModel
});

export const defaultTimedEvent = {
  name: "",
  recurring: true,
  duration: 0,
  notificationDuration: 0,
  soundFileName: "",
  eventTimeType: EventTimeTypeEnum.Relative
};
