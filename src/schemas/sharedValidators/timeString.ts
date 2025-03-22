import { TimeString } from "@/utils/types/time-string";

const isValidHour = (hour: string) => !isNaN(+hour) && +hour >= 0 && +hour < 24
const isValidMinute = (minute: string) => !isNaN(+minute) && +minute >= 0 && +minute < 60
const isValidSecond = (second: string) => !isNaN(+second) && +second >= 0 && +second < 60

export function isValidTimeString(date: string): date is TimeString {
  if (!/^\d{2}:\d{2}:\d{2}$/.test(date)) {
    return false
  }

  const [hour, minute, second] = date.split(':')
  return isValidHour(hour) && isValidMinute(minute) && isValidSecond(second)
}

export function getStringAsTimeString(time: string) {
  return time as TimeString
}

export function getFormattedHour(time: TimeString, hourSeparator?: boolean) {
  const h = hourSeparator ? 'h' : ':'

  if (!isValidTimeString(time)) {
    return `00${h}00`
  }

  return time.split(':').splice(0, 2).join(h)
}
