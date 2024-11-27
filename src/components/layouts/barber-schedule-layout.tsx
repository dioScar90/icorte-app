import { Outlet } from "react-router-dom";
import { BarberScheduleRepository } from "@/data/repositories/BarberScheduleRepository";
import { DateOnly } from "@/utils/types/date";
import { ServiceRepository } from "@/data/repositories/ServiceRepository";
import { AppointmentRepository } from "@/data/repositories/AppointmentRepository";
import { AppointmentZod } from "@/schemas/appointment";
import { BarberScheduleService } from "@/data/services/BarberScheduleService";
import { httpClient } from "@/providers/proxyProvider";
import { useCallback, useMemo } from "react";
import { ServiceService } from "@/data/services/ServiceService";
import { AppointmentService } from "@/data/services/AppointmentService";

export type BarberScheduleLayoutContextType = {
  getTopBarbers: (dateOfWeek: DateOnly) => Promise<ReturnType<BarberScheduleRepository['getTopBarbersWithAvailability']>>
  getAvailableDates: (barberShopId: number, dateOfWeek: DateOnly) => Promise<ReturnType<BarberScheduleRepository['getAvailableDatesForBarber']>>
  getAbailableSlots: (barberShopId: number, date: DateOnly, serviceIds: number[]) => Promise<ReturnType<BarberScheduleRepository['getAvailableSlots']>>
  servicesByName: (q: string) => Promise<ReturnType<BarberScheduleRepository['searchServicesByNameAsync']>>

  getService: (barberShopId: number, serviceId: number) => Promise<ReturnType<ServiceRepository['getService']>>
  getAllServices: (barberShopId: number) => Promise<ReturnType<ServiceRepository['getAllServices']>>

  createAppointment: (data: AppointmentZod) => Promise<ReturnType<AppointmentRepository['createAppointment']>>
  getAppointment: (id: number) => Promise<ReturnType<AppointmentRepository['getAppointment']>>
  getAllAppointments: () => Promise<ReturnType<AppointmentRepository['getAllAppointments']>>
  updateAppointment: (id: number, data: AppointmentZod) => Promise<ReturnType<AppointmentRepository['updateAppointment']>>
  deleteAppointment: (id: number) => Promise<ReturnType<AppointmentRepository['deleteAppointment']>>
}

export function BarberScheduleLayout() {
  const barberScheduleRep = useMemo(() => new BarberScheduleRepository(new BarberScheduleService(httpClient)), [])
  const serviceRep = useMemo(() => new ServiceRepository(new ServiceService(httpClient)), [])
  const appointmentRep = useMemo(() => new AppointmentRepository(new AppointmentService(httpClient)), [])
  
  const getTopBarbers = useCallback(async function(dateOfWeek: DateOnly) {
    return await barberScheduleRep.getTopBarbersWithAvailability(dateOfWeek)
  }, [])

  const getAvailableDates = useCallback(async function(barberShopId: number, dateOfWeek: DateOnly) {
    return await barberScheduleRep.getAvailableDatesForBarber(barberShopId, dateOfWeek)
  }, [])

  const getAbailableSlots = useCallback(async function(barberShopId: number, date: DateOnly, serviceIds: number[]) {
    return await barberScheduleRep.getAvailableSlots(barberShopId, date, serviceIds)
  }, [])

  const servicesByName = useCallback(async function(q: string) {
    return await barberScheduleRep.searchServicesByNameAsync(q)
  }, [])
  
  const getService = useCallback(async function(serviceId: number, barberShopId: number) {
    return await serviceRep.getService(serviceId, barberShopId)
  }, [])
  
  const getAllServices = useCallback(async function(barberShopId: number) {
    return await serviceRep.getAllServices(barberShopId)
  }, [])
  
  const createAppointment = useCallback(async function(data: AppointmentZod) {
    return await appointmentRep.createAppointment(data)
  }, [])

  const getAppointment = useCallback(async function(id: number) {
    return await appointmentRep.getAppointment(id)
  }, [])

  const getAllAppointments = useCallback(async function() {
    return await appointmentRep.getAllAppointments()
  }, [])

  const updateAppointment = useCallback(async function(id: number, data: AppointmentZod) {
    return await appointmentRep.updateAppointment(id, data)
  }, [])

  const deleteAppointment = useCallback(async function(id: number) {
    return await appointmentRep.deleteAppointment(id)
  }, [])
  
  return <Outlet context={{
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
  }} />
}
