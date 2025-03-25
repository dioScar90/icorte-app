import { type Prettify } from "@/utils/types/prettify"
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
