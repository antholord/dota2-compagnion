import { TimedEventEnumeration } from "../enumeration/timed-event-enumeration";

export class TimedEventModel {
  private _recurring: boolean;
  private _length: number;
  private _notificationLength: number;
  private _name: string;

  constructor(recurring: boolean, length: number, notificationLength: number, name: string) {
    this._recurring = recurring;
    this._length = length;
    this._notificationLength = notificationLength;
    this._name = name;
  }

  get recurring(): boolean {
    return this._recurring;
  }

  set recurring(value: boolean) {
    this._recurring = value;
  }

  get length(): number {
    return this._length;
  }

  set length(value: number) {
    this._length = value;
  }

  get notificationLength(): number {
    return this._notificationLength;
  }

  set notificationLength(value: number) {
    this._notificationLength = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}

export const timedEvents = Object.freeze({
  bounty: new TimedEventModel(true, 20, 10, "Bounty Runes"),
  shrine: new TimedEventModel(true, 50, 40, "Shrines exp event")
});
