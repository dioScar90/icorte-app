import { Prettify } from "@/utils/types/prettify"
import { DateOnly, TimeOnly } from "../../utils/types/date"
import { Service } from "./service"
import { AppointmentZod } from "@/schemas/appointment"

enum AppointmentStatusEnum {
  Pending,
  Completed,
}

export type Appointment = Prettify<
  {
    id: number
    clientId: number
    barberShopId: number
  }
  & Omit<AppointmentZod, 'date'>
  & {
    date: DateOnly
    totalDuration: TimeOnly
    totalPrice: number
    status: AppointmentStatusEnum
    services: Service[]
  }
>
