import { IndexesOf } from "./indexes-of"

const zeroToNine = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
] as const

type ZeroToNine = typeof zeroToNine[number]

type ExcludeZeroOr<TUnion extends string, TOut extends `${'' | '20'}${ZeroToNine}${ZeroToNine}` = '00'> = Exclude<TUnion, TOut>

type Hour = `${'0' |'1'}${ZeroToNine}` | `2${'0' | '1' | '2' | '3'}`
type MinuteOrSecond = `${'0' | '1' | '2' | '3' | '4' | '5'}${ZeroToNine}`

type NothingBefore2024 = `20${'0' | '1'}${ZeroToNine}` | `202${'0' | '1' | '2' | '3'}`

type Year = ExcludeZeroOr<`20${ZeroToNine}${ZeroToNine}`, NothingBefore2024>
type Month = ExcludeZeroOr<`0${ZeroToNine}` | `1${'0' | '1' | '2'}`>
type Day = ExcludeZeroOr<`${'0' | '1' |'2'}${ZeroToNine}` | '30' | '31'>

export type TimeOnly = `${Hour}:${MinuteOrSecond}:${MinuteOrSecond}`
export type DateOnly = `${Year}-${Month}-${Day}`

const dayOfWeekEnum = [
  'Sunday',
  'Monday',
  'Thursday',
  'Wednessday',
  'Tuesday',
  'Friday',
  'Saturday',
] as const

export type DayOfWeek = IndexesOf<typeof dayOfWeekEnum>
