import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CalendarArrowUp, CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SubmitButton } from '@/components/ui/submit-button'
import { useDateTime } from '@/hooks/use-datetime'

export const Route = createFileRoute(
  '/(authenticated-only)/admin/populate-appointments',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [handleError, popAppointments, schema] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.admin.popAppointments,
      s.admin.appointmentsAdminSchema,
    ] as const
  })
  
  const { format } = useDateTime()
  
  const navigate = useNavigate()
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstDate: undefined,
      limitDate: undefined,
      passphrase: '',
    }
  })
  
  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const result = await popAppointments(values)

      if (!result.isSuccess) {
        throw result.error
      }
      
      navigate({
        to: '/admin/dashboard',
        state: {
          alert: {
            message: 'Novos horários inseridos, menos pra vc ;(',
          },
        },
      })
    } catch (err) {
      handleError(err, form)
    }
  }

  return (
    <>
      <h3>Populate all users and their related tables again</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="passphrase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frase secreta</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Digite a frase secreta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data inicial</FormLabel>
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
            name="limitDate"
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
          
          <FormRootErrorMessage />

          <SubmitButton
            type="submit"
            disabled={form.formState.isLoading || form.formState.isSubmitting}
            IconLeft={<CalendarArrowUp />}
          >
            Marcar horários
          </SubmitButton>
        </form>
      </Form>
    </>
  )
}
