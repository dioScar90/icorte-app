import { type AddressZod } from "@/schemas/address"
import { type Prettify } from "@/utils/types/prettify"

export type Address = Prettify<
  {
    id: number
  }
  & AddressZod
>
