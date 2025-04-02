import { type Prettify } from "@/types/prettify";
import { type Service } from "@/types/models/service";

export type ServiceByName = Prettify<
  Service & {
    barberShopName: string
  }
>
