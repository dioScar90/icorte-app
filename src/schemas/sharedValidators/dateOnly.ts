import { getToday } from "@/utils/date";
import { DateOnly } from "@/utils/types/date";

export function dataIsEqualOrGreaterThenToday(informedDate: string) {
  const todayDate = getToday({ isDateIso: true }) as string
  return informedDate >= todayDate
}

const isValidYear = (year: string) => !isNaN(+year) && +year > 2000
const isValidMonth = (month: string) => !isNaN(+month) && +month > 0 && +month <= 12
const isValidDay = (day: string) => !isNaN(+day) && +day > 0 && +day <= 31

export function isValidDate(date: string): date is DateOnly {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false
  }

  const [year, month, day] = date.split('-')
  return isValidYear(year) && isValidMonth(month) && isValidDay(day)
}

export function getStringAsDateOnly(date: string) {
  return date as DateOnly
}
