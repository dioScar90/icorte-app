import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { BarberShopRecurringScheduleForm } from './_recurringForm'
import { BarberShopSpecialScheduleForm } from './_specialForm'
import { Button } from '../ui/button'
import { ShoppingBag } from 'lucide-react'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DayOfWeekEnum, recurringScheduleSchema } from '@/schemas/recurringSchedule'
import { RecurringSchedule } from '@/types/models/recurringSchedule'
import { SpecialSchedule } from '@/types/models/specialSchedule'
import { getFormattedDate } from '@/schemas/sharedValidators/dateString'
import { specialScheduleSchema } from '@/schemas/specialSchedule'
import { Route } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'

type Action = 'REGISTER' | 'UPDATE' | 'REMOVE'
type ScheduleType = 'recurring' | 'special'
type FieldValues = RecurringSchedule | SpecialSchedule

function getDialogInfos(type: ScheduleType, action: Action) {
  const infos = {
    recurring: {
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
    },
    special: {
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
    },
  } as const satisfies Record<ScheduleType, Record<Action, any>>
  
  return infos[type][action]
}

type UseFormDetails<
  TFieldValues extends FieldValues,
  TForm extends ReturnType<typeof useForm<TFieldValues>> = ReturnType<typeof useForm<TFieldValues>>,
  THandleSubmit extends TForm['handleSubmit'] = TForm['handleSubmit'],
  TOnSubmit extends Parameters<THandleSubmit>[0] = Parameters<THandleSubmit>[0],
  TValues extends Parameters<TOnSubmit> = Parameters<TOnSubmit>,
> = {
  form: TForm
  doStuff: (...values: TValues) => Promise<{ message: string }>
}

type BaseContext<TScheduleType extends ScheduleType, TFieldValues extends FieldValues> = {
  scheduleType: TScheduleType
  action: Action
  formId: string
  barberShopId: number
}
  & ReturnType<typeof getDialogInfos>
  & UseFormDetails<TFieldValues>

// type BarberShopScheduleFormType =
//   | BaseContext<'recurring', RecurringSchedule>
//   | BaseContext<'special', SpecialSchedule>

const RecurringScheduleFormContext = createContext<BaseContext<'recurring', RecurringSchedule> | null>(null)
const SpecialScheduleFormContext = createContext<BaseContext<'special', SpecialSchedule> | null>(null)

