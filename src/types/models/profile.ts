import { type ProfileZod } from "@/schemas/profile"
import { type Prettify } from "@/utils/types/prettify"

export type Profile = Prettify<
  {
    id: number
  }
  & Omit<ProfileZod, 'phoneNumber'>
  & {
    fullName: string
    imageUrl?: string
  }
>
