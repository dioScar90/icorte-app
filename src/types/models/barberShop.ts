import { Prettify } from "@/utils/types/prettify"
import { RecurringSchedule } from "./recurringSchedule"
import { Report } from "./report"
import { Service } from "./service"
import { SpecialSchedule } from "./specialSchedule"
import { BarberShopZod } from "@/schemas/barberShop"

export type BarberShop = Prettify<
  {
    id: number
    ownerId: number
  }
  & BarberShopZod
  & {
    recurringSchedule: RecurringSchedule[]
    specialSchedules: SpecialSchedule[]
    services: Service[]
    reports: Report[]
  }
>

export type TopBarberShop = Prettify<Pick<BarberShop, 'id' | 'name' | 'description'> & Pick<Report, 'rating'>>
