import { BarberShopService } from '@/data/services/BarberShopService'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/barber-shop',
)({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const isRootRoute = location.pathname === '/barber-shop/'
    
    if (isRootRoute) {
      throw context.auth.isBarberShop
        ? redirect({
          to: '/barber-shop/$barberShopId',
          params: {
            barberShopId: context.auth.user?.barberShop?.id!,
          },
          replace: true,
        })
        : redirect({
          to: '/barber-shop/register',
          replace: true,
        })
    }

    const service = new BarberShopService(context.httpClient)
    
    return {
      barberShop: {
        service,
      },
    }
  },
})

function RouteComponent() {
  return (
    <Outlet />
  )
}
