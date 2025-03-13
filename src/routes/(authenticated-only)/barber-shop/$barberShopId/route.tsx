import { createFileRoute } from '@tanstack/react-router'
import { BarberShop } from "@/types/models/barberShop";
import { z } from 'zod';

const schema = z.object({
  barberShopId: z.number()
}) satisfies z.ZodType<{ barberShopId: BarberShop['id'] }>

export const Route = createFileRoute(
  '/(authenticated-only)/barber-shop/$barberShopId',
)({
  component: RouteComponent,
  params: {
    // parse: ({ barberShopId }) => ({ barberShopId: +barberShopId }),
    parse: (params) => schema.parse(params),
  }
})

function RouteComponent() {
  return (
    <div>
      Hello
      "/(authenticated-only)/(barber-shop-only)/barber-shop/$barberShopId"!
    </div>
  )
}
