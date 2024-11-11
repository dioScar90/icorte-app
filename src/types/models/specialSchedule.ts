import { Prettify } from "@/utils/types/prettify"
import { SpecialScheduleZod } from "@/schemas/specialSchedule"

export type SpecialSchedule = Prettify<
  {
    barberShopId: number
  }
  & SpecialScheduleZod
  & {
    isActive: boolean
  }
>
