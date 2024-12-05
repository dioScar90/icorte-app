import { TimeOnly } from "@/utils/types/date";

const isValidHour = (hour: string) => !isNaN(+hour) && +hour >= 0 && +hour < 24
const isValidMinute = (minute: string) => !isNaN(+minute) && +minute >= 0 && +minute < 60
const isValidSecond = (second: string) => !isNaN(+second) && +second >= 0 && +second < 60

export function isValidTimeOnly(date: string): date is TimeOnly {
  if (!/^\d{2}:\d{2}:\d{2}$/.test(date)) {
    return false
  }
  
  const [hour, minute, second] = date.split(':')
  return isValidHour(hour) && isValidMinute(minute) && isValidSecond(second)
}

export function getStringAsTimeOnly(time: string) {
  return time as TimeOnly
}

export function getFormattedHour(time: TimeOnly, hourSeparator?: boolean) {
  const h = hourSeparator ? 'h' : ':'

  if (!isValidTimeOnly(time)) {
    return `00${h}00`
  }
  
  return time.split(':').splice(0, 2).join(h)
}
