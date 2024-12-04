import { Prettify } from "@/utils/types/prettify";
import { Appointment } from "../models/appointment";
import { UserMe } from "../models/user";

export type AppointmentByBarberShop = Prettify<
  & Omit<Appointment, 'clientId' | 'serviceIds'>
  & {
    client: Pick<NonNullable<UserMe['profile']>, 'id' | 'firstName' | 'lastName' | 'fullName'>
  }
>
