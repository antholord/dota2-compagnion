import { TimedEventEnumeration } from "../enumeration/timed-event-enumeration";

export class TimedEventModel {
  private _recurring: boolean;
  private _event: TimedEventEnumeration;

  constructor(recurring: boolean, event: TimedEventEnumeration) {
    this._recurring = recurring;
    this._event = event;
  }

  get recurring(): boolean {
    return this._recurring;
  }

  set recurring(value: boolean) {
    this._recurring = value;
  }

  get event(): TimedEventEnumeration {
    return this._event;
  }

  set event(value: TimedEventEnumeration) {
    this._event = value;
  }
}
