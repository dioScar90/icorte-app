import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BarberShopServiceForm } from './_form'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import { type PropsWithChildren } from 'react'
import { ServiceFormContext, useInitValuesServiceFormContext, useServiceFormContext } from './_useServicesForm'
import { Route } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/services'

function BarberShopServiceFormProvider({ children }: PropsWithChildren) {
  const values = useInitValuesServiceFormContext()
  
  return (
    <ServiceFormContext.Provider
      value={{
        ...values
      }}
    >
      {children}
    </ServiceFormContext.Provider>
  )
}

function FormSubmitButton() {
  const { formId, form, submitBtnInfos } = useServiceFormContext()

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
  const { dialogInfos } = useServiceFormContext()
  
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogInfos.title}</DialogTitle>
          <DialogDescription>
            {dialogInfos.description}
          </DialogDescription>
        </DialogHeader>

        <BarberShopServiceForm />
        
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

export function BarberShopServiceDialog() {
  const { open } = Route.useSearch()

  if (!open) {
    return null
  }
  
  return (
    <BarberShopServiceFormProvider>
      <DialogItself />
    </BarberShopServiceFormProvider>
  )
}
