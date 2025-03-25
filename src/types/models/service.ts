import { type Prettify } from "@/utils/types/prettify"
import { type ServiceZod } from "@/schemas/service"

export type Service = Prettify<
  {
    id: number
    barberShopId: number
  }
  & ServiceZod
>
