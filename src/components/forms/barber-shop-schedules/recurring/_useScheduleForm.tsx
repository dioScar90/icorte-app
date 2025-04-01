import { createContext, useContext, useMemo } from 'react'
import { daysOfWeek, recurringScheduleSchema } from '@/schemas/recurringSchedule'
import { Route } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'
import { useBarberShopSchedulesForm } from '@/hooks/forms/use-barber-shop-schedules'
import { getEnumAsString } from '@/schemas/sharedValidators/nativeEnumValidator'
import { useNavigate } from '@tanstack/react-router'
import type { z } from 'zod'

type Action = 'REGISTER' | 'UPDATE' | 'REMOVE'

function getDialogInfos(action: Action) {
  const infos = {
    REGISTER: {
      dialogInfos: {
        title: 'Cadastrar',
        description: 'Preencha os campos abaixo para criar um novo serviço.',
      },
      submitBtnInfos: {
        innerText: 'Cadastrar',
        variant: 'default',
      }
    },
    UPDATE: {
      dialogInfos: {
        title: 'Cadastrar',
        description: 'Confira os campos abaixo para atualizar o serviço.',
      },
      submitBtnInfos: {
        innerText: 'Cadastrar',
        variant: 'default',
      }
    },
    REMOVE: {
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

export function useInitValuesRecurringScheduleFormContext() {
  const { barberShopId } = Route.useParams()

  const openProps = Route.useSearch({
    select: (s) => s.open!,
  })

  const { scheduleType } = openProps

  if (scheduleType !== 'recurring') {
    throw new Error('Impossible error')
  }

  const navigate = useNavigate({ from: Route.fullPath })
  
  const { action, dayOfWeek } = openProps.details
  
  const [schedule] = Route.useLoaderData({
    select: (s) => [
      s.recurringSchedules.find(schedule => dayOfWeek !== undefined && schedule.dayOfWeek === dayOfWeek),
    ] as const
  })
  
  const [handleError, register, update, remove] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.recurring.register,
      s.recurring.update,
      s.recurring.remove,
    ] as const
  })
  
  const basicValues = useMemo(() => ({
    scheduleType,
    action,
    barberShopId,
    formId: `form_${action}_${barberShopId}_${scheduleType}`,
    ...getDialogInfos(action),
  } as const), [scheduleType, action, barberShopId])

  const form = useBarberShopSchedulesForm({
    defaultValues: {
      dayOfWeek: getEnumAsString(daysOfWeek, schedule?.dayOfWeek) ?? daysOfWeek[1],
      openTime: schedule?.openTime ?? undefined,
      closeTime: schedule?.closeTime ?? undefined,
    } as z.input<typeof recurringScheduleSchema>,
    validators: {
      onSubmit: action === 'REMOVE' ? undefined : recurringScheduleSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const values = action === 'REMOVE' ? null : recurringScheduleSchema.parse(value)
        
        const infos = {
          REGISTER: {
            method: () => register(barberShopId, values!),
            defaultMessage: 'Serviço criado com sucesso',
          },
          UPDATE: {
            method: () => update(barberShopId, dayOfWeek!, values!),
            defaultMessage: 'Serviço atualizado com sucesso',
          },
          REMOVE: {
            method: () => remove(barberShopId, dayOfWeek!),
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

export const RecurringScheduleFormContext = createContext<ReturnType<typeof useInitValuesRecurringScheduleFormContext> | null>(null)

export const useRecurringScheduleFormContext = () => useContext(RecurringScheduleFormContext)!
