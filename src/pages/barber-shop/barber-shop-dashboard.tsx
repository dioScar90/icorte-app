import { useBarberShopLayout } from "@/components/layouts/barber-shop-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationResponse } from "@/data/result";
import { cn } from "@/lib/utils";
import { PaymentTypeEnum } from "@/schemas/appointment";
import { getFormattedDate } from "@/schemas/sharedValidators/dateOnly";
import { getFormattedHour } from "@/schemas/sharedValidators/timeOnly";
import { ROUTE_ENUM } from "@/types/route";
import { getEnumAsString } from "@/utils/enum-as-array";
import { TimeOnly } from "@/utils/types/date";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DoorClosed, DoorOpen } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

type PaginationWithoutItems = Omit<PaginationResponse<null>, 'items'>

type TableProps = {
  barberShopId: number
  page: string | null
  getAppointments: ReturnType<typeof useBarberShopLayout>['getAppointments']
  setPagination: (arg: PaginationWithoutItems) => void
}

function BarberShopDashboardTbodyItems({
  barberShopId,
  page,
  getAppointments,
  setPagination,
}: TableProps) {
  const { data: appointments } = useSuspenseQuery({
    queryKey: ['appointmentsByBarbershop', barberShopId, page],
    queryFn: () => getAppointments(barberShopId, { page: +page! || 1, pageSize: 5 }),
  })
  
  const { value: { items, ...pagination } } = appointments

  useEffect(() => {
    setPagination(pagination)
  }, [barberShopId, page])
  
  return (
    items && items.length > 0
      ? items.map(({ barberShopId, client, services, ...appointment }) => (
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
              to={`${ROUTE_ENUM.BARBER_SCHEDULE}/dashboard/${appointment.id}`}
            >
              {getFormattedHour(appointment.startTime as TimeOnly, true)}
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
      )) : (
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
  )
}

function BarberShopDashboardTbodyFallback() {
  return (
    <div>
      Carregando...
    </div>
  )
}

function BarberShopDashboardTbody(props: TableProps) {
  return (
    <Suspense fallback={<BarberShopDashboardTbodyFallback />}>
      <BarberShopDashboardTbodyItems { ...props } />
    </Suspense>
  )
}

function PaginationBarberShopAppointments({ page, totalPages }: PaginationWithoutItems) {
  function getClampPage(to: number) {
    return Math.min(Math.max(to, 1), totalPages)
  }

  function getPageParam(to: number) {
    to = getClampPage(to)
    return `?page=${to}`
  }
  
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to={getPageParam(page - 1)}
          />
        </PaginationItem>
        
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        
        {page > 1 && (
          <PaginationItem>
            <PaginationLink to={getPageParam(page - 1)}>
              {getClampPage(page - 1)}
            </PaginationLink>
          </PaginationItem>
        )}
        
        <PaginationItem>
          <PaginationLink to={getPageParam(page)} isActive>
            {page}
          </PaginationLink>
        </PaginationItem>
        
        {page < totalPages && (
          <PaginationItem>
            <PaginationLink to={getPageParam(page + 1)}>
              {getClampPage(page + 1)}
            </PaginationLink>
          </PaginationItem>
        )}
        
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            to={getPageParam(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function BarberShopDashboard() {
  const { barberShop, getAppointments } = useBarberShopLayout()
  const [pagination, setPagination] = useState<PaginationWithoutItems | null>(null)
  const [searchParams] = useSearchParams()
  const page = searchParams.get('page')
  
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
                <BarberShopDashboardTbody
                  barberShopId={barberShop.id}
                  page={page}
                  getAppointments={getAppointments}
                  setPagination={setPagination}
                />
              </TableBody>
            </Table>
            
            {pagination && (
              <PaginationBarberShopAppointments { ...pagination } />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
