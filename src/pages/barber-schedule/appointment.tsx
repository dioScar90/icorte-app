import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PaymentTypeEnum } from '@/schemas/appointment';
import { AppointmentStatusEnum } from '@/types/models/appointment';
import { useLoaderData } from 'react-router-dom';
import { useBarberScheduleLayout } from '@/components/layouts/barber-schedule-layout';
import { getNumberAsCurrency } from '@/utils/currency';
import { getEnumAsString } from '@/utils/enum-as-array';
import { getFormattedDate } from '@/schemas/sharedValidators/dateOnly';
import { getFormattedHour } from '@/schemas/sharedValidators/timeOnly';
import { TimeOnly } from '@/utils/types/date';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/authProvider';

type DetailsType = {
  appointmentId: number | undefined
  getAppointment: ReturnType<typeof useBarberScheduleLayout>['getAppointment']
}

export function AppointmentDetails({ appointmentId, getAppointment }: DetailsType) {
  const { user } = useAuth()
  const { data: appointment, isLoading, error } = useQuery({
    queryKey: ['appointmentDetails', appointmentId],
    queryFn: () => getAppointment(appointmentId!, true),
    enabled: !!appointmentId
  })

  if (isLoading) return <Skeleton className="h-40 w-full" />
  if (error || !appointment?.isSuccess) return <p className="text-red-500">Erro ao carregar os detalhes do agendamento.</p>

  const isFinalized = appointment.value.status === AppointmentStatusEnum.Finalizado
  const canModifyPayment = !isFinalized && user?.id === appointment.value.clientId
  
  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Detalhes do Agendamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Data:</p>
            <p className="font-medium">{getFormattedDate(appointment.value.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hora de Início:</p>
            <p className="font-medium">{getFormattedHour(appointment.value.startTime as TimeOnly)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Serviços:</p>
            <div className="space-y-2">
              {appointment.value.services.map((service) => (
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
            <p className="font-medium">{appointment.value.totalDuration}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Preço Total:</p>
            <p className="font-medium">{getNumberAsCurrency(appointment.value.totalPrice)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pagamento:</p>

            <div className="flex items-center gap-x-2">

            <p
              className={`font-medium`}
            >
              {getEnumAsString(PaymentTypeEnum, appointment.value.paymentType)}
            </p>
            
            {!canModifyPayment && (
              <Button size="sm">
                Modificar
              </Button>
            )}

            </div>
          </div>
          {appointment.value.notes && (
            <div>
              <p className="text-sm text-gray-600">Notas:</p>
              <p className="font-medium">{appointment.value.notes}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Status:</p>
            <Badge
              variant={isFinalized ? 'success' : 'outline'}
            >
              {getEnumAsString(AppointmentStatusEnum, appointment.value.status)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AppointmentPage() {
  const appointmentId = useLoaderData() as number | undefined
  const { getAppointment } = useBarberScheduleLayout()
  
  return (
    <Suspense fallback={<p>Carregando detalhes do agendamento...</p>}>
      <AppointmentDetails appointmentId={appointmentId} getAppointment={getAppointment} />
    </Suspense>
  )
}
