import { TimeOnly } from "@/utils/types/date";

const isValidHour = (hour: string) => !isNaN(+hour) && +hour >= 0 && +hour < 24
const isValidMinute = (minute: string) => !isNaN(+minute) && +minute >= 0 && +minute < 60
const isValidSecond = (second: string) => !isNaN(+second) && +second >= 0 && +second < 60

export function isValidDate(date: string): date is TimeOnly {
  if (!/^\d{2}:\d{2}:\d{2}$/.test(date)) {
    return false
  }

  const [hour, minute, second] = date.split(':')
  return isValidHour(hour) && isValidMinute(minute) && isValidSecond(second)
}

export function getStringAsTimeOnly(time: string) {
  return time as TimeOnly
}
