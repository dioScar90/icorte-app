import { type Prettify } from "@/types/prettify"
import { type RecurringSchedule } from "./recurringSchedule"
import { type Report } from "./report"
import { type Service } from "./service"
import { type SpecialSchedule } from "./specialSchedule"
import { type BarberShopZod } from "@/schemas/barberShop"

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
    imageUrl?: string
  }
>

export type TopBarberShop = Prettify<Pick<BarberShop, 'id' | 'name' | 'description'> & Pick<Report, 'rating'>>
