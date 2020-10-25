import { EventTimeTypeEnumeration } from "@/server/enumeration/event-time-type-enumeration";

export interface TimedEventModel {
  recurring: boolean;
  length: number;
  notificationLength: number;
  name: string;
  eventTimeType: EventTimeTypeEnumeration;
  soundMp3Path: string;
}

export const timedEvents = Object.freeze({
  bounty: { recurring: true, length: 20, notificationLength: 10, name: "Bounty Runes", eventTimeType: EventTimeTypeEnumeration.Relative, soundMp3Path: "bounty.wav" } as TimedEventModel,
  outpost: { recurring: true, length: 30, notificationLength: 15, name: "Shrines exp event", eventTimeType: EventTimeTypeEnumeration.Relative, soundMp3Path: "outpost.wav" } as TimedEventModel
});
