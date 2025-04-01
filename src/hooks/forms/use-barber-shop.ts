import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-contexts'
import {
  NameField,
  DescriptionField,
  ComercialNumberField,
  ComercialEmailField,
  StreetField,
  NumberField,
  ComplementField,
  NeighborhoodField,
  CityField,
  StateField,
  PostalCodeField,
  CountryField,
} from '@/components/forms/barber-shop/_form'
import { SubscribeButton } from '@/components/forms/default'

export const { useAppForm: useBarberShopForm } = createFormHook({
  fieldComponents: {
    NameField,
    DescriptionField,
    ComercialNumberField,
    ComercialEmailField,
    StreetField,
    NumberField,
    ComplementField,
    NeighborhoodField,
    CityField,
    StateField,
    PostalCodeField,
    CountryField,
  },
  formComponents: {
    SubscribeButton
  },
  fieldContext,
  formContext,
})
