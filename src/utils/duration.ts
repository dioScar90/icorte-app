import { type TimeString } from "../types/datetime/time-string";

export function getFormattedDuration(duration: TimeString) {
  return duration.replace(':', 'h').replace(':', 'm')
}