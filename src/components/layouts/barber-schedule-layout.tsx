import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";
import { BarberScheduleRepository } from "@/data/repositories/BarberScheduleRepository";
import { ServiceRepository } from "@/data/repositories/ServiceRepository";
import { AppointmentRepository } from "@/data/repositories/AppointmentRepository";
import { BarberScheduleService } from "@/data/services/BarberScheduleService";
import { httpClient } from "@/providers/proxyProvider";
import { useCallback, useMemo } from "react";
import { ServiceService } from "@/data/services/ServiceService";
import { AppointmentService } from "@/data/services/AppointmentService";
import { barberScheduleLoader } from "@/data/loaders/barberScheduleLoader";

type BarberScheduleLayoutContextType = {
  appointments: Awaited<ReturnType<typeof barberScheduleLoader>>

  getTopBarbers: BarberScheduleRepository['getTopBarbersWithAvailability']
  getAvailableDates: BarberScheduleRepository['getAvailableDatesForBarber']
  getAbailableSlots: BarberScheduleRepository['getAvailableSlots']
  servicesByName: BarberScheduleRepository['searchServicesByNameAsync']

  getService: ServiceRepository['getService']
  getAllServices: ServiceRepository['getAllServices']

  createAppointment: AppointmentRepository['createAppointment']
  getAppointment: AppointmentRepository['getAppointment']
  getAllAppointments: AppointmentRepository['getAllAppointments']
  updateAppointment: AppointmentRepository['updateAppointment']
  updatePaymentType: AppointmentRepository['updatePaymentType']
  deleteAppointment: AppointmentRepository['deleteAppointment']
}

export function BarberScheduleLayout() {
  const appointments = useLoaderData() as Awaited<ReturnType<typeof barberScheduleLoader>>
  const barberScheduleRep = useMemo(() => new BarberScheduleRepository(new BarberScheduleService(httpClient)), [])
  const serviceRep = useMemo(() => new ServiceRepository(new ServiceService(httpClient)), [])
  const appointmentRep = useMemo(() => new AppointmentRepository(new AppointmentService(httpClient)), [])
  
  const getTopBarbers = useCallback(async function(...args: Parameters<typeof barberScheduleRep.getTopBarbersWithAvailability>) {
    return await barberScheduleRep.getTopBarbersWithAvailability(...args)
  }, [])

  const getAvailableDates = useCallback(async function(...args: Parameters<typeof barberScheduleRep.getAvailableDatesForBarber>) {
    return await barberScheduleRep.getAvailableDatesForBarber(...args)
  }, [])

  const getAbailableSlots = useCallback(async function(...args: Parameters<typeof barberScheduleRep.getAvailableSlots>) {
    return await barberScheduleRep.getAvailableSlots(...args)
  }, [])

  const servicesByName = useCallback(async function(...args: Parameters<typeof barberScheduleRep.searchServicesByNameAsync>) {
    return await barberScheduleRep.searchServicesByNameAsync(...args)
  }, [])
  
  const getService = useCallback(async function(...args: Parameters<typeof serviceRep.getService>) {
    return await serviceRep.getService(...args)
  }, [])
  
  const getAllServices = useCallback(async function(...args: Parameters<typeof serviceRep.getAllServices>) {
    return await serviceRep.getAllServices(...args)
  }, [])
  
  const createAppointment = useCallback(async function(...args: Parameters<typeof appointmentRep.createAppointment>) {
    return await appointmentRep.createAppointment(...args)
  }, [])

  const getAppointment = useCallback(async function(...args: Parameters<typeof appointmentRep.getAppointment>) {
    return await appointmentRep.getAppointment(...args)
  }, [])

  const getAllAppointments = useCallback(async function(...args: Parameters<typeof appointmentRep.getAllAppointments>) {
    return await appointmentRep.getAllAppointments(...args)
  }, [])

  const updateAppointment = useCallback(async function(...args: Parameters<typeof appointmentRep.updateAppointment>) {
    return await appointmentRep.updateAppointment(...args)
  }, [])

  const updatePaymentType = useCallback(async function(...args: Parameters<typeof appointmentRep.updatePaymentType>) {
    return await appointmentRep.updatePaymentType(...args)
  }, [])

  const deleteAppointment = useCallback(async function(...args: Parameters<typeof appointmentRep.deleteAppointment>) {
    return await appointmentRep.deleteAppointment(...args)
  }, [])

  const props: BarberScheduleLayoutContextType = {
    appointments,
    getTopBarbers,
    getAvailableDates,
    getAbailableSlots,
    servicesByName,
    getService,
    getAllServices,
    createAppointment,
    getAppointment,
    getAllAppointments,
    updateAppointment,
    updatePaymentType,
    deleteAppointment,
  }
  
  return (
    <Outlet context={props} />
  )
}

export function useBarberScheduleLayout() {
  return useOutletContext<BarberScheduleLayoutContextType>()
}
