import { Prettify } from "@/utils/types/prettify"
import { RecurringScheduleZod } from "@/schemas/recurringSchedule"

export type RecurringSchedule = Prettify<
  {
    barberShopId: number
  }
  & RecurringScheduleZod
  & {
    isActive: boolean
  }
>
