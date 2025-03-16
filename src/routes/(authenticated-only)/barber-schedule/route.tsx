import { AppointmentService } from '@/data/services/AppointmentService'
import { BarberScheduleService } from '@/data/services/BarberScheduleService'
import { ServiceService } from '@/data/services/ServiceService'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/barber-schedule',
)({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isClient) {
      throw redirect({
        to: '/login',
        replace: true,
      })
    }
    
    if (location.pathname === '/barber-schedule/') {
      throw redirect({
        to: '/barber-schedule/dashboard',
        replace: true,
      })
    }
        
    const appointmentService = new AppointmentService(context.httpClient)
    const barberScheduleService = new BarberScheduleService(context.httpClient)
    const serviceService = new ServiceService(context.httpClient)
    
    return {
      barberSchedule: {
        getTopBarbers: barberScheduleService.getTopBarbersWithAvailability,
        getAvailableDates: barberScheduleService.getAvailableDatesForBarber,
        getAbailableSlots: barberScheduleService.getAvailableSlots,
        servicesByName: barberScheduleService.searchServicesByNameAsync,
        getService: serviceService.getService,
        getAllServices: serviceService.getAllServices,
        createAppointment: appointmentService.createAppointment,
        getAppointment: appointmentService.getAppointment,
        getAllAppointments: appointmentService.getAllAppointments,
        updateAppointment: appointmentService.updateAppointment,
        updatePaymentType: appointmentService.updatePaymentType,
        deleteAppointment: appointmentService.deleteAppointment,
      }
    }
  }
})

function RouteComponent() {
  return <Outlet />
}
