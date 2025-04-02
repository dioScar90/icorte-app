import { Input } from "@/components/ui/input"
import { ChangeEvent, useRef } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "@/components/ui/form"
import { applyMask } from "@/utils/mask"
import { navigateToEndAfterFocus } from "@/utils/cursor-end-of-input"
import { type DateString } from "@/utils/types/datetime/date-string"
import { type TimeString } from "@/utils/types/datetime/time-string"
import { useNavigate } from "@tanstack/react-router"
import { Switch } from "@/components/ui/switch"
import { useSpecialScheduleFormContext } from "./_useScheduleForm"
import { Route } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'

export function BarberShopSpecialScheduleForm() {
  const { action, formId, form, doStuff } = useSpecialScheduleFormContext()

  const [handleError] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
    ] as const
  })

  const navigate = useNavigate({ from: Route.fullPath })

  const openTimeInputRef = useRef<HTMLInputElement>(null)
  const closeTimeInputRef = useRef<HTMLInputElement>(null)
  
  function handleDateChange(e: ChangeEvent<HTMLInputElement>) {
    const maskedValue = applyMask('DATE_ISO', e.currentTarget.value) as DateString
    
    form.setValue('date', maskedValue) // Atualiza o valor do campo no React Hook Form
    e.currentTarget.value = maskedValue // Define o valor no input
    
    e.currentTarget.focus()
  }
  
  function handleTimeChange(e: ChangeEvent<HTMLInputElement>) {
    const maskedValue = applyMask('TIME_ONLY', e.currentTarget.value) as TimeString
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
  
  return (
    <Form {...form}>
      <form
        id={formId} className="space-y-6"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const { message } = await doStuff(values)
            
            navigate({
              search: ({ open, ...rest }) => ({ ...rest }),
              state: {
                alert: {
                  message,
                },
              },
            })
          } catch (err) {
            handleError(err, form)
          } finally {
            // TODO: closeModal()
          }
        })}
      >
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
                    disabled={action === 'REMOVE'}
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
                  <Input type="text" placeholder="Descrição (opcional)" {...field} disabled={action === 'REMOVE'} />
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
                    disabled={action === 'REMOVE' || isClosed}
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
                    disabled={action === 'REMOVE' || isClosed}
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
                    disabled={action === 'REMOVE'}
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
