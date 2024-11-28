import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceSchema, ServiceZod } from "@/schemas/service"
import { useEffect } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { BarberShopServicesLayoutContextType } from "../layouts/barber-shop-services-layout"
import { useLocation, useNavigate } from "react-router-dom"
import { useHandleErrors } from "@/providers/handleErrorProvider"

export type RegisterProps = {
  formId: 'register-form'
  action: BarberShopServicesLayoutContextType['register']
  serviceId?: undefined
  service?: undefined
}

export type UpdateProps = {
  formId: 'update-form'
  action: BarberShopServicesLayoutContextType['update']
  serviceId: number
  service: ServiceZod
}

export type RemoveProps = {
  formId: 'remove-form'
  action: BarberShopServicesLayoutContextType['remove']
  serviceId: number
  service: ServiceZod
}

type Props = {
  closeModal: () => void
  setLoadingState: (arg: boolean) => void
  barberShopId: number
} & (RegisterProps | UpdateProps | RemoveProps)

export function FormService({ formId, action, closeModal, setLoadingState, barberShopId, serviceId, service }: Props) {
  console.log('tentei abrir FormRegisterService')
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { handleError } = useHandleErrors()
  
  const form = useForm<ServiceZod>({
    resolver: formId !== 'remove-form' ? zodResolver(serviceSchema) : undefined,
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      price: service?.price || 0.0,
      duration: service?.duration || '00:30:00',
    }
  })
  
  async function onSubmit(data: ServiceZod) {
    try {
      let result: Awaited<ReturnType<typeof action>>
      let message: string
      
      switch (formId) {
        case 'register-form':
          result = await action(barberShopId, data)
          message = result.value?.message ?? 'Serviço criado com sucesso'
          break
        case 'update-form':
          result = await action(barberShopId, serviceId, data)
          message = result.value?.message ?? 'Serviço atualizado com sucesso'
          break
        default:
          result = await action(barberShopId, serviceId)
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
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id={formId} className="space-y-6">
        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nome" {...field} disabled={formId === 'remove-form'} />
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
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Descrição (opcional)" {...field} disabled={formId === 'remove-form'} />
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
                  <Input type="text" inputMode="decimal" placeholder="Preço" {...field} disabled={formId === 'remove-form'} />
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
                  <Input type="text" inputMode="numeric" placeholder="Duração" {...field} disabled={formId === 'remove-form'} />
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
