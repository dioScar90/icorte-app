import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-contexts'
import { SubscribeButton } from '@/components/forms/default'
import { DescriptionField, NameField } from '@/components/forms/barber-shop/_form'
import { DurationField, PriceField } from '@/components/forms/barber-shop-services/_form-fields'

export const { useAppForm: useBarberShopServicesForm } = createFormHook({
  fieldComponents: {
    NameField,
    DescriptionField,
    PriceField,
    DurationField,
  },
  formComponents: {
    SubscribeButton
  },
  fieldContext,
  formContext,
})
