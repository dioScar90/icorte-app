import { Prettify } from "@/utils/types/prettify"
import { DateString } from "../../utils/types/date-string"
import { TimeString } from "../../utils/types/time-string"
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
    date: DateString
    totalDuration: TimeString
    totalPrice: number
    status: AppointmentStatusEnum
    services: Service[]
  }
>
