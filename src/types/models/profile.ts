import { ProfileZod } from "@/schemas/profile"
import { Prettify } from "@/utils/types/prettify"

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
