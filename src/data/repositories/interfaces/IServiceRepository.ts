import { BaseResult, CreatedResult, PaginationResult } from "@/data/result";
import { ServiceZod } from "@/schemas/service";
import { Service } from "@/types/models/service";

export interface IServiceRepository {
  createService(barberShpoId: number, data: ServiceZod): CreatedResult<Service>;
  getService(barberShpoId: number, serviceId: number): BaseResult<Service>;
  getAllServices(barberShpoId: number): PaginationResult<Service>;
  updateService(barberShpoId: number, serviceId: number, data: ServiceZod): BaseResult<void>;
  deleteService(barberShpoId: number, serviceId: number): BaseResult<void>;
}
