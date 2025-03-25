import type { BaseResult, CreatedResult, Pagination, PaginationResult } from "@/data/result";
import type { ServiceZod } from "@/schemas/service";
import type { Service } from "@/types/models/service";

export interface IServiceService {
  createService(barberShopId: number, data: ServiceZod): CreatedResult<Service>;
  getService(barberShopId: number, serviceId: number): BaseResult<Service>;
  getAllServices(barberShopId: number, pag?: Pagination): PaginationResult<Service>;
  updateService(barberShopId: number, serviceId: number, data: ServiceZod): BaseResult<void>;
  deleteService(barberShopId: number, serviceId: number): BaseResult<void>;
}
