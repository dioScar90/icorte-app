import { type DateString } from "../datetime/date-string"
import { type TimeString } from "../datetime/time-string"
import { type Service } from "./service"
import { type AppointmentZod } from "@/schemas/appointment"
import type { Profile } from "./profile"

export enum AppointmentStatusEnum {
  Pendente,
  Finalizado,
}

export type Appointment = {
  id: number
  clientId: Profile['id']
  client?: {
    id: Profile['id']
    firstName: Profile['firstName']
    lastName: Profile['lastName']
    fullName: Profile['fullName']
  }
  barberShopId: number
  startTime: AppointmentZod['startTime']
  paymentType: AppointmentZod['paymentType']
  notes: AppointmentZod['notes']
  serviceIds: AppointmentZod['serviceIds']
  date: DateString
  totalDuration: TimeString
  totalPrice: number
  services: Service[]
  status: AppointmentStatusEnum
}

