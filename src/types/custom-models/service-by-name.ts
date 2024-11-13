import { Prettify } from "@/utils/types/prettify";
import { Service } from "../models/service";

export type ServiceByName = Prettify<
  Service & {
    barberShopName: string
  }
>
