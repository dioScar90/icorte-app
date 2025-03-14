import { Result } from "../result";
import { IAppointmentService as Interface } from "./interfaces/IAppointmentService";
import { ProxyContext } from "@/hooks/use-proxy";

function getUrl(id?: number) {
  const baseEndpoint = `/appointment`
  return !id ? baseEndpoint : `${baseEndpoint}/${id}`
}

export class AppointmentService implements Interface {
  constructor(private readonly httpClient: ProxyContext) {}
  
  createAppointment: Interface['createAppointment'] = async (data) => {
    const url = getUrl()
    
    try {
      const res = await this.httpClient.post(url, { ...data })
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  getAppointment: Interface['getAppointment'] = async (id, services) => {
    const url = getUrl(id) + (services ? '?services=true' : '')
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getAllAppointments: Interface['getAllAppointments'] = async () => {
    const url = getUrl()
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  updateAppointment: Interface['updateAppointment'] = async (id, data) => {
    const url = getUrl(id)
    
    try {
      await this.httpClient.put(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  updatePaymentType: Interface['updatePaymentType'] = async (id, paymentType) => {
    const url = getUrl(id)
    
    try {
      await this.httpClient.patch(url, { paymentType })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  deleteAppointment: Interface['deleteAppointment'] = async (id) => {
    const url = getUrl(id)
    
    try {
      await this.httpClient.delete(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
