import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { PropsWithChildren } from 'react'
import { BarberShopRecurringScheduleForm } from './_form'
import { Button } from '../../ui/button'
import { ShoppingBag } from 'lucide-react'
import { useInitValuesRecurringScheduleFormContext, RecurringScheduleFormContext, useRecurringScheduleFormContext } from './_useScheduleForm'
import { Route } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'

function RecurringScheduleFormProvider({ children }: PropsWithChildren) {
  const values = useInitValuesRecurringScheduleFormContext()
  
  return (
    <RecurringScheduleFormContext.Provider
      value={{
        ...values
      }}
    >
      {children}
    </RecurringScheduleFormContext.Provider>
  )
}

function FormSubmitButton() {
  const { formId, submitBtnInfos, form } = useRecurringScheduleFormContext()

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
  const { dialogInfos } = useRecurringScheduleFormContext()

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

export function BarberShopRecurringScheduleDialog() {
  const scheduleType = Route.useSearch({
    select: (s) => s.open?.scheduleType,
  })
  
  if (scheduleType !== 'recurring') {
    return null
  }
  
  return (
    <RecurringScheduleFormProvider>
      <DialogItself />
    </RecurringScheduleFormProvider>
  )
}
