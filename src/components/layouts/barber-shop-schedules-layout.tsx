import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";
import { useMemo } from "react";
import { httpClient } from "@/providers/proxyProvider";
import { BarberShopLayoutContextType } from "./barber-shop-layout";
import { RecurringScheduleRepository } from "@/data/repositories/RecurringScheduleRepository";
import { SpecialScheduleRepository } from "@/data/repositories/SpecialScheduleRepository";
import { RecurringScheduleService } from "@/data/services/RecurringScheduleService";
import { SpecialScheduleService } from "@/data/services/SpecialScheduleService";
import { schedulesLoader } from "@/data/loaders/schedulesLoader";

export type BarberShopSchedulesLayoutContextType = {
  barberShop: BarberShopLayoutContextType['barberShop']
  
  recurring: {
    schedules: NonNullable<Awaited<ReturnType<typeof schedulesLoader>>>['recurringSchedules']
    register: RecurringScheduleRepository['createRecurringSchedule']
    update: RecurringScheduleRepository['updateRecurringSchedule']
    remove: RecurringScheduleRepository['deleteRecurringSchedule']
  }
  
  special: {
    schedules: NonNullable<Awaited<ReturnType<typeof schedulesLoader>>>['specialSchedules']
    register: SpecialScheduleRepository['createSpecialSchedule']
    update: SpecialScheduleRepository['updateSpecialSchedule']
    remove: SpecialScheduleRepository['deleteSpecialSchedule']
  }
}

export function BarberShopSchedulesLayout() {
  const { barberShop } = useOutletContext<BarberShopLayoutContextType>()
  const { recurringSchedules, specialSchedules } = useLoaderData() as NonNullable<Awaited<ReturnType<typeof schedulesLoader>>>
  const recurringRep = useMemo(() => new RecurringScheduleRepository(new RecurringScheduleService(httpClient)), [])
  const specialRep = useMemo(() => new SpecialScheduleRepository(new SpecialScheduleService(httpClient)), [])
  
  return (
    <Outlet
      context={{
        barberShop,
        recurring: {
          register: recurringRep.createRecurringSchedule,
          update: recurringRep.updateRecurringSchedule,
          remove: recurringRep.deleteRecurringSchedule,
          schedules: recurringSchedules,
        },
        special: {
          register: specialRep.createSpecialSchedule,
          update: specialRep.updateSpecialSchedule,
          remove: specialRep.deleteSpecialSchedule,
          schedules: specialSchedules,
        },
      }}
    />
  )
}

export function useSchedulesLayout() {
  return useOutletContext<BarberShopSchedulesLayoutContextType>()
}
