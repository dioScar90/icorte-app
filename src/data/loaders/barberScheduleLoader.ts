import { httpClient } from "@/providers/proxyProvider";
import { AppointmentRepository } from "../repositories/AppointmentRepository";
import { AppointmentService } from "../services/AppointmentService";
import { RedirectorError, ROUTE_ENUM } from "@/types/route";
import { LoaderFunctionArgs, redirect } from "react-router-dom";

export async function barberScheduleLoader({ request }: LoaderFunctionArgs) {
  try {
    if (request.url === location.origin + ROUTE_ENUM.BARBER_SCHEDULE) {
      throw new RedirectorError(`${ROUTE_ENUM.BARBER_SCHEDULE}/dashboard`)
    }
    
    const repository = new AppointmentRepository(new AppointmentService(httpClient))
    const res = await repository.getAllAppointments()
    
    if (!res.isSuccess) {
      return null
    }
    
    return res.value
  } catch (err) {
    return err instanceof RedirectorError ? redirect(err.url) : null
  }
}
