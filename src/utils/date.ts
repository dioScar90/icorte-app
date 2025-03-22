import { DateString } from "@/utils/types/date-string"
import { TimeString } from "@/utils/types/time-string"

type GetTodayProps = {
  dateString?: DateString,
  timeString?: TimeString,
  isDateIso?: boolean,
  isTimeIso?: boolean,
  isFullIso?: boolean,
  isString?: boolean,
  locale?: string,
}

function getNewDateObject(dateString?: DateString, timeString?: TimeString) {
  if (!dateString) {
    return new Date(new Date().setHours(12))
  }

  timeString ??= '12:00:00'
  return new Date(dateString + 'T' + timeString)
}

export function getToday({
  dateString,
  timeString,
  isDateIso,
  isTimeIso,
  isFullIso,
  isString,
  locale,
}: Partial<GetTodayProps> = {}) {
  const date = getNewDateObject(dateString, timeString)

  if (isString) {
    locale ??= 'pt-BR'
    return date.toLocaleDateString(locale)
  }

  if (isFullIso || isTimeIso || isDateIso) {
    const fullIso = date.toISOString()

    if (isFullIso) {
      return fullIso
    }

    const [dateIso, timeIso] = fullIso.split('T')
    return isTimeIso ? timeIso : dateIso
  }

  return date
}