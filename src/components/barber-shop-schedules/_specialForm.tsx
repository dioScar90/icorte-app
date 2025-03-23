import { Input } from "@/components/ui/input"
import { ChangeEvent } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { applyMask } from "@/utils/mask"
import { navigateToEndAfterFocus } from "@/utils/cursor-end-of-input"
import { TimeString } from "@/utils/types/time-string"
import { useNavigate } from "@tanstack/react-router"
import { useBarberShopScheduleFormContext } from "./_dialog"
import { Route } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'

function Formmm() {
  const { form, doStuff, formId, action, schedule } = useBarberShopScheduleFormContext()

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
    const maskedValue = applyMask('TIME_ONLY', e.currentTarget.value) as TimeString
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

export function BarberShopSpecialScheduleForm() {
  const { form, doStuff, formId, action, scheduleType } = useBarberShopScheduleFormContext()

  if (scheduleType !== 'special') {
    return null
  }

  const [handleError] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
    ] as const
  })

  const navigate = useNavigate({
    from: Route.fullPath,
  })

  function handlePriceChange(e: ChangeEvent<HTMLInputElement>) {
    const maskedValue = applyMask('MONEY', e.currentTarget.value)

    form.setValue('price', maskedValue) // Atualiza o valor do campo no React Hook Form
    e.currentTarget.value = maskedValue // Define o valor no input

    e.currentTarget.focus()
  }

  function handleDurationChange(e: ChangeEvent<HTMLInputElement>) {
    const maskedValue = applyMask('TIME_ONLY', e.currentTarget.value) as TimeString

    form.setValue('duration', maskedValue) // Atualiza o valor do campo no React Hook Form
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nome" {...field} disabled={action === 'REGISTER'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Descrição (opcional)" {...field} disabled={action === 'REGISTER'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text" inputMode="decimal" placeholder="R$ 45,00"
                    onChange={handlePriceChange} onFocus={navigateToEndAfterFocus}
                    disabled={action === 'REGISTER'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text" inputMode="numeric" placeholder="00:30:00"
                    onChange={handleDurationChange} onFocus={navigateToEndAfterFocus}
                    disabled={action === 'REGISTER'}
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
