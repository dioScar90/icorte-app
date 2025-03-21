import { Input } from "@/components/ui/input"
import { ChangeEvent } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { applyMask } from "@/utils/mask"
import { navigateToEndAfterFocus } from "@/utils/cursor-end-of-input"
import { TimeOnly } from "@/utils/types/date"
import { useNavigate } from "@tanstack/react-router"
import { useBarberShopServiceFormContext } from "./_dialog"
import { Route as BarberShopServicesRoute } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/services'

export function BarberShopServiceForm() {
  const { form, doStuff, formId, action } = useBarberShopServiceFormContext()

  const [handleError] = BarberShopServicesRoute.useRouteContext({
    select: (s) => [
      s.handleError,
    ] as const
  })
  
  const navigate = useNavigate({ from: BarberShopServicesRoute.fullPath })
  
  function handlePriceChange(e: ChangeEvent<HTMLInputElement>) {
    const maskedValue = applyMask('MONEY', e.currentTarget.value)
    
    form.setValue('price', maskedValue) // Atualiza o valor do campo no React Hook Form
    e.currentTarget.value = maskedValue // Define o valor no input
    
    e.currentTarget.focus()
  }
  
  function handleDurationChange(e: ChangeEvent<HTMLInputElement>) {
    const maskedValue = applyMask('TIME_ONLY', e.currentTarget.value) as TimeOnly
    
    form.setValue('duration', maskedValue) // Atualiza o valor do campo no React Hook Form
    e.currentTarget.value = maskedValue // Define o valor no input
    
    e.currentTarget.focus()
  }
  
  return (
    <Form {...form}>
      <form
        id={formId} className="space-y-6"
        onSubmit={form.handleSubmit(async (data) => {
          try {
            const { message } = await doStuff(data)
            
            navigate({
              search: ({ open, ...rest}) => ({ ...rest }),
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
