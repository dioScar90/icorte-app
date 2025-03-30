import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { SubmitButton } from '@/components/ui/submit-button'
import { appointmentSchema, type AppointmentZod, PaymentTypeEnum } from '@/schemas/appointment'
import { getFormattedDate } from '@/schemas/sharedValidators/dateString'
import { getFormattedHour } from '@/schemas/sharedValidators/timeString'
import { type Appointment, AppointmentStatusEnum } from '@/types/models/appointment'
import { getNumberAsCurrency } from '@/utils/currency'
import { getEnumAsArray, getEnumAsString } from '@/utils/enum-transformer'
import { type TimeString } from '@/utils/types/time-string'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useLocation } from '@tanstack/react-router'
import { Link, useNavigate } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ShoppingBag } from 'lucide-react'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  appointmentId: z.number()
}) satisfies z.ZodType<{ appointmentId: Appointment['id'] }>

export const Route = createFileRoute(
  '/(authenticated-only)/barber-schedule/dashboard/$appointmentId',
)({
  component: RouteComponent,
  params: schema,
})

type FormProps = {
  currentPaymentType: AppointmentZod['paymentType']
  formId: string
  setLoadingState: (arg: boolean) => void
  refetch: UseQueryResult['refetch']
  closeModal: () => void
}

function FormUpdatePaymentType({ currentPaymentType, formId, setLoadingState, refetch, closeModal }: FormProps) {
  const [handleError, updatePaymentType] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.barberSchedule.updatePaymentType,
    ] as const
  })

  const appointmentId = Route.useParams({ select: (s) => s.appointmentId })

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const paymentTypeSchema = z.object({
    paymentType: appointmentSchema.shape.paymentType
      .refine(
        paymentType => paymentType !== currentPaymentType,
        { message: `Escolha um tipo de pagamento diferente` }
      )
  })

  type PaymentTypeZod = z.infer<typeof paymentTypeSchema>

  const form = useForm<PaymentTypeZod>({
    resolver: zodResolver(paymentTypeSchema),
    defaultValues: {
      paymentType: currentPaymentType,
    }
  })

  async function onSubmit({ paymentType }: PaymentTypeZod) {
    try {
      const result = await updatePaymentType(appointmentId, paymentType)

      if (!result.isSuccess) {
        throw result.error
      }

      navigate({
        to: pathname,
        state: {
          alert: {
            message: 'Forma de pagamento atualizada com sucesso',
          },
        },
      })

      refetch()
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
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de pagamento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={getEnumAsString(PaymentTypeEnum, field.value)}>
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

          <FormRootErrorMessage />
        </div>
      </form>
    </Form>
  )
}

function AppointmentDetails() {
  const [getAppointment, userId] = Route.useRouteContext({
    select: (s) => [
      s.barberSchedule.getAppointment,
      s.auth.user?.id,
    ] as const
  })

  const appointmentId = Route.useParams({ select: (s) => s.appointmentId })

  const [isLoadingPaymentForm, setIsLoadingPaymentForm] = useState(false)
  const [open, setOpen] = useState(false)

  function handleDialogOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setOpen(false)
    }
  }

  const closeModal = useCallback(() => setOpen(false), [])

  const { data: appointmentRes, isLoading, error, refetch } = useQuery({
    queryKey: ['appointmentDetails', appointmentId],
    queryFn: () => getAppointment(appointmentId!, true),
    enabled: !!appointmentId,
  })

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />
  }

  if (error || !appointmentRes?.isSuccess) {
    const errorMessage = error?.message || appointmentRes?.error?.message || 'Erro ao carregar os detalhes do agendamento.'

    return (
      <p className="text-red-500">
        {errorMessage}
      </p>
    )
  }

  const appointment = appointmentRes.value

  const isFinalized = appointment.status === AppointmentStatusEnum.Finalizado
  const canModifyPayment = !isFinalized && userId === appointment.clientId

  const formId = 'modificar-pagamento-form'

  return (
    <>
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Detalhes do Agendamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Data:</p>
              <p className="font-medium">{getFormattedDate(appointment.date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hora de Início:</p>
              <p className="font-medium">{getFormattedHour(appointment.startTime as TimeString)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Serviços:</p>
              <div className="space-y-2">
                {appointment.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between">
                    <p>{service.name}</p>
                    <p className="text-sm text-gray-600">{service.duration}</p>
                    <p className="text-sm text-gray-600">{getNumberAsCurrency(service.price)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duração Total:</p>
              <p className="font-medium">{appointment.totalDuration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Preço Total:</p>
              <p className="font-medium">{getNumberAsCurrency(appointment.totalPrice)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pagamento:</p>

              <div className="flex items-center gap-x-2">
                <p className={`font-medium`}>
                  {getEnumAsString(PaymentTypeEnum, appointment.paymentType)}
                </p>

                {canModifyPayment && (
                  <Button size="sm" onClick={() => setOpen(true)}>
                    Modificar
                  </Button>
                )}
              </div>
            </div>
            {appointment.notes && (
              <div>
                <p className="text-sm text-gray-600">Notas:</p>
                <p className="font-medium">{appointment.notes}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Status:</p>
              <Badge
                variant={isFinalized ? 'success' : 'outline'}
              >
                {getEnumAsString(AppointmentStatusEnum, appointment.status)}
              </Badge>
            </div>

            <Link
              className={buttonVariants({ variant: "secondary" })}
              to="/barber-schedule/dashboard"
            >
              <ChevronLeft />
              Voltar
            </Link>
          </div>
        </CardContent>
      </Card>

      {canModifyPayment && (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modificar forma de pagamento</DialogTitle>
              <DialogDescription>
                Escolha um pagamento diferente caso queira modificar
              </DialogDescription>
            </DialogHeader>

            {open && (
              <FormUpdatePaymentType
                currentPaymentType={appointment.paymentType}
                formId={formId}
                setLoadingState={setIsLoadingPaymentForm}
                refetch={refetch}
                closeModal={closeModal}
              />
            )}

            <DialogFooter className="grid grid-cols-2 md:flex md:justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>

              {open && (
                <SubmitButton
                  type="submit"
                  form={formId}
                  disabled={isLoadingPaymentForm}
                  IconLeft={<ShoppingBag />}
                >
                  Modificar
                </SubmitButton>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

function RouteComponent() {
  return (
    <Suspense fallback={<p>Carregando detalhes do agendamento...</p>}>
      <AppointmentDetails />
    </Suspense>
  )
}
