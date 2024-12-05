import { Prettify } from "@/utils/types/prettify"
import { DateOnly, TimeOnly } from "../../utils/types/date"
import { Service } from "./service"
import { AppointmentZod } from "@/schemas/appointment"

export enum AppointmentStatusEnum {
  Pendente,
  Finalizado,
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
