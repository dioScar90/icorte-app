import { AddressZod } from "@/schemas/address"
import { Prettify } from "@/utils/types/prettify"

export type Address = Prettify<
  {
    id: number
  }
  & AddressZod
>
