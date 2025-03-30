import { Alert, AlertDescription } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { paginationSchemaValidation } from '@/data/result'
import { cn } from '@/lib/utils'
import { PaymentTypeEnum } from '@/schemas/appointment'
import { getFormattedDate } from '@/schemas/sharedValidators/dateString'
import { getFormattedHour } from '@/schemas/sharedValidators/timeString'
import { getEnumAsString } from '@/utils/enum-transformer'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { DoorClosed, DoorOpen } from 'lucide-react'
import { Suspense, useEffect } from 'react'

export const Route = createFileRoute(
  '/(authenticated-only)/barber-shop/$barberShopId/dashboard',
)({
  component: RouteComponent,
  beforeLoad: ({ context, params, search }) => {
    function getPaginationObj(resp?: Awaited<ReturnType<typeof context.barberShop.getAppointments>>) {
      if (!resp?.value?.items?.length) {
        return {
          appointments: [],
          pagination: undefined,
        }
      }

      const { items: appointments, ...pagination } = resp.value

      return {
        appointments,
        pagination,
      }
    }

    return {
      queryOptions: () => queryOptions({
        queryKey: ['appointmentsByBarbershop', { ...params, ...search.pagination }],
        queryFn: () => context.barberShop.getAppointments(params.barberShopId, { ...search.pagination!, pageSize: 5 })
          .then(resp => {
            if (!resp.isSuccess) {
              throw resp.error
            }

            return getPaginationObj(resp)
          })
          .catch(err => {
            context.handleError(err)
            return getPaginationObj()
          }),
        enabled: !!params.barberShopId && !!search.pagination?.page,
      })
    }
  },
  loader: async ({ context }) => ({
    barberShop: await context.barberShop.loadBarber(),
  }),
  validateSearch: paginationSchemaValidation,
})

function BarberShopDashboardTbodyItems() {
  const [queryOptions] = Route.useRouteContext({
    select: (s) => [
      s.queryOptions,
    ] as const
  })

  const navigate = useNavigate({ from: Route.fullPath })

  const { data: { appointments, pagination } } = useSuspenseQuery(queryOptions())

  useEffect(() => {
    navigate({
      search: (prev) => ({ ...prev, pagination }),
    })
  }, [pagination])

  if (!appointments?.length) {
    return (
      <TableRow>
        <TableCell colSpan={100}>
          <Alert variant="warning">
            <AlertDescription className="text-center my-1">
              Nada foi agendado no momento
            </AlertDescription>
          </Alert>
        </TableCell>
      </TableRow>
    )
  }

  return appointments.map(({ barberShopId, client, services, ...appointment }) => (
    <TableRow key={appointment.id} data-barber-shop-id={barberShopId}>
      <TableCell className="text-center">{getFormattedDate(appointment.date)}</TableCell>
      <TableCell className="text-center">{client.fullName}</TableCell>
      <TableCell className="text-center">{appointment.notes ?? '---'}</TableCell>
      <TableCell className="text-center">
        {getEnumAsString(PaymentTypeEnum, appointment.paymentType)}
      </TableCell>
      <TableCell className="text-center">
        <Link
          className={cn(buttonVariants({ size: 'sm' }))}
          title="Ver detalhes"
          to="/barber-schedule/dashboard/$appointmentId"
          params={{
            appointmentId: appointment.id,
          }}
        >
          {getFormattedHour(appointment.startTime as Parameters<typeof getFormattedHour>[0], true)}
        </Link>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center">
          {appointment?.status
            ? <DoorClosed className="text-red-600" />
            : <DoorOpen className="text-green-600" />
          }
        </div>
      </TableCell>
    </TableRow>
  ))
}

function BarberShopDashboardTbody() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BarberShopDashboardTbodyItems />
    </Suspense>
  )
}

function PaginationBarberShopAppointments() {
  const { pagination } = Route.useSearch()

  if (!pagination) {
    return null
  }

  // TODO: Create Custom Link for Pagination Components

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            from={Route.fullPath}
            search={(prev) => ({ ...prev, page: 'prev' in pagination ? pagination.prev : pagination.page })}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        {'prev' in pagination && (
          <PaginationItem>
            <PaginationLink
              from={Route.fullPath}
              search={(prev) => ({ ...prev, page: pagination.prev })}
            >
              {pagination.prev}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink
            from={Route.fullPath}
            search={(prev) => ({ ...prev, page: pagination.page })}
            isActive
          >
            {pagination.page}
          </PaginationLink>
        </PaginationItem>

        {'next' in pagination && (
          <PaginationItem>
            <PaginationLink
              from={Route.fullPath}
              search={(prev) => ({ ...prev, page: pagination.next })}
            >
              {pagination.next}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            from={Route.fullPath}
            search={(prev) => ({ ...prev, page: 'next' in pagination ? pagination.next : pagination.page })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function RouteComponent() {
  const [barberShop] = Route.useLoaderData({
    select: (s) => [
      s.barberShop!,
    ] as const
  })

  return (
    <>
      <div className="before-card">
        <Card className="mx-auto max-w-sm min-w-[80vw] md:min-w-[750px] lg:min-w-[800px]">
          <CardHeader className="py-4 px-2 md:px-3 lg:px-4">
            <CardTitle className="text-2xl">Meus agendamentos - {barberShop.name}</CardTitle>
            <CardDescription>
              Veja aqui os agendamentos que os clientes marcaram com você.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-4 px-2 md:px-3 lg:px-4">
            <Table>
              <TableCaption>Sua lista de agendamentos.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Dia</TableHead>
                  <TableHead className="text-center">Cliente</TableHead>
                  <TableHead className="text-center">Comentário</TableHead>
                  <TableHead className="text-center">Forma de pagamento</TableHead>
                  <TableHead className="text-center">Início</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <BarberShopDashboardTbody />
              </TableBody>
            </Table>

            <PaginationBarberShopAppointments />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
