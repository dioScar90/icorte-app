import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormNewAppointment } from './_form'
import { Button } from '@/components/ui/button'
import { Scissors } from 'lucide-react'
import { useSearch } from '@tanstack/react-router'
import { createContext, type PropsWithChildren, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { appointmentSchema, type AppointmentZod } from '@/schemas/appointment'

type ContextType = {
  formId: string
  barberShopId: number
  defaultServiceId: number
  form: ReturnType<typeof useForm<AppointmentZod>>
}

const DialogContext = createContext<ContextType | null>(null)

function DialogProvider({ children, barberShopId, defaultServiceId }: PropsWithChildren<Pick<ContextType, 'barberShopId' | 'defaultServiceId'>>) {
  const form = useForm<AppointmentZod>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: undefined,
      startTime: undefined,
      paymentType: undefined,
      notes: undefined,
      serviceIds: [defaultServiceId],
    }
  })

  const formId = `form_${barberShopId}_${defaultServiceId}`
  
  return (
    <DialogContext.Provider
      value={{ barberShopId, defaultServiceId, formId, form }}
    >
      {children}
    </DialogContext.Provider>
  )
}

export const useDialogContext = () => useContext(DialogContext)!

function DialogSubmitButton() {
  const { form, formId } = useDialogContext()
  
  return (
    <Button
      type="submit"
      form={formId}
      isLoading={form.formState.isSubmitting}
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
  const newAppointment = useSearch({
    from: '/(authenticated-only)/barber-schedule/new-appointment',
    select: (s) => s.newAppointment,
  })

  if (!newAppointment?.barberShopId || !newAppointment?.defaultServiceId) {
    return null
  }
  
  return (
    <DialogProvider { ...newAppointment }>
      <DialogItself />
    </DialogProvider>
  )
}
