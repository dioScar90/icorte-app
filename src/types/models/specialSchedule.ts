import { type Prettify } from "@/utils/types/prettify"
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
