import { Outlet, useOutletContext } from "react-router-dom";
import { BarberScheduleRepository } from "@/data/repositories/BarberScheduleRepository";
import { ServiceRepository } from "@/data/repositories/ServiceRepository";
import { AppointmentRepository } from "@/data/repositories/AppointmentRepository";
import { BarberScheduleService } from "@/data/services/BarberScheduleService";
import { httpClient } from "@/providers/proxyProvider";
import { useCallback, useMemo } from "react";
import { ServiceService } from "@/data/services/ServiceService";
import { AppointmentService } from "@/data/services/AppointmentService";

type BarberScheduleLayoutContextType = {
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
  deleteAppointment: AppointmentRepository['deleteAppointment']
}

export function BarberScheduleLayout() {
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

  const deleteAppointment = useCallback(async function(...args: Parameters<typeof appointmentRep.deleteAppointment>) {
    return await appointmentRep.deleteAppointment(...args)
  }, [])

  const props: BarberScheduleLayoutContextType = {
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
    deleteAppointment,
  }
  
  return (
    <Outlet context={props} />
  )
}

export function useBarberScheduleLayout() {
  return useOutletContext<BarberScheduleLayoutContextType>()
}
