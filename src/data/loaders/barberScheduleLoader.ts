import { httpClient } from "@/providers/proxyProvider";
import { AppointmentRepository } from "../repositories/AppointmentRepository";
import { AppointmentService } from "../services/AppointmentService";

export async function barberScheduleLoader() {
  try {
    const repository = new AppointmentRepository(new AppointmentService(httpClient))
    const res = await repository.getAllAppointments()
    
    if (!res.isSuccess) {
      return null
    }
    
    return res.value
  } catch (err) {
    return null
  }
}
