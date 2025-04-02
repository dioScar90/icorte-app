import { createContext, useContext, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useBarberShopServicesForm } from '@/hooks/forms/use-barber-shop-services'
import { serviceSchema } from '@/schemas/service'
import { applyMask } from '@/utils/mask'
import { Route } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/services'
import type { z } from 'zod'

type Action = 'REGISTER' | 'UPDATE' | 'REMOVE'

function getDialogInfos(action: Action) {
  const infos = {
    'REGISTER': {
      dialogInfos: {
        title: 'Cadastrar',
        description: 'Preencha os campos abaixo para criar um novo serviço.',
      },
      submitBtnInfos: {
        innerText: 'Cadastrar',
        variant: 'default',
      }
    },
    'UPDATE': {
      dialogInfos: {
        title: 'Cadastrar',
        description: 'Confira os campos abaixo para atualizar o serviço.',
      },
      submitBtnInfos: {
        innerText: 'Cadastrar',
        variant: 'default',
      }
    },
    'REMOVE': {
      dialogInfos: {
        title: 'Cadastrar',
        description: 'ATENÇÃO - Serviço será removido.',
      },
      submitBtnInfos: {
        innerText: 'Cadastrar',
        variant: 'destructive',
      }
    },
  } as const satisfies Record<Action, any>
  
  return infos[action]
}

export function useInitValuesServiceFormContext() {
  const { barberShopId } = Route.useParams()

  const navigate = useNavigate({ from: Route.fullPath })

  const { action, serviceId } = Route.useSearch({
    select: (s) => s.open!,
  })
  
  const service = Route.useLoaderData({
    select: (s) => !!serviceId ? s.services.find(({ id }) => id === serviceId) : undefined,
  })
  
  const [handleError, register, update, remove] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.services.register,
      s.services.update,
      s.services.remove,
    ] as const
  })
  
  const basicValues = useMemo(() => ({
    serviceId,
    action,
    barberShopId,
    formId: `form_${action}_${barberShopId}_${serviceId}`,
    ...getDialogInfos(action),
  } as const), [action, barberShopId, serviceId])

  const form = useBarberShopServicesForm({
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      price: service?.price ? applyMask('MONEY', service?.price) : undefined,
      duration: service?.duration || undefined,
    } as z.input<typeof serviceSchema>,
    validators: {
      onSubmit: action === 'REMOVE' ? undefined : serviceSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const values = action === 'REMOVE' ? null : serviceSchema.parse(value)
        
        const infos = {
          'REGISTER': {
            method: () => register(barberShopId, values!),
            defaultMessage: 'Serviço criado com sucesso',
          },
          'UPDATE': {
            method: () => update(barberShopId, serviceId!, values!),
            defaultMessage: 'Serviço atualizado com sucesso',
          },
          'REMOVE': {
            method: () => remove(barberShopId, serviceId!),
            defaultMessage: 'Serviço removido com sucesso',
          },
        } as const
        
        const { method, defaultMessage } = infos[action]
    
        const result = await method()
    
        if (!result.isSuccess) {
          throw result.error
        }
        
        navigate({
          search: ({ open, ...rest }) => ({ ...rest }),
          state: {
            alert: {
              message: result.value?.message ?? defaultMessage,
            },
          },
        })
      } catch (err) {
        handleError(err)
      } finally {
        // TODO: closeModal()
      }
    },
  })
  
  return {
    ...basicValues,
    form,
  }
}

export const ServiceFormContext = createContext<ReturnType<typeof useInitValuesServiceFormContext> | null>(null)

export const useServiceFormContext = () => useContext(ServiceFormContext)!
