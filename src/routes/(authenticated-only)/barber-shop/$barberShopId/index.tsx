import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/barber-shop/$barberShopId/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello
      "/(authenticated-only)/(barber-shop-only)/barber-shop/$barberShopId/"!
    </div>
  )
}
