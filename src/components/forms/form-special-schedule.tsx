import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChangeEvent, useEffect, useRef } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { useLocation, useNavigate } from "react-router-dom"
import { useHandleErrors } from "@/providers/handleErrorProvider"
import { SpecialScheduleZod, specialScheduleSchema } from "@/schemas/specialSchedule"
import { useSchedulesLayout } from "../layouts/barber-shop-schedules-layout"
import { DateOnly, TimeOnly } from "@/utils/types/date"
import { Switch } from "../ui/switch"
import { getFormattedDate } from "@/schemas/sharedValidators/dateOnly"
import { applyMask } from "@/utils/mask"
import { navigateToEndAfterFocus } from "@/utils/cursor-end-of-input"

type ActionType<KItem extends keyof ReturnType<typeof useSchedulesLayout>['special']> =
  ReturnType<typeof useSchedulesLayout>['special'][KItem]

export type SpecialScheduleRegisterProps = {
  formId: 'special-register-form'
  action: ActionType<'register'>
  date?: undefined
  schedule?: undefined
}

export type SpecialScheduleUpdateProps = {
  formId: 'special-update-form'
  action: ActionType<'update'>
  date: DateOnly
  schedule: SpecialScheduleZod
}

export type SpecialScheduleRemoveProps = {
  formId: 'special-remove-form'
  action: ActionType<'remove'>
  date: DateOnly
  schedule: SpecialScheduleZod
}

type Props = {
  closeModal: () => void
  setLoadingState: (arg: boolean) => void
  barberShopId: number
} & (SpecialScheduleRegisterProps | SpecialScheduleUpdateProps | SpecialScheduleRemoveProps)

export function FormSpecialSchedule({ formId, action, closeModal, setLoadingState, barberShopId, date, schedule }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { handleError } = useHandleErrors()
  const openTimeInputRef = useRef<HTMLInputElement>(null)
  const closeTimeInputRef = useRef<HTMLInputElement>(null)
  
  const form = useForm<SpecialScheduleZod>({
    resolver: formId !== 'special-remove-form' ? zodResolver(specialScheduleSchema) : undefined,
    defaultValues: {
      date: schedule?.date ? getFormattedDate(schedule.date) as DateOnly : undefined,
      notes: schedule?.notes ?? undefined,
      openTime: schedule?.openTime ?? undefined,
      closeTime: schedule?.closeTime ?? undefined,
      isClosed: schedule?.isClosed ?? false,
    }
  })
  
  async function onSubmit(data: SpecialScheduleZod) {
    try {
      let result: Awaited<ReturnType<typeof action>>
      let message: string
      
      switch (formId) {
        case 'special-register-form':
          result = await action(barberShopId, data)
          message = result.value?.message ?? 'Serviço criado com sucesso'
          break
        case 'special-update-form':
          result = await action(barberShopId, date, data)
          message = result.value?.message ?? 'Serviço atualizado com sucesso'
          break
        default:
          result = await action(barberShopId, date)
          message = result.value?.message ?? 'Serviço removido com sucesso'
      }
      
      if (!result.isSuccess) {
        throw result.error
      }
      
      navigate(pathname, { replace: true, state: { message }})
    } catch (err) {
      handleError(err, form)
    } finally {
      closeModal()
    }
  }
  
  function handleDateChange(e: ChangeEvent<HTMLInputElement>) {
    const maskedValue = applyMask('DATE_ISO', e.currentTarget.value) as DateOnly
    
    form.setValue('date', maskedValue) // Atualiza o valor do campo no React Hook Form
    e.currentTarget.value = maskedValue // Define o valor no input
    
    e.currentTarget.focus()
  }
  
  function handleTimeChange(e: ChangeEvent<HTMLInputElement>) {
    const maskedValue = applyMask('TIME_ONLY', e.currentTarget.value) as TimeOnly
    const name = e.currentTarget.name as 'openTime' | 'closeTime'
    
    form.setValue(name, maskedValue) // Atualiza o valor do campo no React Hook Form
    e.currentTarget.value = maskedValue // Define o valor no input
    
    e.currentTarget.focus()
  }
  
  function handleIsCloseChange(isChecked: boolean) {
    if (isChecked) {
      const names = ['openTime', 'closeTime'] as const
      names.forEach(name => form.setValue(name, undefined))
      
      openTimeInputRef.current!.value = ''
      closeTimeInputRef.current!.value = ''

      form.clearErrors([...names])
    }
  }

  const isClosed = form.watch('isClosed')
  
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
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text" inputMode="numeric" placeholder="06/12/2024"
                    onChange={handleDateChange} onFocus={navigateToEndAfterFocus}
                    disabled={formId === 'special-remove-form'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Descrição (opcional)" {...field} disabled={formId === 'special-remove-form'} />
                </FormControl>
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
                    {...field} ref={openTimeInputRef}
                    type="text" inputMode="numeric" placeholder="08:00:00 (opcional)"
                    onChange={handleTimeChange} onFocus={navigateToEndAfterFocus}
                    disabled={formId === 'special-remove-form' || isClosed}
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
                    {...field} ref={closeTimeInputRef}
                    type="text" inputMode="numeric" placeholder="18:00:00 (opcional)"
                    onChange={handleTimeChange} onFocus={navigateToEndAfterFocus}
                    disabled={formId === 'special-remove-form' || isClosed}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isClosed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between gap-x-5 rounded-lg w-fit border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Barbearia Fechada
                  </FormLabel>
                  <FormDescription>
                    Caso queira fechar nesse dia
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={value => {
                      handleIsCloseChange(value)
                      field.onChange(value)
                    }}
                    disabled={formId === 'special-remove-form'}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormRootErrorMessage />
        </div>
      </form>
    </Form>
  )
}
