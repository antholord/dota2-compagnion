import { EventTimeTypeEnum } from "@/server/enums/events";
import { between, maxLength, minLength, required, integer } from "vuelidate/lib/validators";

export interface TimeRange {
  startTime: number,
  endTime: number
}
export interface TimedEventModel {
  enabled: boolean,
  duration: number;
  executionTimeRange: TimeRange;
  notificationDuration: number;
  name: string;
  eventTimeType: EventTimeTypeEnum;
  soundFileName: string;
}

export const DefaultTimedEvent = {
  name: "New Event",
  enabled: true,
  eventTimeType: EventTimeTypeEnum.Relative,
  duration: 60,
  notificationDuration: 10,
  soundFileName: "/sounds/bounty.wav"
};

export const TimedEventModelValidation = {
  duration: {
    required,
    integer,
    between: between(1, 999999)
  },
  notificationDuration: {
    required,
    integer,
    between: between(0, 999999)
  },
  name: {
    required,
    maxLength: maxLength(100)
  }
};
