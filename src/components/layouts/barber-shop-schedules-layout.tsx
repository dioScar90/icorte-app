import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { httpClient } from "@/providers/proxyProvider";
import { useBarberShopLayout } from "./barber-shop-layout";
import { RecurringScheduleRepository } from "@/data/repositories/RecurringScheduleRepository";
import { SpecialScheduleRepository } from "@/data/repositories/SpecialScheduleRepository";
import { RecurringScheduleService } from "@/data/services/RecurringScheduleService";
import { SpecialScheduleService } from "@/data/services/SpecialScheduleService";
import { schedulesLoader } from "@/data/loaders/schedulesLoader";

type BarberShopSchedulesLayoutContextType = {
  barberShop: ReturnType<typeof useBarberShopLayout>['barberShop']
  
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
  const { barberShop } = useBarberShopLayout()
  const { recurringSchedules, specialSchedules } = useLoaderData() as NonNullable<Awaited<ReturnType<typeof schedulesLoader>>>
  const recurringRep = useMemo(() => new RecurringScheduleRepository(new RecurringScheduleService(httpClient)), [])
  const specialRep = useMemo(() => new SpecialScheduleRepository(new SpecialScheduleService(httpClient)), [])
  
  const recurringRegister = useCallback(async function(...args: Parameters<typeof recurringRep.createRecurringSchedule>) {
    return await recurringRep.createRecurringSchedule(...args)
  }, [])
  
  const recurringUpdate = useCallback(async function(...args: Parameters<typeof recurringRep.updateRecurringSchedule>) {
    return await recurringRep.updateRecurringSchedule(...args)
  }, [])
  
  const recurringRemove = useCallback(async function(...args: Parameters<typeof recurringRep.deleteRecurringSchedule>) {
    return await recurringRep.deleteRecurringSchedule(...args)
  }, [])
  
  const specialRegister = useCallback(async function(...args: Parameters<typeof specialRep.createSpecialSchedule>) {
    return await specialRep.createSpecialSchedule(...args)
  }, [])
  
  const specialUpdate = useCallback(async function(...args: Parameters<typeof specialRep.updateSpecialSchedule>) {
    return await specialRep.updateSpecialSchedule(...args)
  }, [])
  
  const specialRemove = useCallback(async function(...args: Parameters<typeof specialRep.deleteSpecialSchedule>) {
    return await specialRep.deleteSpecialSchedule(...args)
  }, [])
  
  const props: BarberShopSchedulesLayoutContextType = {
    barberShop,
    recurring: {
      register: recurringRegister,
      update: recurringUpdate,
      remove: recurringRemove,
      schedules: recurringSchedules,
    },
    special: {
      register: specialRegister,
      update: specialUpdate,
      remove: specialRemove,
      schedules: specialSchedules,
    },
  }
  
  return (
    <Outlet context={props} />
  )
}

export function useSchedulesLayout() {
  return useOutletContext<BarberShopSchedulesLayoutContextType>()
}
