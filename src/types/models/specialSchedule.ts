import { type Prettify } from "@/types/prettify"
import { type SpecialScheduleZod } from "@/schemas/specialSchedule"

export type SpecialSchedule = Prettify<
  {
    barberShopId: number
  }
  & SpecialScheduleZod
  & {
    isActive: boolean
  }
>
