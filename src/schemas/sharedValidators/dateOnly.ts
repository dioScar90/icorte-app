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


export function isCorrectDateString(date: string) {
  const [dd, mm, yyyy] = date.split('/')

  if (!dd || !mm || !yyyy) {
    return false
  }

  if (Number.isNaN(dd) || Number.isNaN(mm) || Number.isNaN(yyyy)) {
    return false
  }

  const okDay = +dd >= 1 && +dd <= 31
  const okMonth = +mm >= 1 && +mm <= 12
  const okYear = +yyyy >= 2024

  if (!okDay || !okMonth || !okYear) {
    return false
  }
  
  if (+mm === 2 && (+yyyy % 4 === 0 ? +dd > 29 : +dd > 28)) {
    return false
  }
  
  const UNTIL_31 = [1, 3, 5, 7, 8, 10, 12]

  if (!UNTIL_31.includes(+mm) && +dd === 31) {
    return false
  }
  
  return true
}

export function isDateGreaterThenToday(date: string) {
  const [dd, mm, yyyy] = date.split('/')
  return dataIsEqualOrGreaterThenToday(yyyy + '-' + mm + '-' + dd)
}

const SEI_LA_O_QUE_EH_ISSO = 60_000

export function getStringAsDateOnly(date?: string | Date) {
  date ??= new Date(Date.now())
  
  if (date instanceof Date) {
    date = new Date(date.valueOf() - date.getTimezoneOffset() * SEI_LA_O_QUE_EH_ISSO)
    date = date.toISOString().split('T')[0]
  }

  if (date.includes('/')) {
    const [dd, mm, yyyy] = date.split('/')
    date = yyyy + '-' + mm + '-' + dd
  }
  
  return date as DateOnly
}

export function getFormattedDate(date: DateOnly) {
  return new Date(date + 'T12:00').toLocaleDateString('pt-BR')
}
