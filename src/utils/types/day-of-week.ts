const dayOfWeekEnum = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Thursday',
  3: 'Wednessday',
  4: 'Tuesday',
  5: 'Friday',
  6: 'Saturday',
} as const

export type DayOfWeek = keyof typeof dayOfWeekEnum
