import { BarberShopServiceDialog } from '@/components/barber-shop-services/_dialog'
import { TableBodyWithRows } from '@/components/barber-shop-services/_tableRows'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ServiceService } from '@/data/services/ServiceService'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'
import { z } from 'zod'

const BARBER_SHOP_SERVICES_ACTION = [
  'REGISTER',
  'UPDATE',
  'REMOVE',
] as const

export type BARBER_SHOP_SERVICES_ACTION_TYPES = typeof BARBER_SHOP_SERVICES_ACTION[number]

const serviceValidateSchema = z.object({
  open: z.discriminatedUnion('action', [
    z.object({
      action: z.enum(['REGISTER']),
      serviceId: z.undefined().optional(),
    }),
    z.object({
      action: z.enum(['UPDATE', 'REMOVE']),
      serviceId: z.number().int().min(1),
    }),
  ]).optional()
}) satisfies z.ZodType<{
  open?: {
    action: BARBER_SHOP_SERVICES_ACTION_TYPES
    serviceId?: number
  }
}>

export const Route = createFileRoute(
  '/(authenticated-only)/barber-shop/$barberShopId/services',
)({
  component: RouteComponent,
  beforeLoad: ({ context, params }) => {
    const service = new ServiceService(context.httpClient)
    
    return {
      services: {
        register: service.createService,
        update: service.updateService,
        remove: service.deleteService,

        getServices: () => service.getAllServices(params.barberShopId)
          .then(res => res)
          .then(res => res.isSuccess && res.value.items?.length > 0 ? res.value.items : []),
      }
    }
  },
  loader: async ({ context }) => ({
    barberShop: await context.barberShop.loadBarber(),
    services: await context.services.getServices(),
  }),
  validateSearch: serviceValidateSchema,
})

function RouteComponent() {
  const [barberShopName] = Route.useLoaderData({
    select: (s) => [
      s.barberShop?.name!,
    ] as const
  })
  
  const navigate = useNavigate({ from: Route.fullPath })
  
  return (
    <>
      <div className="before-card">
        <Card className="mx-auto max-w-sm min-w-[80vw] md:min-w-[750px] lg:min-w-[800px]">
          <CardHeader className="py-4 px-2 md:px-3 lg:px-4">
            <CardTitle className="text-2xl">Serviços - {barberShopName}</CardTitle>
            <CardDescription>
              Visualize e gerencia os serviços que aparecerão aos clientes.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-4 px-2 md:px-3 lg:px-4">
            <Table>
              <TableCaption>Sua lista de serviços oferecidos.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Nome</TableHead>
                  <TableHead className="text-center">Descrição</TableHead>
                  <TableHead className="text-center">Preço</TableHead>
                  <TableHead className="text-center">Duração</TableHead>
                  <TableHead className="text-center">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableBodyWithRows />
              </TableBody>
            </Table>

            <div className="w-full h-14 relative">
              <Button
                type="button" className="absolute-middle-y right-0"
                onClick={() => navigate({
                  search: (prev) => ({
                    ...prev,
                    open: {
                      action: 'REGISTER',
                    },
                  })
                })}
              >
                <ShoppingBag />
                Novo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BarberShopServiceDialog />
    </>
  )
}
