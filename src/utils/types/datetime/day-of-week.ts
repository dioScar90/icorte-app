import type { daysOfWeek } from "@/schemas/recurringSchedule"
import type { IndexesOf } from "../indexes-of"

export type DayOfWeek = IndexesOf<typeof daysOfWeek>
