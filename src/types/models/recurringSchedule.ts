import { type Prettify } from "@/types/prettify"
import { type RecurringScheduleZod } from "@/schemas/recurringSchedule"

export type RecurringSchedule = Prettify<
  {
    barberShopId: number
  }
  & RecurringScheduleZod
  & {
    isActive: boolean
  }
>
