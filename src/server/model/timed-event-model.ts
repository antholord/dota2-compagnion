import { EventTimeTypeEnumeration } from "@/server/enumeration/event-time-type-enumeration";

export interface TimedEventModel {
  recurring: boolean;
  length: number;
  notificationLength: number;
  name: string;
  eventTimeType: EventTimeTypeEnumeration;
}

export const timedEvents = Object.freeze({
  bounty: { recurring: true, length: 300, notificationLength: 15, name: "Bounty Runes", eventTimeType: EventTimeTypeEnumeration.Relative } as TimedEventModel,
  shrine: { recurring: true, length: 600, notificationLength: 45, name: "Shrines exp event", eventTimeType: EventTimeTypeEnumeration.Relative } as TimedEventModel
});
