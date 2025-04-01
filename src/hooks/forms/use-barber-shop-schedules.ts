import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-contexts'
import { CloseTimeField, DayOfWeekField, OpenTimeField } from '@/components/forms/barber-shop-schedules/_form'
import { SubscribeButton } from '@/components/forms/default'

export const { useAppForm: useBarberShopSchedulesForm } = createFormHook({
  fieldComponents: {
    OpenTimeField,
    CloseTimeField,
    DayOfWeekField,
  },
  formComponents: {
    SubscribeButton
  },
  fieldContext,
  formContext,
})
