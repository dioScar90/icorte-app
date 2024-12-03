import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { useNavigate } from "react-router-dom"
import { useHandleErrors } from "@/providers/handleErrorProvider"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { getEnumAsArray } from "@/utils/enum-as-array"
import { ROUTE_ENUM } from "@/types/route"
import { useBarberScheduleLayout } from "../layouts/barber-schedule-layout"
import { appointmentSchema, AppointmentZod, PaymentTypeEnum } from "@/schemas/appointment"
import { CheckboxFieldsServices } from "./checkbox-fields-services"
import { InputFieldsDatesAndTimeSpans } from "./dates-and-time-spans-fields-services"

type ActionType<KItem extends keyof ReturnType<typeof useBarberScheduleLayout>> =
  ReturnType<typeof useBarberScheduleLayout>[KItem]
  
export type NewAppointmentProps = {
  formId: string
  closeModal: () => void
  setLoadingState: (arg: boolean) => void
  barberShopId: number
  defaultServiceId: number
  register: ActionType<'createAppointment'>
  getAbailableSlots: ActionType<'getAbailableSlots'>
  getAllServices: ActionType<'getAllServices'>
}

export function FormNewAppointment({
  formId, register, getAbailableSlots, getAllServices, closeModal, setLoadingState, barberShopId, defaultServiceId }: NewAppointmentProps
) {
  const navigate = useNavigate()
  const { handleError } = useHandleErrors()
  
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
      const result = await register(data)
      
      if (!result.isSuccess) {
        throw result.error
      }
      
      const url = `${ROUTE_ENUM.BARBER_SCHEDULE}/dashboard/${result.value.item.id}`
      const message = result.value?.message ?? 'Horário marcado com sucesso'
      navigate(url, { replace: true, state: { message } })
    } catch (err) {
      handleError(err, form)
    } finally {
      closeModal()
    }
  }

  const serviceIds = form.watch('serviceIds')
  
  useEffect(() => {
    setLoadingState(form.formState.isSubmitting)
  }, [form.formState])
  
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
                <FormLabel>Hora de abertura</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Comentário (opcional)" {...field} />
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
