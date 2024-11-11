import { ReportZod } from "@/schemas/report"
import { Prettify } from "@/utils/types/prettify"

export type Report = Prettify<
  {
    id: number
    barberShopId: number
  }
  & ReportZod
>
