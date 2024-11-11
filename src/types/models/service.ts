import { TimeOnly } from "../../utils/types/date"

export type Service = {
  id: number
  barberShopId: number
  name: string
  description?: string
  price: number
  duration: TimeOnly
}
