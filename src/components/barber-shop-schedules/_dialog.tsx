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
import { getFormattedDate } from '@/schemas/sharedValidators/dateOnly'
import { specialScheduleSchema } from '@/schemas/specialSchedule'
import { Route as BarberShopSchedulesRoute } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'

type BarberShopSchedulesSearchParams = NonNullable<typeof BarberShopSchedulesRoute.types.searchSchema['open']>

function getDialogInfos(action: BarberShopSchedulesSearchParams['action']) {
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

type BarberShopScheduleFormType<
  TSchedule extends BarberShopSchedulesSearchParams['scheduleType'] = BarberShopSchedulesSearchParams['scheduleType'],
  TSchema extends RecurringSchedule | SpecialSchedule = TSchedule extends 'recurring' ? RecurringSchedule : SpecialSchedule,
  TForm extends ReturnType<typeof useForm<TSchema>> = ReturnType<typeof useForm<TSchema>>,
  TDoStuff = <TArgs extends Parameters<Parameters<TForm['handleSubmit']>[0]>,>(...args: TArgs) => Promise<{ message: string }>,
> = {
  action: BarberShopSchedulesSearchParams['action']
  
  formId: string
  barberShopId: number
  scheduleType: TSchedule
  
  form: TForm

  doStuff: TDoStuff
} & ReturnType<typeof getDialogInfos>

const BarberShopScheduleFormContext = createContext<BarberShopScheduleFormType | null>(null)

function BarberShopScheduleFormProvider({ children }: PropsWithChildren) {
  const { barberShopId } = BarberShopSchedulesRoute.useParams()

  const { action, scheduleType, date, dayOfWeek } = BarberShopSchedulesRoute.useSearch({
    select: (s) => s.open!,
  })

  const schedule = BarberShopSchedulesRoute.useLoaderData({
    select: (s) => {
      switch (scheduleType) {
        case 'recurring':
          return s.recurringSchedules.find(schedule => schedule.dayOfWeek === dayOfWeek!)
        case 'special':
          const dateOnly = date?.toISOString().split('T')[0]
          return s.specialSchedules.find(schedule => schedule.date === dateOnly)
        default:
          return undefined
      }
    }
  })
  
  const methods = BarberShopSchedulesRoute.useRouteContext({
    select: ({ recurring, special }) => ({ recurring, special } as const)
  })

  function isRecurringSchedule(scheduleee: typeof schedule): scheduleee is RecurringSchedule {
    return scheduleType === 'recurring' && (scheduleee === undefined || 'dayOfWeek' in scheduleee)
  }
  
  const formId = `form_${action}_${barberShopId}_${scheduleType}_${serviceId ?? ''}`

  const schema = scheduleType === 'recurring' ? recurringScheduleSchema : specialScheduleSchema
  const resolver = action === 'REMOVE' ? undefined : zodResolver(schema)

  const defaultValues = isRecurringSchedule(schedule)
    ? {
      dayOfWeek: schedule?.dayOfWeek ?? DayOfWeekEnum.SEGUNDA,
      openTime: schedule?.openTime ?? undefined,
      closeTime: schedule?.closeTime ?? undefined,
    } : {
      date: schedule?.date ? getFormattedDate(schedule.date) as SpecialSchedule['date'] : undefined,
      notes: schedule?.notes ?? undefined,
      openTime: schedule?.openTime ?? undefined,
      closeTime: schedule?.closeTime ?? undefined,
      isClosed: schedule?.isClosed ?? false,
    }
    
  return (
    <BarberShopScheduleFormContext.Provider
      value={{
        action, barberShopId, scheduleType, formId,
        ...getDialogInfos(action),
        form: useForm<typeof scheduleType extends 'recurring' ? RecurringSchedule : SpecialSchedule>({
          resolver,
          defaultValues,
        }),
        doStuff: async (values) => {
          const infos = {
            REGISTER: {
              recurring: {
                method: () => methods.recurring.register(barberShopId, values),
                defaultMessage: 'Serviço criado com sucesso',
              },
              special: {
                method: () => methods.special.register(barberShopId, values),
                defaultMessage: 'Serviço criado com sucesso',
              },
            },
            UPDATE: {
              recurring: {
                method: () => methods.recurring.update(barberShopId, dayOfWeek!, values),
                defaultMessage: 'Serviço atualizado com sucesso',
              },
              special: {
                method: () => methods.special.update(barberShopId, data!, values),
                defaultMessage: 'Serviço atualizado com sucesso',
              },
            },
            REMOVE: {
              recurring: {
                method: () => methods.recurring.remove(barberShopId, dayOfWeek!),
                defaultMessage: 'Serviço removido com sucesso',
              },
              special: {
                method: () => methods.special.remove(barberShopId, data!),
                defaultMessage: 'Serviço removido com sucesso',
              },
            },
          } as const
          
          const { method, defaultMessage } = infos[action][scheduleType]
      
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
  
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogInfos.title}</DialogTitle>
          <DialogDescription>
            {dialogInfos.description}
          </DialogDescription>
        </DialogHeader>

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
