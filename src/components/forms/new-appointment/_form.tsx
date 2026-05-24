import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { paymentTypeAsConst } from "@/schemas/appointment"
import { InputFieldsDatesAndTimeSpans } from "./_formDateTImeFields"
import { CheckboxFieldsServices } from "./_formCheckboxFieldsServices"
import { useNavigate, useRouteContext } from "@tanstack/react-router"
import { useDialogContext } from "./_dialog"

export function FormNewAppointment() {
  const { form, formId } = useDialogContext()

  const [handleError, createAppointment] = useRouteContext({
    from: '/(authenticated-only)/barber-schedule/new-appointment',
    select: (s) => [
      s.handleError,
      s.barberSchedule.createAppointment,
    ] as const
  })

  const navigate = useNavigate({
    from: '/barber-schedule/new-appointment/'
  })

  const onSubmit: Parameters<typeof form.handleSubmit>[0] = async ({ serviceIds, ...values }) => {
    const data = { ...values, serviceIds: [...serviceIds] }

    let appointmentId, message

    try {
      const result = await createAppointment(data)

      if (result.error) {
        throw result.error
      }

      appointmentId = result.data.item.id
      message = result.data?.message ?? 'Horário marcado com sucesso'
    } catch (err) {
      handleError(err, form)
    } finally {
      navigate({
        search: ({ newAppointment, ...rest }) => ({ ...rest }),
      })
    }

    if (appointmentId && message) {
      navigate({
        to: '/barber-schedule/dashboard/$appointmentId',
        params: {
          appointmentId,
        },
        state: {
          alert: {
            message,
          },
        },
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id={formId} className="space-y-6">
        <div className="grid gap-1">

          <InputFieldsDatesAndTimeSpans />

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
                      {paymentTypeAsConst.map(paymentType => (
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

                <CheckboxFieldsServices />

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
