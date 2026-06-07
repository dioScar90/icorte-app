import type { DateString } from "./date-string"
import type { TimeString } from "./time-string"

// type ZeroToNine = 0|1|2|3|4|5|6|7|8|9

// type H = `${0|1}${ZeroToNine}` | `2${0|1|2|3}`
// type M = `${0|1|2|3|4|5}${ZeroToNine}`
// type S = `${0|1|2|3|4|5}${ZeroToNine}`

// export type TimeString = `${H}:${M}:${S}`
export type DateTimeIsoString = `${DateString}T${TimeString}`
