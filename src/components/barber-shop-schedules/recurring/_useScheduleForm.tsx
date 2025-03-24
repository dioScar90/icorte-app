import { createContext, useContext, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RecurringSchedule } from '@/types/models/recurringSchedule'
import { DayOfWeekEnum, recurringScheduleSchema } from '@/schemas/recurringSchedule'
import { Route } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'

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

  const { scheduleType, action, dayOfWeek } = Route.useSearch({
    select: (s) => s.open!,
  })

  if (scheduleType !== 'recurring') {
    throw new Error('Impossible error')
  }
  
  const [schedule] = Route.useLoaderData({
    select: (s) => [
      s.recurringSchedules.find(schedule => dayOfWeek !== undefined && schedule.dayOfWeek === dayOfWeek),
    ] as const
  })
  
  const [register, update, remove] = Route.useRouteContext({
    select: (s) => [
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

  const form = useForm<RecurringSchedule>({
    resolver: action === 'REMOVE' ? undefined : zodResolver(recurringScheduleSchema),
    defaultValues: {
      dayOfWeek: schedule?.dayOfWeek ?? DayOfWeekEnum.SEGUNDA,
      openTime: schedule?.openTime ?? undefined,
      closeTime: schedule?.closeTime ?? undefined,
    },
  })
  
  const doStuff = async (values: Parameters<Parameters<typeof form.handleSubmit>[0]>[0]) => {
    const infos = {
      REGISTER: {
        method: () => register(barberShopId, values),
        defaultMessage: 'Serviço criado com sucesso',
      },
      UPDATE: {
        method: () => update(barberShopId, dayOfWeek!, values),
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

    return {
      message: result.value?.message ?? defaultMessage
    }
  }
  
  return {
    ...basicValues,
    form,
    doStuff,
  }
}

export const RecurringScheduleFormContext = createContext<ReturnType<typeof useInitValuesRecurringScheduleFormContext> | null>(null)

export const useRecurringScheduleFormContext = () => useContext(RecurringScheduleFormContext)!
