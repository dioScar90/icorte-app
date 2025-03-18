import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { getEnumAsArray } from "@/utils/enum-as-array"
import { appointmentSchema, AppointmentZod, PaymentTypeEnum } from "@/schemas/appointment"
import { InputFieldsDatesAndTimeSpans } from "./_formDateTImeFields"
import { CheckboxFieldsServices } from "./_formCheckboxFieldsServices"
import { useNavigate, useRouteContext } from "@tanstack/react-router"
import { useDialogContext } from "./_dialog"

export function FormNewAppointment() {
  const { formId, barberShopId, defaultServiceId, setIsLoading } = useDialogContext()

  const [handleError, createAppointment, getAbailableSlots, getAllServices] = useRouteContext({
    from: '/(authenticated-only)/barber-schedule/new-appointment',
    select: (s) => [
      s.handleError,
      s.barberSchedule.createAppointment,
      s.barberSchedule.getAbailableSlots,
      s.barberSchedule.getAllServices,
    ] as const
  })
  
  const navigate = useNavigate({
    from: '/barber-schedule/new-appointment/'
  })

  const [serviceIds, setServiceIds] = useState([defaultServiceId])
  
  const form = useForm<AppointmentZod>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: undefined,
      startTime: undefined,
      paymentType: undefined,
      notes: undefined,
      serviceIds: [defaultServiceId],
    }
  })
  
  async function onSubmit({ serviceIds, ...values }: AppointmentZod) {
    const data = { ...values, serviceIds: [...serviceIds] }
    
    try {
      const result = await createAppointment(data)
      
      if (!result.isSuccess) {
        throw result.error
      }
      
      navigate({
        to: '/barber-schedule/dashboard/$appointmentId',
        params: {
          appointmentId: result.value.item.id,
        },
        replace: true,
        state: {
          message: result.value?.message ?? 'Horário marcado com sucesso',
        },
      })
    } catch (err) {
      handleError(err, form)
    } finally {
      navigate({
        search: (prev) => ({ ...prev, newAppointment: undefined }),
      })
    }
  }
  
  useEffect(() => {
    setIsLoading(form.formState.isSubmitting)
  }, [form.formState])
  
  useEffect(() => {
    const { unsubscribe } = form.watch(({ serviceIds }, { name }) => {
      if (name === 'serviceIds') {
        const values = serviceIds ? [...(serviceIds as number[])] : []
        setServiceIds(values)
      }
    })

    return () => unsubscribe()
  }, [form.watch])
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id={formId} className="space-y-6">
        <div className="grid gap-1">
          <InputFieldsDatesAndTimeSpans
            barberShopId={barberShopId}
            serviceIds={serviceIds}
            control={form.control}
            getAbailableSlots={getAbailableSlots}
          />
          
          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de pagamento</FormLabel>
                <Select onValueChange={field.onChange}>
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
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem</FormLabel>
                <FormControl>
                  <Input placeholder="Mensagem (opcional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="serviceIds"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Serviços</FormLabel>
                  <FormDescription>
                    Selecione os serviços desejados.
                  </FormDescription>
                </div>
                  
                <CheckboxFieldsServices
                  barberShopId={barberShopId}
                  control={form.control}
                  getAllServices={getAllServices}
                />
                  
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
