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

type BarberShopScheduleFormType =
  | BaseContext<'recurring', RecurringSchedule>
  | BaseContext<'special', SpecialSchedule>

const BarberShopScheduleFormContext = createContext<BarberShopScheduleFormType | null>(null)

function BarberShopScheduleFormProvider({ children }: PropsWithChildren) {
  const { barberShopId } = Route.useParams()

  const { scheduleType, action, date, dayOfWeek } = Route.useSearch({
    select: (s) => s.open!,
  })

  const [recurringSchedule, specialSchedule] = Route.useLoaderData({
    select: (s) => [
      s.recurringSchedules.find(schedule => dayOfWeek !== undefined && schedule.dayOfWeek === dayOfWeek),
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
  
  if (scheduleType === 'recurring') {
    return (
      <BarberShopScheduleFormContext.Provider
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
      </BarberShopScheduleFormContext.Provider>
    )
  } else {
    return (
      <BarberShopScheduleFormContext.Provider
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
      </BarberShopScheduleFormContext.Provider>
    )
  }
}

export const useBarberShopScheduleFormContext = () => useContext(BarberShopScheduleFormContext)!

function FormSubmitButton() {
  const { formId, form, submitBtnInfos } = useBarberShopScheduleFormContext()

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
  const { dialogInfos } = useBarberShopScheduleFormContext()

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

          <FormSubmitButton />
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
  
  return (
    <BarberShopScheduleFormProvider>
      <DialogItself />
    </BarberShopScheduleFormProvider>
  )
}
