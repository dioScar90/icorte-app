import { useBarberScheduleLayout } from "@/components/layouts/barber-schedule-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/authProvider"
import { PaymentTypeEnum } from "@/schemas/appointment"
import { getFormattedDate } from "@/schemas/sharedValidators/dateOnly"
import { ROUTE_ENUM } from "@/types/route"
import { getEnumAsString } from "@/utils/enum-as-array"
import { TimeOnly } from "@/utils/types/date"
import { DoorClosed, DoorOpen, Edit, ShoppingBag, Trash2 } from "lucide-react"
import { useCallback } from "react"
import { Link } from "react-router-dom"

export function MyAppointmentsPage() {
  const { user } = useAuth()
  const { appointments } = useBarberScheduleLayout()
  
  const formatTimeOnly = useCallback((time: TimeOnly) => {
    const [hh, mm] = time.split(':')
    return hh + 'h' + mm
  }, [])
  
  return (
    <>
      <div className="before-card">
        <Card className="mx-auto max-w-sm min-w-[80vw] md:min-w-[750px] lg:min-w-[800px]">
          <CardHeader className="py-4 px-2 md:px-3 lg:px-4">
            <CardTitle className="text-2xl">Meus agendamentos - {user?.profile?.fullName}</CardTitle>
            <CardDescription>
              Veja aqui os agendamentos marcados por você, realizados e a realizar.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-4 px-2 md:px-3 lg:px-4">
            <Table>
              <TableCaption>Sua lista de agendamentos.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Dia</TableHead>
                  <TableHead className="text-center">Comentário</TableHead>
                  <TableHead className="text-center">Forma de pagamento</TableHead>
                  <TableHead className="text-center">Início</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center w-[100px]">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(appointments) && appointments.length > 0
                  ? appointments.map(({ barberShopId, ...appointment }) => (
                    <TableRow key={appointment.date} data-barber-shop-id={barberShopId}>
                      <TableCell className="text-center">{getFormattedDate(appointment.date)}</TableCell>
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
                          {formatTimeOnly(appointment.startTime as TimeOnly)}
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
                      <TableCell className="text-center w-[100px]">
                        <div className="flex justify-between gap-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            title="Editar"
                          >
                            <Edit />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            title="Remover"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                  : (
                    <TableRow>
                      <TableCell colSpan={100}>
                        <Alert variant="warning">
                          <AlertDescription className="text-center my-1">
                            Nenhum horário especial cadastrado
                          </AlertDescription>
                        </Alert>
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
            
            <div className="w-full h-14 relative">
              <Link
                className={cn(buttonVariants({ size: 'lg' }), 'w-full md:w-auto', 'absolute-middle-y right-0')}
                to={`${ROUTE_ENUM.BARBER_SCHEDULE}/new-appointment`}
              >
                <ShoppingBag />
                Novo
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
