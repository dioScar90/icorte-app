import { AppointmentType } from "@/schemas/appointment";
import { IAppointmentService } from "./interfaces/IAppointmentService";
import { AxiosInstance } from "axios";

function getUrl(id?: number) {
  const baseEndpoint = `/appointment`

  if (!id) {
    return baseEndpoint
  }
  
  return `${baseEndpoint}/${id}`
}

export class AppointmentService implements IAppointmentService {
  constructor(private readonly httpClient: AxiosInstance) {}
  
  async createAppointment(data: AppointmentType) {
    const url = getUrl()
    return await this.httpClient.post(url, { ...data })
  }

  async getAppointment(id: number) {
    const url = getUrl(id)
    return await this.httpClient.get(url)
  }

  async getAllAppointments() {
    const url = getUrl()
    return await this.httpClient.get(url)
  }

  async updateAppointment(id: number, data: AppointmentType) {
    const url = getUrl(id)
    return await this.httpClient.put(url, { ...data })
  }

  async deleteAppointment(id: number) {
    const url = getUrl(id)
    return await this.httpClient.delete(url)
  }
}
