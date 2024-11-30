import { useBarberScheduleLayout } from "@/components/layouts/barber-schedule-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/providers/authProvider"
import { getFormattedDate } from "@/schemas/sharedValidators/dateOnly"
import { TimeOnly } from "@/utils/types/date"
import { DoorClosed, DoorOpen, Edit, ShoppingBag, Trash2 } from "lucide-react"
import { useCallback } from "react"

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
                {Array.isArray(appointments?.items) && appointments.items.length > 0
                  ? appointments.items.map(({ barberShopId, ...schedule }) => (
                    <TableRow key={schedule.date} data-barber-shop-id={barberShopId}>
                      <TableCell className="text-center">{getFormattedDate(schedule.date)}</TableCell>
                      <TableCell className="text-center">{schedule.notes ?? '---'}</TableCell>
                      <TableCell className="text-center">{schedule.paymentType}</TableCell>
                      <TableCell className="text-center">{formatTimeOnly(schedule.startTime as TimeOnly)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {schedule?.status
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
                            // onClick={() => dispatch({ type: 'SPECIAL_UPDATE_FORM', payload: { action: special.update, barberShopId, date: schedule.date, schedule } })}
                          >
                            <Edit />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            title="Remover"
                            // onClick={() => dispatch({ type: 'SPECIAL_REMOVE_FORM', payload: { action: special.remove, barberShopId, date: schedule.date, schedule } })}
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
              <Button
                type="button" className="absolute-middle-y right-0"
                // onClick={() => dispatch({ type: 'SPECIAL_REGISTER_FORM', payload: { action: special.register, barberShopId: barberShop.id } })}
              >
                <ShoppingBag />
                Novo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
