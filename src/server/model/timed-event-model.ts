import { EventTimeTypeEnum } from "@/server/enums/events";

export interface TimedEventModel {
  recurring: boolean;
  length: number;
  notificationLength: number;
  name: string;
  eventTimeType: EventTimeTypeEnum;
  soundFileName: string;
}

export const timedEvents = Object.freeze({
  bounty: { recurring: true, length: 10, notificationLength: 5, name: "Bounty Runes", eventTimeType: EventTimeTypeEnum.Relative, soundFileName: "bounty.wav" } as TimedEventModel,
  outpost: { recurring: true, length: 600, notificationLength: 45, name: "Shrines exp event", eventTimeType: EventTimeTypeEnum.Relative, soundFileName: "outpost.wav" } as TimedEventModel
});
