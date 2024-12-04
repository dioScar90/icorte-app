import { httpClient } from "@/providers/proxyProvider";
import { AppointmentRepository } from "../repositories/AppointmentRepository";
import { AppointmentService } from "../services/AppointmentService";
import { LoaderFunctionArgs } from "react-router-dom";

export async function myAppointmentLoader({ params }: LoaderFunctionArgs) {
  try {
    const repository = new AppointmentRepository(new AppointmentService(httpClient))
    const res = await repository.getAppointment(+params?.appointmentId!)
    
    if (!res.isSuccess) {
      return null
    }
    
    return res.value
  } catch (err) {
    return null
  }
}
