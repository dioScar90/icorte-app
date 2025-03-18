import { BarberShop } from '@/types/models/barberShop'
import { queryOptions } from '@tanstack/react-query'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { z } from 'zod'

const validateSearchSchema = z.object({
  q: z.string().optional(),
  newAppointment: z.object({
    barberShopId: z.number().int(),
    defaultServiceId: z.number().int(),
  }).optional(),
}) satisfies z.ZodType<{
  q?: string,
  newAppointment?: {
    barberShopId: BarberShop['id'],
    defaultServiceId: BarberShop['services'][number]['id'],
  },
}>

export const Route = createFileRoute(
  '/(authenticated-only)/barber-schedule/new-appointment',
)({
  component: RouteComponent,
  beforeLoad: ({ context: { handleError, barberSchedule }, search, location }) => ({
    servicesByNameQueryOptions: () =>
      queryOptions({
        queryKey: [location.pathname, { q: search.q! }],
        queryFn: () => barberSchedule.servicesByName(search.q!)
          .then(resp => resp)
          .then(resp => {
            if (!resp.isSuccess) {
              throw resp.error
            }
            
            if (!resp.value.items.length) {
              return {
                id: 'NOT_FOUND',
                description: 'Não encontrado',
              } as const
            }
            
            return resp.value.items
          })
          .catch(err => {
            handleError(err)
            return {
              id: 'INITIAL_STATE',
              description: 'Digite para começar',
            } as const
          }),
        enabled: !!search.q,
      }),
    appointmentsQueryOptions: (...args: Parameters<typeof barberSchedule.getAbailableSlots>) => 
      queryOptions({
        queryKey: ['available-slots', { ...search }],
        queryFn: () => barberSchedule.getAbailableSlots(...args)
          .then(resp => resp)
          .then(resp => {
            if (!resp.isSuccess) {
              throw resp.error
            }
            
            if (!resp.value.length) {
              return []
            }
            
            return resp.value
          })
          .catch(err => {
            handleError(err)
            return []
          }),
        enabled: !!search.newAppointment?.barberShopId,
      }),
    allServicesQueryOptions: (...args: Parameters<typeof barberSchedule.getAllServices>) => 
      queryOptions({
        queryKey: ['all-services', { ...search }],
        queryFn: () => barberSchedule.getAllServices(...args)
          .then(resp => resp)
          .then(resp => {
            if (!resp.isSuccess) {
              throw resp.error
            }
            
            if (!resp.value.items.length) {
              return []
            }
            
            return resp.value.items
          })
          .catch(err => {
            handleError(err)
            return []
          }),
        enabled: !!search.newAppointment?.barberShopId,
      }),
  }),
  loader: async ({ context: { queryClient, servicesByNameQueryOptions } }) =>
    queryClient.ensureQueryData(servicesByNameQueryOptions()),
  validateSearch: validateSearchSchema,
})

function RouteComponent() {
  return (
    <Outlet />
  )
}
