import { Prettify } from "@/utils/types/prettify"
import { ServiceZod } from "@/schemas/service"

export type Service = Prettify<
  {
    id: number
    barberShopId: number
  }
  & ServiceZod
>
