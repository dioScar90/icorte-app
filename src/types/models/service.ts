import { type Prettify } from "@/types/prettify"
import { type ServiceZod } from "@/schemas/service"

export type Service = Prettify<
  {
    id: number
    barberShopId: number
  }
  & ServiceZod
>
