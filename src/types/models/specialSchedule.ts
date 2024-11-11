import { TimeOnly, DateOnly } from "../../utils/types/date"

export type SpecialSchedule = {
  date: DateOnly
  barberShopId: number
  notes?: string
  openTime?: TimeOnly
  closeTime?: TimeOnly
  isClosed: boolean
}
