import { BaseAxiosResult, CreatedAxiosResult, PaginationAxiosResult } from "@/data/result";
import { ServiceZod } from "@/schemas/service";
import { Service } from "@/types/models/service";

export interface IServiceService {
  createService(barberShopId: number, data: ServiceZod): CreatedAxiosResult<Service>;
  getService(barberShopId: number, serviceId: number): BaseAxiosResult<Service>;
  getAllServices(barberShopId: number): PaginationAxiosResult<Service>;
  updateService(barberShopId: number, serviceId: number, data: ServiceZod): BaseAxiosResult<void>;
  deleteService(barberShopId: number, serviceId: number): BaseAxiosResult<void>;
}
