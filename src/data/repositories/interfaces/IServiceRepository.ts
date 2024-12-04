import { BaseResult, CreatedResult, Pagination, PaginationResult } from "@/data/result";
import { ServiceZod } from "@/schemas/service";
import { Service } from "@/types/models/service";

export interface IServiceRepository {
  createService(barberShopId: number, data: ServiceZod): CreatedResult<Service>;
  getService(barberShopId: number, serviceId: number): BaseResult<Service>;
  getAllServices(barberShopId: number, pag?: Pagination): PaginationResult<Service>;
  updateService(barberShopId: number, serviceId: number, data: ServiceZod): BaseResult<void>;
  deleteService(barberShopId: number, serviceId: number): BaseResult<void>;
}
