import { EventTimeTypeEnum } from "@/server/enums/events";
import { between, maxLength, minLength, required, integer } from "vuelidate/lib/validators";

export type TimeRange = {
  startTime: number;
  endTime: number;
}

export type TimedEventModel = {
  enabled: boolean;
  duration: number;
  // preTimerDuration: number;
  executionTimeRange: TimeRange;
  notificationDuration: number;
  name: string;
  eventTimeType: EventTimeTypeEnum;
  soundFileName?: string;
  icon?: string;
}

export const DefaultTimedEvent = {
  name: "New Event",
  enabled: true,
  executionTimeRange: {
    startTime: 0,
    endTime: 0
  } as TimeRange,
  eventTimeType: EventTimeTypeEnum.Relative,
  duration: 60,
  notificationDuration: 10,
  soundFileName: "/item/gold.wav",
  icon: "greevils_greed.png"
} as TimedEventModel;
