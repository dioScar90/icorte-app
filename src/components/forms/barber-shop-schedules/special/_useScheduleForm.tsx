import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { SpecialSchedule } from '@/types/models/specialSchedule'
import { getFormattedDate } from '@/schemas/sharedValidators/dateString'
import { specialScheduleSchema } from '@/schemas/specialSchedule'
import { useBarberShopSchedulesForm } from '@/hooks/forms/use-barber-shop-schedules'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'
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

export function useInitValuesSpecialScheduleFormContext() {
  const { barberShopId } = Route.useParams()

  const openProps = Route.useSearch({
    select: (s) => s.open!,
  })

  const { scheduleType } = openProps

  if (scheduleType !== 'special') {
    throw new Error('Impossible error')
  }
  
  const [isClosed, setIsClosed] = useState(false)
  const navigate = useNavigate({ from: Route.fullPath })
  
  const { action, date } = openProps.details
  
  const [schedule] = Route.useLoaderData({
    select: (s) => [
      s.specialSchedules.find(schedule => date !== undefined && schedule.date === date),
    ] as const
  })
  
  const [handleError, register, update, remove] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.special.register,
      s.special.update,
      s.special.remove,
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
      date: schedule?.date ? getFormattedDate(schedule.date) as SpecialSchedule['date'] : undefined,
      notes: schedule?.notes ?? undefined,
      openTime: schedule?.openTime ?? undefined,
      closeTime: schedule?.closeTime ?? undefined,
      isClosed: schedule?.isClosed ?? false,
    } as z.input<typeof specialScheduleSchema>,
    validators: {
      onSubmit: action === 'REMOVE' ? undefined : specialScheduleSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const values = action === 'REMOVE' ? null : specialScheduleSchema.parse(value)
        
        const infos = {
          REGISTER: {
            method: () => register(barberShopId, values!),
            defaultMessage: 'Serviço criado com sucesso',
          },
          UPDATE: {
            method: () => update(barberShopId, date!, values!),
            defaultMessage: 'Serviço atualizado com sucesso',
          },
          REMOVE: {
            method: () => remove(barberShopId, date!),
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
  
  useEffect(() => {
    return form.store.subscribe(() => {
      if (form.store.state.values.isClosed) {
        form.setFieldValue('openTime', undefined)
        form.setFieldValue('closeTime', undefined)
      }

      if (isClosed !== form.store.state.values.isClosed) {
        setIsClosed(form.store.state.values.isClosed)
      }
    })
  }, [form.store])
  
  return {
    ...basicValues,
    isClosed,
    form,
  }
}

export const SpecialScheduleFormContext = createContext<ReturnType<typeof useInitValuesSpecialScheduleFormContext> | null>(null)

export const useSpecialScheduleFormContext = () => useContext(SpecialScheduleFormContext)!
