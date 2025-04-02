import { type Prettify } from "@/types/prettify";
import { type UserMe } from "@/types/models/user";

export type UserByName = Prettify<
  & Pick<UserMe, 'id' | 'email' | 'phoneNumber'>
  & Pick<NonNullable<UserMe['profile']>, 'firstName' | 'lastName'>
  & { isBarberShop: boolean }
>
