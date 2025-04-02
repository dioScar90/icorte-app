import { type AddressZod } from "@/schemas/address"
import { type Prettify } from "@/types/prettify"

export type Address = Prettify<
  {
    id: number
  }
  & AddressZod
>
