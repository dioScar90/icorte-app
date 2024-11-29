import { httpClient } from "@/providers/proxyProvider";
import { LoaderFunctionArgs } from "react-router-dom";
import { RecurringScheduleRepository } from "../repositories/RecurringScheduleRepository";
import { RecurringScheduleService } from "../services/RecurringScheduleService";
import { SpecialScheduleRepository } from "../repositories/SpecialScheduleRepository";
import { SpecialScheduleService } from "../services/SpecialScheduleService";

export async function schedulesLoader({ params }: LoaderFunctionArgs) {
  if (!params.barberShopId) {
    return null
  }
  
  const barberShopId = +params.barberShopId
  
  try {
    const recurringRep = new RecurringScheduleRepository(new RecurringScheduleService(httpClient))
    const specialRep = new SpecialScheduleRepository(new SpecialScheduleService(httpClient))
    
    const recurringRes = await recurringRep.getAllRecurringSchedules(barberShopId)
    const specialRes = await specialRep.getAllSpecialSchedules(barberShopId)
    
    if (!recurringRes.isSuccess || !specialRes.isSuccess) {
      return null
    }
    
    return {
      recurringSchedules: recurringRes.value,
      specialSchedules: specialRes.value,
    }
  } catch (err) {
    return null
  }
}
