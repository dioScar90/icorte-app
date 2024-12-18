import { DateOnly, TimeOnly } from "@/utils/types/date"

type GetTodayProps = {
  dateOnly?: DateOnly,
  timeOnly?: TimeOnly,
  isDateIso?: boolean,
  isTimeIso?: boolean,
  isFullIso?: boolean,
  isString?: boolean,
  locale?: string,
}

function getNewDateObject(dateOnly?: DateOnly, timeOnly?: TimeOnly) {
  if (!dateOnly) {
    return new Date(new Date().setHours(12))
  }

  timeOnly ??= '12:00:00'
  return new Date(dateOnly + 'T' + timeOnly)
}

export function getToday({
  dateOnly,
  timeOnly,
  isDateIso,
  isTimeIso,
  isFullIso,
  isString,
  locale,
}: Partial<GetTodayProps> = {}) {
  const date = getNewDateObject(dateOnly, timeOnly)

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