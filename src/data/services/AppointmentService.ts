import { Result, type PaginationResult } from "@/data/result";
import { BaseService } from "./_baseService";
import type { Appointment } from "@/types/models/appointment";
import type { AppointmentZod } from "@/schemas/appointment";

function getUrl(id?: number, services?: boolean) {
  const baseEndpoint = `/appointment`
  const urlWithoutServices = !id ? baseEndpoint : `${baseEndpoint}/${id}`
  const servicesMaybe = services ? '?services=true' : ''
  return urlWithoutServices + servicesMaybe
}

export class AppointmentService extends BaseService<Appointment, AppointmentZod> {
  constructor(httpClient: ConstructorParameters<typeof BaseService>[0]) {
    super(httpClient, getUrl)
  }
  
  async createAppointment(data: AppointmentZod) {
    return await this.create(data)
  }
  
  async getAppointment(id: number, services?: boolean) {
    return await this.get(id, services)
  }
  
  async getAllAppointments() {
    const url = getUrl()
    return await this.getAll(url)
  }
  
  async updateAppointment(id: number, data: AppointmentZod) {
    return await this.update(data, id)
  }
  
  async updatePaymentType(id: number, paymentType: AppointmentZod['paymentType']) {
    const url = getUrl(id)
    
    try {
      await this.httpClient.patch(url, { paymentType })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  async deleteAppointment(id: number) {
    return await this.delete(id)
  }
}
