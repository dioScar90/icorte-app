import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { BarberShopServiceForm } from './_form'
import { Button } from '../ui/button'
import { ShoppingBag } from 'lucide-react'
import { useLoaderData, useParams, useRouteContext, useSearch } from '@tanstack/react-router'
import { createContext, PropsWithChildren, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceSchema, ServiceZod } from '@/schemas/service'
import { applyMask } from '@/utils/mask'
import { BARBER_SHOP_SERVICES_ACTION_TYPES } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/services'

type BarberShopServiceFormType = {
  action: BARBER_SHOP_SERVICES_ACTION_TYPES
  
  formId: string
  barberShopId: number
  serviceId?: number
  
  form: ReturnType<typeof useForm<ServiceZod>>
  doStuff: (...args: Parameters<Parameters<ReturnType<typeof useForm<ServiceZod>>['handleSubmit']>[0]>) => Promise<{ message: string }>
} & ReturnType<typeof getDialogInfos>

const BarberShopServiceFormContext = createContext<BarberShopServiceFormType | null>(null)

function getDialogInfos(action: BARBER_SHOP_SERVICES_ACTION_TYPES) {
  const infos = {
    'REGISTER': {
      dialogInfos: {
        title: 'alfkd',
        description: 'Preencha os campos abaixo para criar um novo serviço.',
      },
      submitBtnInfos: {
        innerText: 'Cadastrar',
        variant: 'default',
      }
    },
    'UPDATE': {
      dialogInfos: {
        title: 'alfkd',
        description: 'Confira os campos abaixo para atualizar o serviço.',
      },
      submitBtnInfos: {
        innerText: 'Cadastrar',
        variant: 'default',
      }
    },
    'REMOVE': {
      dialogInfos: {
        title: 'alfkd',
        description: 'ATENÇÃO - Serviço será removido.',
      },
      submitBtnInfos: {
        innerText: 'Cadastrar',
        variant: 'destructive',
      }
    },
  } as const satisfies Record<typeof action, any>

  return infos[action]
}

function BarberShopServiceFormProvider({ children }: PropsWithChildren) {
  const { barberShopId } = useParams({
    from: '/(authenticated-only)/barber-shop/$barberShopId/services',
  })

  const { action, serviceId } = useSearch({
    from: '/(authenticated-only)/barber-shop/$barberShopId/services',
    select: (s) => s.open!,
  })

  const service = useLoaderData({
    from: '/(authenticated-only)/barber-shop/$barberShopId/services',
    select: (s) => !!serviceId ? s.services.find(({ id }) => id === serviceId) : undefined,
  })
  
  const [register, update, remove] = useRouteContext({
    from: '/(authenticated-only)/barber-shop/$barberShopId/services',
    select: (s) => [
      s.services.register,
      s.services.update,
      s.services.remove,
    ] as const
  })

  const form = useForm<ServiceZod>({
    resolver: action === 'REMOVE' ? undefined : zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      price: service?.price ? applyMask('MONEY', service?.price) : undefined,
      duration: service?.duration || undefined,
    }
  })

  type AvailableMethods = ReturnType<typeof register | typeof update | typeof remove>
  
  const doStuff: BarberShopServiceFormType['doStuff'] = async (data) => {
    const infos = {
      'REGISTER': {
        method: () => register(barberShopId, data),
        defaultMessage: 'Serviço criado com sucesso',
      },
      'UPDATE': {
        method: () => update(barberShopId, serviceId!, data),
        defaultMessage: 'Serviço atualizado com sucesso',
      },
      'REMOVE': {
        method: () => remove(barberShopId, serviceId!),
        defaultMessage: 'Serviço removido com sucesso',
      },
    } as const satisfies Record<typeof action, {
      method: () => AvailableMethods
      defaultMessage: string
    }>

    const { method, defaultMessage } = infos[action]

    const result = await method()
    
    if (!result.isSuccess) {
      throw result.error
    }

    return {
      message: result.value?.message ?? defaultMessage
    }
  }
  
  const formId = `form_${action}_${barberShopId}_${serviceId ?? ''}`
  
  return (
    <BarberShopServiceFormContext.Provider
      value={{ action, barberShopId, serviceId, formId, form, doStuff, ...getDialogInfos(action) }}
    >
      {children}
    </BarberShopServiceFormContext.Provider>
  )
}

export const useBarberShopServiceFormContext = () => useContext(BarberShopServiceFormContext)!

function FormSubmitButton() {
  const { formId, form, submitBtnInfos } = useBarberShopServiceFormContext()
  
  return (
    <Button
      type="submit"
      variant={submitBtnInfos.variant}
      form={formId}
      isLoading={form.formState.isSubmitting}
      IconLeft={<ShoppingBag />}
    >
      {submitBtnInfos.innerText}
    </Button>
  )
}

function DialogItself() {
  const { dialogInfos } = useBarberShopServiceFormContext()
  
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogInfos.title}</DialogTitle>
          <DialogDescription>
            {dialogInfos.description}
          </DialogDescription>
        </DialogHeader>

        <BarberShopServiceForm />
        
        <DialogFooter className="grid grid-cols-2 md:flex md:justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>

          <FormSubmitButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function BarberShopServiceDialog() {
  const { open } = useSearch({
    from: '/(authenticated-only)/barber-shop/$barberShopId/services',
  })

  if (!open) {
    return null
  }
  
  return (
    <BarberShopServiceFormProvider>
      <DialogItself />
    </BarberShopServiceFormProvider>
  )
}
