import { BaseAxiosResult, CreatedAxiosResult } from "@/data/result";
import { ServiceType } from "@/schemas/service";
import { Service } from "@/types/models/service";

export interface IServiceService {
  createService(barberShpoId: number, data: ServiceType): CreatedAxiosResult<Service>;
  getService(barberShpoId: number, id: number): BaseAxiosResult<Service>;
  getAllServices(barberShpoId: number): BaseAxiosResult<Service[]>;
  updateService(barberShpoId: number, id: number, data: ServiceType): BaseAxiosResult<boolean>;
  deleteService(barberShpoId: number, id: number): BaseAxiosResult<boolean>;
}
