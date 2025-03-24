import { Input } from "@/components/ui/input"
import { ChangeEvent } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { applyMask } from "@/utils/mask"
import { navigateToEndAfterFocus } from "@/utils/cursor-end-of-input"
import { TimeString } from "@/utils/types/time-string"
import { useNavigate } from "@tanstack/react-router"
import { useBarberShopScheduleFormContext } from "./_dialog"
import { Route } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { getEnumAsArray, getEnumAsString } from "@/utils/enum-as-array"
import { DayOfWeekEnum } from "@/schemas/recurringSchedule"

const SCHEDULE_TYPE = 'special' as const

function DayOfWeekSelect() {
  const { form, formId } = useBarberShopScheduleFormContext(SCHEDULE_TYPE)

  return (
    <FormField
      control={form.control}
      name="dayOfWeek"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Dia da Semana</FormLabel>
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
  )
}

function OpenTimeInput() {
  const { form, formId } = useBarberShopScheduleFormContext(SCHEDULE_TYPE)
  
  return (
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
  )
}

function CloseTimeInput() {
  const { form, formId } = useBarberShopScheduleFormContext(SCHEDULE_TYPE)
  
  return (
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
  )
}

export function BarberShopRecurringScheduleForm() {
  const { form, doStuff, formId, action, scheduleType } = useBarberShopScheduleFormContext(SCHEDULE_TYPE)

  const [handleError] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
    ] as const
  })

  const navigate = useNavigate({
    from: Route.fullPath,
  })

  function handleTimeChange(e: ChangeEvent<HTMLInputElement>) {
    const maskedValue = applyMask('TIME_ONLY', e.currentTarget.value) as TimeString
    const name = e.currentTarget.name as 'openTime' | 'closeTime'
    
    form.setValue(name, maskedValue) // Atualiza o valor do campo no React Hook Form
    e.currentTarget.value = maskedValue // Define o valor no input
    
    e.currentTarget.focus()
  }
  
  return (
    <Form {...form}>
      <form
        id={formId} className="space-y-6"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const { message } = await doStuff(values)

            navigate({
              search: ({ open, ...rest }) => ({ ...rest }),
              replace: true,
              state: { message },
            })
          } catch (err) {
            handleError(err, form)
          } finally {
            // TODO: closeModal()
          }
        })}
      >
        <div className="grid gap-3">
          <DayOfWeekSelect />

          <OpenTimeInput />

          <CloseTimeInput />
          
          <FormRootErrorMessage />
        </div>
      </form>
    </Form>
  )
}
