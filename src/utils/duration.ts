import { TimeOnly } from "./types/date";

export function getFormattedDuration(duration: TimeOnly) {
  return duration.replace(':', 'h').replace(':', 'm')
}