function RecurringScheduleFormProvider({ children }: PropsWithChildren) {
  const { barberShopId } = Route.useParams()

  const { scheduleType, action, dayOfWeek } = Route.useSearch({
    select: (s) => s.open!,
  })

  if (scheduleType !== 'recurring') {
    return null
  }

  const [recurringSchedule] = Route.useLoaderData({
    select: (s) => [
      s.recurringSchedules.find(schedule => dayOfWeek !== undefined && schedule.dayOfWeek === dayOfWeek),
    ] as const
  })
  
  const methods = Route.useRouteContext({
    select: ({ recurring, special }) => ({ recurring, special } as const)
  })
  
  const basicValues = useMemo(() => ({
    action,
    barberShopId,
    formId: `form_${action}_${barberShopId}_${scheduleType}`,
    ...getDialogInfos(scheduleType, action),
  } as const), [scheduleType, action, barberShopId])
  
  return (
    <RecurringScheduleFormContext.Provider
      value={{
        scheduleType,
        ...basicValues,
        form: useForm<RecurringSchedule>({
          resolver: action === 'REMOVE' ? undefined : zodResolver(recurringScheduleSchema),
          defaultValues: {
            dayOfWeek: recurringSchedule?.dayOfWeek ?? DayOfWeekEnum.SEGUNDA,
            openTime: recurringSchedule?.openTime ?? undefined,
            closeTime: recurringSchedule?.closeTime ?? undefined,
          },
        }),
        doStuff: async (values) => {
          const infos = {
            REGISTER: {
              method: () => methods.recurring.register(barberShopId, values),
              defaultMessage: 'Serviço criado com sucesso',
            },
            UPDATE: {
              method: () => methods.recurring.update(barberShopId, dayOfWeek!, values),
              defaultMessage: 'Serviço atualizado com sucesso',
            },
            REMOVE: {
              method: () => methods.recurring.remove(barberShopId, dayOfWeek!),
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
        },
      }}
    >
      {children}
    </RecurringScheduleFormContext.Provider>
  )
}

function SpecialScheduleFormProvider({ children }: PropsWithChildren) {
  const { barberShopId } = Route.useParams()

  const { scheduleType, action, date } = Route.useSearch({
    select: (s) => s.open!,
  })

  if (scheduleType !== 'special') {
    return null
  }

  const [specialSchedule] = Route.useLoaderData({
    select: (s) => [
      s.specialSchedules.find(schedule => date !== undefined && schedule.date === date),
    ] as const
  })
  
  const methods = Route.useRouteContext({
    select: ({ recurring, special }) => ({ recurring, special } as const)
  })
  
  const basicValues = useMemo(() => ({
    action,
    barberShopId,
    formId: `form_${action}_${barberShopId}_${scheduleType}`,
    ...getDialogInfos(scheduleType, action),
  } as const), [scheduleType, action, barberShopId])
  
  const aiCaramba = useForm<SpecialSchedule>({
    resolver: action === 'REMOVE' ? undefined : zodResolver(specialScheduleSchema),
    defaultValues: {
      date: specialSchedule?.date ? getFormattedDate(specialSchedule.date) as SpecialSchedule['date'] : undefined,
      notes: specialSchedule?.notes ?? undefined,
      openTime: specialSchedule?.openTime ?? undefined,
      closeTime: specialSchedule?.closeTime ?? undefined,
      isClosed: specialSchedule?.isClosed ?? false,
    },
  })
  
  return (
    <SpecialScheduleFormContext.Provider
      value={{
        scheduleType,
        ...basicValues,
        form: useForm<SpecialSchedule>({
          resolver: action === 'REMOVE' ? undefined : zodResolver(specialScheduleSchema),
          defaultValues: {
            date: specialSchedule?.date ? getFormattedDate(specialSchedule.date) as SpecialSchedule['date'] : undefined,
            notes: specialSchedule?.notes ?? undefined,
            openTime: specialSchedule?.openTime ?? undefined,
            closeTime: specialSchedule?.closeTime ?? undefined,
            isClosed: specialSchedule?.isClosed ?? false,
          },
        }),
        doStuff: async (values) => {
          const infos = {
            REGISTER: {
              method: () => methods.special.register(barberShopId, values),
              defaultMessage: 'Serviço criado com sucesso',
            },
            UPDATE: {
              method: () => methods.special.update(barberShopId, date!, values),
              defaultMessage: 'Serviço atualizado com sucesso',
            },
            REMOVE: {
              method: () => methods.special.remove(barberShopId, date!),
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
        },
      }}
    >
      {children}
    </SpecialScheduleFormContext.Provider>
  )
}

export function useBarberShopScheduleFormContext(scheduleType: ScheduleType) {
  return scheduleType === 'recurring'
    ? useContext(RecurringScheduleFormContext)!
    : useContext(SpecialScheduleFormContext)!
}

function FormSubmitButton({ scheduleType }: { scheduleType: ScheduleType }) {
  const { formId, form, submitBtnInfos } = useBarberShopScheduleFormContext(scheduleType)

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

function DialogItself({ scheduleType }: { scheduleType: ScheduleType }) {
  const { dialogInfos } = useBarberShopScheduleFormContext(scheduleType)

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogInfos.title}</DialogTitle>
          <DialogDescription>
            {dialogInfos.description}
          </DialogDescription>
        </DialogHeader>

        <BarberShopRecurringScheduleForm />

        <BarberShopSpecialScheduleForm />

        <DialogFooter className="grid grid-cols-2 md:flex md:justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>

          <FormSubmitButton scheduleType={scheduleType} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function BarberShopScheduleDialog() {
  const scheduleType = Route.useSearch({
    select: (s) => s.open?.scheduleType,
  })
  
  if (!scheduleType) {
    return null
  }
  
  return scheduleType === 'recurring'
    ? (
      <RecurringScheduleFormProvider>
        <DialogItself scheduleType={scheduleType} />
      </RecurringScheduleFormProvider>
    )
    : (
      <SpecialScheduleFormProvider>
        <DialogItself scheduleType={scheduleType} />
      </SpecialScheduleFormProvider>
    )
}
