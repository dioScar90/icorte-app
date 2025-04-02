import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-contexts'
import { DateField, NotesField, CloseTimeField, IsClosedField, DayOfWeekField, OpenTimeField } from '@/components/forms/barber-shop-schedules/_form-fields'
import { SubscribeButton } from '@/components/forms/default'

export const { useAppForm: useBarberShopSchedulesForm } = createFormHook({
  fieldComponents: {
    DateField,
    NotesField,
    OpenTimeField,
    CloseTimeField,
    IsClosedField,
    DayOfWeekField,
  },
  formComponents: {
    SubscribeButton
  },
  fieldContext,
  formContext,
})
