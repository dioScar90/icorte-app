import { BaseResult, CreatedResult, PaginationResult } from "@/data/result";
import { ServiceType } from "@/schemas/service";
import { Service } from "@/types/models/service";

export interface IServiceRepository {
  createService(barberShpoId: number, data: ServiceType): CreatedResult<Service>;
  getService(barberShpoId: number, id: number): BaseResult<Service>;
  getAllServices(barberShpoId: number): PaginationResult<Service>;
  updateService(barberShpoId: number, id: number, data: ServiceType): BaseResult<boolean>;
  deleteService(barberShpoId: number, id: number): BaseResult<boolean>;
}
