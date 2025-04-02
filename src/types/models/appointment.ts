import { type Prettify } from "@/utils/types/prettify"
import { type DateString } from "../../utils/types/datetime/date-string"
import { type TimeString } from "../../utils/types/datetime/time-string"
import { type Service } from "./service"
import { type AppointmentZod } from "@/schemas/appointment"

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
    date: DateString
    totalDuration: TimeString
    totalPrice: number
    status: AppointmentStatusEnum
    services: Service[]
  }
>
