import { BaseAxiosResult, CreatedAxiosResult, PaginationAxiosResult } from "@/data/result";
import { ServiceZod } from "@/schemas/service";
import { Service } from "@/types/models/service";

export interface IServiceService {
  createService(barberShpoId: number, data: ServiceZod): CreatedAxiosResult<Service>;
  getService(barberShpoId: number, serviceId: number): BaseAxiosResult<Service>;
  getAllServices(barberShpoId: number): PaginationAxiosResult<Service>;
  updateService(barberShpoId: number, serviceId: number, data: ServiceZod): BaseAxiosResult<void>;
  deleteService(barberShpoId: number, serviceId: number): BaseAxiosResult<void>;
}
