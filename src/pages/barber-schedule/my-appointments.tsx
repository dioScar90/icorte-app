import { useBarberScheduleLayout } from "@/components/layouts/barber-schedule-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/authProvider"
import { useHandleErrors } from "@/providers/handleErrorProvider"
import { AppointmentZod, PaymentTypeEnum } from "@/schemas/appointment"
import { getFormattedDate } from "@/schemas/sharedValidators/dateOnly"
import { getFormattedHour } from "@/schemas/sharedValidators/timeOnly"
import { Appointment } from "@/types/models/appointment"
import { ROUTE_ENUM } from "@/types/route"
import { getNumberAsCurrency } from "@/utils/currency"
import { getEnumAsArray, getEnumAsString } from "@/utils/enum-as-array"
import { TimeOnly } from "@/utils/types/date"
import { DoorClosed, DoorOpen, ShoppingBag, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"

type RemoveProps = {
  appointment: Appointment
  closeModal: () => void
  setLoadingState: (arg: boolean) => void
  formId: string
  deleteAppointment: ReturnType<typeof useBarberScheduleLayout>['deleteAppointment']
}

function FormRemoveAppointment({ appointment, closeModal, setLoadingState, formId, deleteAppointment }: RemoveProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { handleError } = useHandleErrors()
  
  const form = useForm<AppointmentZod>({
    resolver: undefined,
    defaultValues: {
      date: appointment?.date ?? undefined,
      startTime: appointment?.startTime ?? undefined,
      paymentType: appointment?.paymentType ?? undefined,
      serviceIds: appointment?.serviceIds ?? [],
      notes: appointment?.notes ?? undefined,
    }
  })
  
  console.log({
    form,
    appointment,
  })
  
  async function onSubmit() {
    try {
      const result = await deleteAppointment(appointment.id)
      
      if (!result.isSuccess) {
        throw result.error
      }
      
      const message = 'Agendamento removido com sucesso'
      navigate(pathname, { replace: true, state: { message } })
    } catch (err) {
      handleError(err, form)
    } finally {
      closeModal()
    }
  }
  
  useEffect(() => {
    setLoadingState(form.formState.isSubmitting)
  }, [form.formState])
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id={formId} className="space-y-6">
        <div className="grid gap-1">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input placeholder="Data" {...field} value={getFormattedDate(field.value)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
                <FormControl>
                  <Input placeholder="Hora" {...field} value={getFormattedHour(field.value as TimeOnly)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de pagamento</FormLabel>
                <Select onValueChange={field.onChange} value={getEnumAsString(PaymentTypeEnum, field.value)} disabled>
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Escolha" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {getEnumAsArray(PaymentTypeEnum).map(paymentType => (
                        <SelectItem key={paymentType} value={paymentType}>{paymentType}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          
          {appointment.notes && (
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentário</FormLabel>
                  <FormControl>
                    <Input placeholder="Comentário" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormItem>
            <FormLabel>Total</FormLabel>
            <FormControl>
              <Input placeholder="total" value={getNumberAsCurrency(appointment.totalPrice)} disabled />
            </FormControl>
          </FormItem>
          
          <FormRootErrorMessage />
        </div>
      </form>
    </Form>
  )
}

type StateModalType = {
  open: false
} | {
  open: true,
  props: RemoveProps
}

export function MyAppointmentsPage() {
  const { user } = useAuth()
  const { appointments, deleteAppointment } = useBarberScheduleLayout()
  const [isLoadingState, setLoadingState] = useState(false)
  const [state, setState] = useState<StateModalType>({ open: false })
  
  const formId = 'remove-form'
  
  const closeModal = useCallback(() => setState({ open: false }), [])
  
  const openModal = useCallback((appointment: RemoveProps['appointment']) => {
    setState({
      open: true,
      props: {
        appointment,
        formId,
        setLoadingState,
        deleteAppointment,
        closeModal,
      }
    })
  }, [])
  
  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      closeModal()
    }
  }
  
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
                  ? appointments.map(appointment => (
                    <TableRow key={appointment.date} data-barber-shop-id={appointment.barberShopId}>
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
                      <TableCell className="text-center w-[100px]">
                        <div className="flex justify-between gap-x-2">
                          <Button
                            size="icon"
                            variant="destructive"
                            title="Remover"
                            onClick={() => openModal(appointment)}
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
                            Nenhum agendamento para exibir
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
      
      <Dialog open={state.open} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excuir agendamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o agendamento abaixo?
            </DialogDescription>
          </DialogHeader>
          
          {state.open && (
            <FormRemoveAppointment {...state.props} />
          )}
          
          <DialogFooter className="grid grid-cols-2 md:flex md:justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>

            {state.open && (
              <Button
                type="submit"
                variant="destructive"
                form={formId}
                isLoading={isLoadingState}
                IconLeft={<Trash2 />}
              >
                Excuir
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
