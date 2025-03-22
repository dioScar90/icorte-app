import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { BarberShopScheduleForm } from './_form'
import { Button } from '../ui/button'
import { ShoppingBag } from 'lucide-react'
import { createContext, PropsWithChildren, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DayOfWeekEnum, recurringScheduleSchema } from '@/schemas/recurringSchedule'
import { RecurringSchedule } from '@/types/models/recurringSchedule'
import { SpecialSchedule } from '@/types/models/specialSchedule'
import { getFormattedDate } from '@/schemas/sharedValidators/dateString'
import { specialScheduleSchema } from '@/schemas/specialSchedule'
import { Route as BarberShopSchedulesRoute } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'

type RouteSearchParams = NonNullable<typeof BarberShopSchedulesRoute.types.searchSchema['open']>

type Action = RouteSearchParams['action']
type ScheduleType = RouteSearchParams['scheduleType']

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
  } as const satisfies Record<typeof action, any>

  return infos[action]
}

type BarberShopRecurringScheduleFormType = {
  scheduleType: ScheduleType & 'recurring'
  action: Action

  formId: string
  barberShopId: number

  form: ReturnType<typeof useForm<RecurringSchedule>>

  doStuff: <TArgs extends Parameters<Parameters<ReturnType<typeof useForm<RecurringSchedule>>['handleSubmit']>[0]>, >(...args: TArgs) => Promise<{ message: string }>
}

type BarberShopSpecialScheduleFormType = {
  scheduleType: ScheduleType & 'special'
  action: Action

  formId: string
  barberShopId: number

  form: ReturnType<typeof useForm<SpecialSchedule>>

  doStuff: <TArgs extends Parameters<Parameters<ReturnType<typeof useForm<SpecialSchedule>>['handleSubmit']>[0]>, >(...args: TArgs) => Promise<{ message: string }>
}

type PartialBarberShopScheduleFormType = BarberShopRecurringScheduleFormType | BarberShopSpecialScheduleFormType

type BarberShopScheduleFormType = PartialBarberShopScheduleFormType & ReturnType<typeof getDialogInfos>

const BarberShopScheduleFormContext = createContext<BarberShopScheduleFormType | null>(null)

function BarberShopScheduleFormProvider({ children }: PropsWithChildren) {
  const { barberShopId } = BarberShopSchedulesRoute.useParams()

  const { action, scheduleType, date, dayOfWeek } = BarberShopSchedulesRoute.useSearch({
    select: (s) => s.open!,
  })

  const [recurringSchedule, specialSchedule] = BarberShopSchedulesRoute.useLoaderData({
    select: (s) => [
      s.recurringSchedules.find(schedule => dayOfWeek !== undefined && schedule.dayOfWeek === dayOfWeek),
      s.specialSchedules.find(schedule => date !== undefined && schedule.date === date),
    ] as const
  })

  // const schedule = BarberShopSchedulesRoute.useLoaderData({
  //   select: (s) => {
  //     switch (scheduleType) {
  //       case 'recurring':
  //         return s.recurringSchedules.find(schedule => schedule.dayOfWeek === dayOfWeek)
  //       case 'special':
  //         return s.specialSchedules.find(schedule => schedule.date === date)
  //       default:
  //         return undefined
  //     }
  //   }
  // })

  const methods = BarberShopSchedulesRoute.useRouteContext({
    select: ({ recurring, special }) => ({ recurring, special } as const)
  })

  function isRecurringSchedule(scheduleee: typeof schedule): scheduleee is RecurringSchedule {
    return scheduleType === 'recurring' && (scheduleee === undefined || 'dayOfWeek' in scheduleee)
  }

  function isSpecialSchedule(scheduleee: typeof schedule): scheduleee is SpecialSchedule {
    return scheduleType === 'special' && (scheduleee === undefined || 'date' in scheduleee)
  }

  const formId = `form_${action}_${barberShopId}_${scheduleType}`

  const schema = scheduleType === 'recurring' ? recurringScheduleSchema : specialScheduleSchema
  const resolver = action === 'REMOVE' ? undefined : zodResolver(schema)

  const defaultValues = scheduleType === 'recurring'
    ? {
      dayOfWeek: recurringSchedule?.dayOfWeek ?? DayOfWeekEnum.SEGUNDA,
      openTime: recurringSchedule?.openTime ?? undefined,
      closeTime: recurringSchedule?.closeTime ?? undefined,
    } : {
      date: specialSchedule?.date ? getFormattedDate(specialSchedule.date) as SpecialSchedule['date'] : undefined,
      notes: specialSchedule?.notes ?? undefined,
      openTime: specialSchedule?.openTime ?? undefined,
      closeTime: specialSchedule?.closeTime ?? undefined,
      isClosed: specialSchedule?.isClosed ?? false,
    }

  if (scheduleType === 'recurring') {
    return (
      <BarberShopScheduleFormContext.Provider
        value={{
          scheduleType,
          action, barberShopId, formId,
          ...getDialogInfos(action),
          form: useForm<RecurringSchedule>({
            resolver: action === 'REMOVE' ? undefined : zodResolver(recurringScheduleSchema),
            defaultValues: {
              dayOfWeek: specialSchedule?.dayOfWeek ?? DayOfWeekEnum.SEGUNDA,
              openTime: specialSchedule?.openTime ?? undefined,
              closeTime: specialSchedule?.closeTime ?? undefined,
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
          action, barberShopId, formId,
          ...getDialogInfos(action),
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

        {state.open && state.scheduleType === 'recurring' && (
          <FormRecurringSchedule
            {...state}
            closeModal={closeModal}
            setLoadingState={setLoadingState}
          />
        )}

        {state.open && state.scheduleType === 'special' && (
          <FormSpecialSchedule
            {...state}
            closeModal={closeModal}
            setLoadingState={setLoadingState}
          />
        )}

        <BarberShopScheduleForm />

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
  const { open } = BarberShopSchedulesRoute.useSearch()

  if (!open) {
    return null
  }

  return (
    <BarberShopScheduleFormProvider>
      <DialogItself />
    </BarberShopScheduleFormProvider>
  )
}
