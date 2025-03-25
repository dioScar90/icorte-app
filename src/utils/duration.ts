import { type TimeString } from "./types/time-string";

export function getFormattedDuration(duration: TimeString) {
  return duration.replace(':', 'h').replace(':', 'm')
}