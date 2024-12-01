import { Prettify } from "@/utils/types/prettify";
import { UserMe } from "../models/user";

export type UserByName = Prettify<
  & Pick<UserMe, 'id' | 'email' | 'phoneNumber'>
  & Pick<NonNullable<UserMe['profile']>, 'firstName' | 'lastName'>
  & { isBarberShop: boolean }
>
