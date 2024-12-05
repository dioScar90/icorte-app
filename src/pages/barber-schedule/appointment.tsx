import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { appointmentSchema, AppointmentZod, PaymentTypeEnum } from '@/schemas/appointment';
import { AppointmentStatusEnum } from '@/types/models/appointment';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { useBarberScheduleLayout } from '@/components/layouts/barber-schedule-layout';
import { getNumberAsCurrency } from '@/utils/currency';
import { getEnumAsArray, getEnumAsString } from '@/utils/enum-as-array';
import { getFormattedDate } from '@/schemas/sharedValidators/dateOnly';
import { getFormattedHour } from '@/schemas/sharedValidators/timeOnly';
import { TimeOnly } from '@/utils/types/date';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/authProvider';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHandleErrors } from '@/providers/handleErrorProvider';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingBag } from 'lucide-react';

type DetailsProps = {
  appointmentId: number | undefined
  getAppointment: ReturnType<typeof useBarberScheduleLayout>['getAppointment']
  updatePaymentType: ReturnType<typeof useBarberScheduleLayout>['updatePaymentType']
}

type FormProps = {
  appointmentId: number
  currentPaymentType: AppointmentZod['paymentType']
  formId: string
  setLoadingState: (arg: boolean) => void
  updatePaymentType: DetailsProps['updatePaymentType']
  refetch: UseQueryResult['refetch']
  closeModal: () => void
}

function FormUpdatePaymentType({ appointmentId, currentPaymentType, formId, setLoadingState, updatePaymentType, refetch, closeModal }: FormProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { handleError } = useHandleErrors()
  
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
      
      const message = 'Forma de pagamento atualizada com sucesso'
      navigate(pathname, { state: { message } })
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

export function AppointmentDetails({ appointmentId, getAppointment, updatePaymentType }: DetailsProps) {
  const { user } = useAuth()
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
    enabled: !!appointmentId
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
  const canModifyPayment = !isFinalized && user?.id === appointment.clientId
  
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
              <p className="font-medium">{getFormattedHour(appointment.startTime as TimeOnly)}</p>
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
                appointmentId={appointmentId!}
                currentPaymentType={appointment.paymentType}
                formId={formId}
                setLoadingState={setIsLoadingPaymentForm}
                updatePaymentType={updatePaymentType}
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
                <Button
                  type="submit"
                  form={formId}
                  isLoading={isLoadingPaymentForm}
                  IconLeft={<ShoppingBag />}
                >
                  Modificar
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

function Carregando() {
  return (
    <>
      <p>Carregando detalhes do agendamento...</p>
    </>
  )
}

export function AppointmentPage() {
  const appointmentId = useLoaderData() as number | undefined
  const { getAppointment, updatePaymentType } = useBarberScheduleLayout()
  
  return (
    <Suspense fallback={<Carregando />}>
      <AppointmentDetails
        appointmentId={appointmentId}
        getAppointment={getAppointment}
        updatePaymentType={updatePaymentType}
      />
    </Suspense>
  )
}
