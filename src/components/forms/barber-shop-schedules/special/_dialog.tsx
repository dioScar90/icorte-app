import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BarberShopSpecialScheduleForm } from './_form'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import { type PropsWithChildren } from 'react'
import { useInitValuesSpecialScheduleFormContext, SpecialScheduleFormContext, useSpecialScheduleFormContext } from './_useScheduleForm'
import { Route } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'

function SpecialScheduleFormProvider({ children }: PropsWithChildren) {
  const values = useInitValuesSpecialScheduleFormContext()
  
  return (
    <SpecialScheduleFormContext.Provider
      value={{
        ...values
      }}
    >
      {children}
    </SpecialScheduleFormContext.Provider>
  )
}

function FormSubmitButton() {
  const { formId, submitBtnInfos, form } = useSpecialScheduleFormContext()

  return (
    <form.AppForm>
      <form.SubscribeButton
        variant={submitBtnInfos.variant}
        form={formId}
        label={submitBtnInfos.innerText}
        IconLeft={<ShoppingBag />}
      />
    </form.AppForm>
  )
}

function DialogItself() {
  const { dialogInfos } = useSpecialScheduleFormContext()

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogInfos.title}</DialogTitle>
          <DialogDescription>
            {dialogInfos.description}
          </DialogDescription>
        </DialogHeader>
        
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

export function BarberShopSpecialScheduleDialog() {
  const scheduleType = Route.useSearch({
    select: (s) => s.open?.scheduleType,
  })
  
  if (scheduleType !== 'special') {
    return null
  }
  
  return (
    <SpecialScheduleFormProvider>
      <DialogItself />
    </SpecialScheduleFormProvider>
  )
}
