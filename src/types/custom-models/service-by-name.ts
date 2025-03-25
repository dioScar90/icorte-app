import { type Prettify } from "@/utils/types/prettify";
import { type Service } from "@/types/models/service";

export type ServiceByName = Prettify<
  Service & {
    barberShopName: string
  }
>
