import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceSchema, ServiceZod } from "@/schemas/service"
import { useEffect } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { BarberShopServicesLayoutContextType } from "../layouts/barber-shop-services-layout"
import { useLocation, useNavigate } from "react-router-dom"
import { useHandleErrors } from "@/providers/handleErrorProvider"

type Props = {
  update: BarberShopServicesLayoutContextType['update']
  formId: string
  closeModal: () => void
  setLoadingState: (arg: boolean) => void
  barberShopId: number
  serviceId: number
  service: ServiceZod
}

export function FormUpdateService({ update, formId, closeModal, setLoadingState, barberShopId, serviceId, service }: Props) {
  console.log('tentei abrir FormRegisterService')
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { handleError } = useHandleErrors()
  
  const form = useForm<ServiceZod>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      ...service,
    }
  })
  
  async function onSubmit(data: ServiceZod) {
    try {
      const result = await update(barberShopId, serviceId, data)
      
      if (!result.isSuccess) {
        throw result.error
      }
      
      closeModal()
      navigate(pathname, { replace: true, state: { message: 'Serviço atualizado com sucesso!' }})
    } catch (err) {
      handleError(err, form)
    }
  }
  
  useEffect(() => {
    console.log('form.formState.isLoading', form.formState.isLoading)
    setLoadingState(form.formState.isLoading)
  }, [form.formState.isLoading])
  
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
                  <Input type="text" placeholder="Nome" {...field} />
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
                  <Input type="text" placeholder="Descrição (opcional)" {...field} />
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
                  <Input type="text" inputMode="decimal" placeholder="Preço" {...field} />
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
                  <Input type="text" inputMode="numeric" placeholder="Duração" {...field} />
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
