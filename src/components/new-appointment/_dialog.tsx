import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { FormNewAppointment } from './_form'
import { Button } from '../ui/button'
import { Scissors } from 'lucide-react'
import { useSearch } from '@tanstack/react-router'
import { createContext, PropsWithChildren, useContext, useState } from 'react'

type ContextType = {
  formId: string
  barberShopId: number
  defaultServiceId: number
  isLoading: boolean
  setIsLoading: (arg: boolean) => void
}

const DialogContext = createContext<ContextType | null>(null)

function DialogProvider({ children, ...rest }: PropsWithChildren<Omit<ContextType, 'isLoading' | 'setIsLoading'>>) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <DialogContext.Provider value={{ isLoading, setIsLoading, ...rest }}>
      {children}
    </DialogContext.Provider>
  )
}

export const useDialogContext = () => useContext(DialogContext)!

function DialogSubmitButton() {
  const { formId, isLoading } = useDialogContext()

  return (
    <Button
      type="submit"
      form={formId}
      isLoading={isLoading}
      IconLeft={<Scissors />}
    >
      Agendar
    </Button>
  )
}

function DialogItself() {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar horário</DialogTitle>
        </DialogHeader>
        
        <FormNewAppointment />
        
        <DialogFooter className="grid grid-cols-2 md:flex md:justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          
          <DialogSubmitButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DialogNewAppointment() {
  const { barberShopId, defaultServiceId } = useSearch({
    from: '/(authenticated-only)/barber-schedule/new-appointment',
    select: (s) => s.newAppointment!,
  })

  if (!barberShopId || !defaultServiceId) {
    return null
  }

  const formId = `form_${barberShopId}`
  
  return (
    <DialogProvider
      formId={formId}
      barberShopId={barberShopId}
      defaultServiceId={defaultServiceId}
    >
      <DialogItself />
    </DialogProvider>
  )
}
