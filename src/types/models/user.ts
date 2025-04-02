import { type Prettify } from "@/types/prettify"
import { type BarberShop } from "./barberShop"
import { type Profile } from "./profile"
import { type UserRegisterZod } from "@/schemas/user"
import { type ProfileZod } from "@/schemas/profile"

const roles = [
  'Guest',
  'Client',
  'BarberShop',
  'Admin',
] as const

export type UserRole = typeof roles[number]

// export type UserMe = {
//   id: number
//   email: string
//   phoneNumber: string
//   roles: UserRole[]
//   profile?: Profile
//   barberShop?: BarberShop
// }



export type UserMe = Prettify<
  {
    id: number
  }
  & Omit<UserRegisterZod, 'confirmPassword' | 'password' | 'profile'>
  & Pick<ProfileZod, 'phoneNumber'>
  & {
    roles: UserRole[]
    profile?: Profile
    barberShop?: BarberShop
  }
>
