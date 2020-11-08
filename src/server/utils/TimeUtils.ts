const regex = /^([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})$/;

export function validateFormattedTime(time: string | null): boolean {
  if (!time) return false;

  const regexResult = time.match(regex);

  if (regexResult != null && regexResult.length === 4) {
    //  throw error
    regexResult.forEach((value) => {
      const numericValue = Number(value);
      if (numericValue < 0 || numericValue > 60) {
        return false;
      }
    });
  } else {
    return false;
  }

  return true;
}
export function getTimeInSeconds(formattedTime: string | null): number {
  if (!formattedTime || !validateFormattedTime(formattedTime)) return 0;

  const regexResult = formattedTime.match(regex) as RegExpMatchArray;

  const hours = Number(regexResult[1]);
  const minutes = Number(regexResult[2]);
  const seconds = Number(regexResult[3]);

  return seconds + (minutes * 60) + (hours * 60 * 60);
}

const paddingFunction = function(
  value: number,
  length: number = 2,
  paddingCharacter: string = "0"
): string {
  let valueString = value.toString();
  while (valueString.length < length) {
    valueString = `${paddingCharacter}${valueString}`;
  }
  return valueString;
};

export function getFormattedTime(timeInSeconds: number): string {
  // todo remove me?
  // if (!timeInSeconds) return "00:00:00";

  const minutesWithHours = Math.floor(timeInSeconds / 60);

  const seconds = timeInSeconds % 60;
  const minutes = minutesWithHours % 60;
  const hours = Math.floor(minutesWithHours / 60);

  return `${paddingFunction(hours)}:${paddingFunction(minutes)}:${paddingFunction(seconds)}`;
}
