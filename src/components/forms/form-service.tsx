import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceSchema, ServiceZod } from "@/schemas/service"
import { ChangeEvent, useEffect } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { useServicesLayout } from "../layouts/barber-shop-services-layout"
import { useLocation, useNavigate } from "react-router-dom"
import { useHandleErrors } from "@/providers/handleErrorProvider"
import { applyMask } from "@/utils/mask"
import { navigateToEndAfterFocus } from "@/utils/cursor-end-of-input"
import { TimeOnly } from "@/utils/types/date"

export type RegisterProps = {
  formId: 'register-form'
  action: ReturnType<typeof useServicesLayout>['register']
  serviceId?: undefined
  service?: undefined
}

export type UpdateProps = {
  formId: 'update-form'
  action: ReturnType<typeof useServicesLayout>['update']
  serviceId: number
  service: ServiceZod
}

export type RemoveProps = {
  formId: 'remove-form'
  action: ReturnType<typeof useServicesLayout>['remove']
  serviceId: number
  service: ServiceZod
}

type Props = {
  closeModal: () => void
  setLoadingState: (arg: boolean) => void
  barberShopId: number
} & (RegisterProps | UpdateProps | RemoveProps)

export function FormService({ formId, action, closeModal, setLoadingState, barberShopId, serviceId, service }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { handleError } = useHandleErrors()
  
  const form = useForm<ServiceZod>({
    resolver: formId !== 'remove-form' ? zodResolver(serviceSchema) : undefined,
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      price: service?.price ? applyMask('MONEY', service?.price) : undefined,
      duration: service?.duration || undefined,
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
      
      navigate(pathname, { replace: true, state: { message }})
    } catch (err) {
      handleError(err, form)
    } finally {
      closeModal()
    }
  }
  
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
                <FormLabel>Descrição</FormLabel>
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
                  <Input
                    {...field}
                    type="text" inputMode="decimal" placeholder="R$ 45,00"
                    onChange={handlePriceChange} onFocus={navigateToEndAfterFocus}
                    disabled={formId === 'remove-form'}
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
                    disabled={formId === 'remove-form'}
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
