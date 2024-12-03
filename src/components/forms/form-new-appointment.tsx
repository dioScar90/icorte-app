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

type ActionType<KItem extends keyof ReturnType<typeof useBarberScheduleLayout>> =
  ReturnType<typeof useBarberScheduleLayout>[KItem]
  
export type NewAppointmentProps = {
  formId: string
  closeModal: () => void
  setLoadingState: (arg: boolean) => void
  barberShopId: number
  register: ActionType<'createAppointment'>
  getAvailableDates: ActionType<'getAvailableDates'>
  getAbailableSlots: ActionType<'getAbailableSlots'>
  getAllServices: ActionType<'getAllServices'>
}

export function FormNewAppointment({
  formId, register, getAvailableDates, getAbailableSlots, getAllServices, closeModal, setLoadingState, barberShopId }: NewAppointmentProps
) {
  const navigate = useNavigate()
  const { handleError } = useHandleErrors()
  
  console.log('unusual props', {
    getAvailableDates, getAbailableSlots, getAllServices, barberShopId
  })
  
  const form = useForm<AppointmentZod>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: '2024-01-01',
      startTime: '12:30:00',
      paymentType: PaymentTypeEnum.Pix,
      notes: undefined,
      serviceIds: [],
    }
  })
  
  async function onSubmit({ serviceIds, ...values }: AppointmentZod) {
    // const data = { ...values, serviceIds: services.map(({ id }) => id) }
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
  
  useEffect(() => {
    setLoadingState(form.formState.isSubmitting)
  }, [form.formState])
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id={formId} className="space-y-6">
        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de abertura</FormLabel>
                <FormControl>
                  <Input type="text" inputMode="numeric" placeholder="Data" {...field} />
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
                <FormLabel>Hora de abertura</FormLabel>
                <FormControl>
                  <Input type="text" inputMode="numeric" placeholder="Hora de início" {...field} />
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
                <FormLabel>Gênero</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Gênero" />
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
