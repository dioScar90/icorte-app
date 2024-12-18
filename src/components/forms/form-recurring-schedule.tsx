import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChangeEvent, useEffect } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { useSchedulesLayout } from "../layouts/barber-shop-schedules-layout"
import { useLocation, useNavigate } from "react-router-dom"
import { useHandleErrors } from "@/providers/handleErrorProvider"
import { DayOfWeekEnum, recurringScheduleSchema, RecurringScheduleZod } from "@/schemas/recurringSchedule"
import { DayOfWeek, TimeOnly } from "@/utils/types/date"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { getEnumAsArray, getEnumAsString } from "@/utils/enum-as-array"
import { applyMask } from "@/utils/mask"
import { navigateToEndAfterFocus } from "@/utils/cursor-end-of-input"

type ActionType<KItem extends keyof ReturnType<typeof useSchedulesLayout>['recurring']> =
  ReturnType<typeof useSchedulesLayout>['recurring'][KItem]

export type RecurringScheduleRegisterProps = {
  formId: 'recurring-register-form'
  action: ActionType<'register'>
  dayOfWeek?: undefined
  schedule?: undefined
}

export type RecurringScheduleUpdateProps = {
  formId: 'recurring-update-form'
  action: ActionType<'update'>
  dayOfWeek: DayOfWeek
  schedule: RecurringScheduleZod
}

export type RecurringScheduleRemoveProps = {
  formId: 'recurring-remove-form'
  action: ActionType<'remove'>
  dayOfWeek: DayOfWeek
  schedule: RecurringScheduleZod
}

type Props = {
  closeModal: () => void
  setLoadingState: (arg: boolean) => void
  barberShopId: number
} & (RecurringScheduleRegisterProps | RecurringScheduleUpdateProps | RecurringScheduleRemoveProps)

export function FormRecurringSchedule({ formId, action, closeModal, setLoadingState, barberShopId, dayOfWeek, schedule }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { handleError } = useHandleErrors()
  
  const form = useForm<RecurringScheduleZod>({
    resolver: formId !== 'recurring-remove-form' ? zodResolver(recurringScheduleSchema) : undefined,
    defaultValues: {
      dayOfWeek: schedule?.dayOfWeek ?? DayOfWeekEnum.SEGUNDA,
      openTime: schedule?.openTime ?? undefined,
      closeTime: schedule?.closeTime ?? undefined,
    }
  })

  async function onSubmit(data: RecurringScheduleZod) {
    try {
      let result: Awaited<ReturnType<typeof action>>
      let message: string
      
      switch (formId) {
        case 'recurring-register-form':
          result = await action(barberShopId, data)
          message = result.value?.message ?? 'Serviço criado com sucesso'
          break
        case 'recurring-update-form':
          result = await action(barberShopId, dayOfWeek, data)
          message = result.value?.message ?? 'Serviço atualizado com sucesso'
          break
        default:
          result = await action(barberShopId, dayOfWeek)
          message = result.value?.message ?? 'Serviço removido com sucesso'
      }
      
      if (!result.isSuccess) {
        throw result.error
      }
      
      navigate(pathname, { replace: true, state: { message } })
    } catch (err) {
      handleError(err, form)
    } finally {
      closeModal()
    }
  }
  
  function handleTimeChange(e: ChangeEvent<HTMLInputElement>) {
    const maskedValue = applyMask('TIME_ONLY', e.currentTarget.value) as TimeOnly
    const name = e.currentTarget.name as 'openTime' | 'closeTime'
    
    form.setValue(name, maskedValue) // Atualiza o valor do campo no React Hook Form
    e.currentTarget.value = maskedValue // Define o valor no input
    
    e.currentTarget.focus()
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
            name="dayOfWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gênero</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={getEnumAsString(DayOfWeekEnum, field.value)}
                  disabled={formId === 'recurring-remove-form'}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {getEnumAsArray(DayOfWeekEnum).map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
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
            name="openTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de abertura</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="numeric" placeholder="08:00:00"
                    onChange={handleTimeChange} onFocus={navigateToEndAfterFocus}
                    disabled={formId === 'recurring-remove-form'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="closeTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de fechamento</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="numeric" placeholder="18:00:00"
                    onChange={handleTimeChange} onFocus={navigateToEndAfterFocus}
                    disabled={formId === 'recurring-remove-form'}
                  />
                </FormControl>
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
