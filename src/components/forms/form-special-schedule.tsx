import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { useLocation, useNavigate } from "react-router-dom"
import { useHandleErrors } from "@/providers/handleErrorProvider"
import { SpecialScheduleZod, specialScheduleSchema } from "@/schemas/specialSchedule"
import { useSchedulesLayout } from "../layouts/barber-shop-schedules-layout"
import { DateOnly } from "@/utils/types/date"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { Calendar } from "../ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Switch } from "../ui/switch"

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
  console.log('tentei abrir FormRegisterService')
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { handleError } = useHandleErrors()
  
  const form = useForm<SpecialScheduleZod>({
    resolver: formId !== 'special-remove-form' ? zodResolver(specialScheduleSchema) : undefined,
    defaultValues: {
      date: schedule?.date ?? '2024-12-05',
      notes: schedule?.notes ?? undefined,
      openTime: schedule?.openTime ?? '08:00:00',
      closeTime: schedule?.closeTime ?? '18:00:00',
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
      
      closeModal()
      navigate(pathname, { replace: true, state: { message }})
    } catch (err) {
      handleError(err, form)
    }
  }
  
  useEffect(() => {
    setLoadingState(form.formState.isSubmitting)
  }, [form.formState])

  const isClosed = form.watch('isClosed')
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id={formId} className="space-y-6">
        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data limite</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'dd/MM/yyyy')
                        ) : (
                          <span>Escolha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                  <Input type="text" inputMode="numeric" placeholder="Hora de abertura (opcional)" {...field} disabled={formId === 'special-remove-form' || isClosed} />
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
                  <Input type="text" inputMode="numeric" placeholder="Hora de fechamento (opcional)" {...field} disabled={formId === 'special-remove-form' || isClosed} />
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
                    onCheckedChange={field.onChange}
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
