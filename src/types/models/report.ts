import { type ReportZod } from "@/schemas/report"
import { type Prettify } from "@/types/prettify"

export type Report = Prettify<
  {
    id: number
    barberShopId: number
  }
  & ReportZod
>
