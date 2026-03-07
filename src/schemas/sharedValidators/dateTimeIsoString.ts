import type { DateTimeIsoString } from "@/types/datetime/datetime-iso-string";
import { isDatePattern, isValidDateString } from "./dateString";
import { isTimePattern, isValidTimeString } from "./timeString";

export function isDateTimePattern(date: string) {
  const [splittedDate, splittedTime] = date.split('T', 2)
  return isDatePattern(splittedDate) && isTimePattern(splittedTime)
}

export function isValidDateTimeIsoString(date: string): date is DateTimeIsoString {
  if (!isDateTimePattern(date)) {
    return false
  }
  
  const [splittedDate, splittedTime] = date.split('T', 2)
  
  return isValidDateString(splittedDate) && isValidTimeString(splittedTime)
}
