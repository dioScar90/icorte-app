import { isValidDateString } from "@/schemas/sharedValidators/dateString"
import { isValidDateTimeIsoString } from "@/schemas/sharedValidators/dateTimeIsoString"
import { isValidTimeString } from "@/schemas/sharedValidators/timeString"

const shortcutFormats = [
  'hout',
  'short-hour',

  'date',
  'short-date',

  'datetime',
  'short-datetime',
] as const

const acceptableFormats = [
  'HH:mm',
  'HH:mm:ss',

  'MM-dd',
  'yyyy-MM-dd',

  'MM-dd HH:mm',
  'yyyy-MM-dd HH:mm:ss',

  'explicit',
  'week-short',
  'week-explicit',

  'dd/MM/yyyy', // callback for historical reasons

  ...shortcutFormats,
] as const

type Format = typeof acceptableFormats[number]
type IntlLocales = Parameters<typeof Intl.DateTimeFormat>[0]
type IntlOptions = Parameters<typeof Intl.DateTimeFormat>[1]
type FormatOptions = { locales?: IntlLocales } & IntlOptions

const dateOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
} satisfies IntlOptions

const timeOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
} satisfies IntlOptions

const dateTimeOptions = {
  ...dateOptions,
  ...timeOptions,
} satisfies IntlOptions

const firstBaseOptions: Record<Exclude<Format, typeof shortcutFormats[number]>, IntlOptions> = {
  'HH:mm': { ...timeOptions, second: undefined },
  'HH:mm:ss': timeOptions,
  
  'MM-dd': { ...dateOptions, year: undefined },
  'yyyy-MM-dd': dateOptions,
  
  'dd/MM/yyyy': dateOptions,
  
  'MM-dd HH:mm': { ...dateOptions, year: undefined, second: undefined },
  'yyyy-MM-dd HH:mm:ss': dateOptions,
  
  'explicit': { ...dateTimeOptions, month: 'long' },
  
  'week-short': { ...dateOptions, weekday: 'short' },
  
  'week-explicit': { ...dateOptions, weekday: 'long' },
} as const

const baseOptions: Record<Format, IntlOptions> = {
  ...firstBaseOptions,

  'hout': firstBaseOptions['HH:mm:ss'],
  'short-hour': firstBaseOptions['HH:mm'],

  'date': firstBaseOptions['yyyy-MM-dd'],
  'short-date': firstBaseOptions['MM-dd'],

  'datetime': firstBaseOptions['yyyy-MM-dd HH:mm:ss'],
  'short-datetime': firstBaseOptions['MM-dd HH:mm'],
} as const

function getParameters(type: keyof typeof baseOptions, options: FormatOptions = {}) {
  const { locales, ...restOptions } = options
  
  if (!baseOptions[type]) {
    return null
  }
  
  return [
    type === 'dd/MM/yyyy' ? 'pt-BR' : (locales ?? 'pt-BR'),
    {
      ...baseOptions[type],
      ...restOptions,
    }
  ] satisfies Parameters<typeof Intl.DateTimeFormat>
}

function getDateObject(date: unknown) {
  if (!date) {
    return null
  }
  
  if (date instanceof Date) {
    return date
  }
  
  if (typeof date === 'number') {
    return new Date(date)
  }

  if (typeof date !== 'string') {
    return null
  }

  if (isValidDateTimeIsoString(date)) {
    return new Date(date)
  }
  
  if (isValidDateString(date)) {
    return new Date(date)
  }
  
  if (isValidTimeString(date)) {
    return new Date(new Date().toISOString().split('T')[0] + 'T' + date)
  }
  
  return null
}

export function useDateTime() {
  function format(date: string | number | Date, ...args: Parameters<typeof getParameters>) {
    const dateObj = getDateObject(date)
    
    if (!dateObj) {
      return null
    }
    
    const params = getParameters(...args)
    
    if (!params) {
      return null
    }
    
    return new Intl.DateTimeFormat(...params).format(dateObj)
  }

  return {
    format,
  }
}