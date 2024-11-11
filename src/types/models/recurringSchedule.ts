import { DayOfWeek, TimeOnly } from "../../utils/types/date"

export type RecurringSchedule = {
  dayOfWeek: DayOfWeek
  barberShopId: number
  openTime: TimeOnly
  closeTime: TimeOnly
  isActive: boolean
}
