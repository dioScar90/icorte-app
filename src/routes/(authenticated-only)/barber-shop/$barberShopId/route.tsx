import { createFileRoute, Outlet } from '@tanstack/react-router'
import type { BarberShop } from "@/types/models/barberShop";
import { z } from 'zod';
import { getBarberShopImageUrl } from '@/hooks/use-auth';

const schema = z.object({
  barberShopId: z.number()
}) satisfies z.ZodType<{ barberShopId: BarberShop['id'] }>

export const Route = createFileRoute(
  '/(authenticated-only)/barber-shop/$barberShopId',
)({
  component: RouteComponent,
  params: schema,
  beforeLoad: ({ context, params }) => {
    if (!context.auth.isBarberShop) {
      context.goHome()
    }

    if (params.barberShopId !== context.auth.user?.barberShop?.id) {
      context.goHome()
    }
    
    return {
      barberShop: {
        getBarberShop: context.barberShop.service.getBarberShop,
        update: context.barberShop.service.updateBarberShop,
        getAppointments: context.barberShop.service.getAppointmentsByBarberShop,

        loadBarber: () => context.barberShop.service.getBarberShop(params.barberShopId)
          .then(res => res)
          .then(res => {
            if (!res.isSuccess) {
              return null
            }

            return {
              ...res.value.value,
              imageUrl: getBarberShopImageUrl(res.value.value),
            }
          })
      }
    }
  },
})

function RouteComponent() {
  return (
    <Outlet />
  )
}
