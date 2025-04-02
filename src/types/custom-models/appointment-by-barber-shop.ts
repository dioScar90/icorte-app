import { type Prettify } from "@/types/prettify";
import { type Appointment } from "@/types/models/appointment";
import { type UserMe } from "@/types/models/user";

export type AppointmentByBarberShop = Prettify<
  & Omit<Appointment, 'clientId' | 'serviceIds'>
  & {
    client: Pick<NonNullable<UserMe['profile']>, 'id' | 'firstName' | 'lastName' | 'fullName'>
  }
>
