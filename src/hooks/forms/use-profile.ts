import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-contexts'
import {
  RegisterFirstNameField,
  RegisterLastNameField,
  RegisterGenderField,
  RegisterPhoneNumberField,
} from '@/components/forms/register/_form'
import { SubscribeButton } from '@/components/forms/default'

export const { useAppForm: useProfileForm } = createFormHook({
  fieldComponents: {
    RegisterFirstNameField,
    RegisterLastNameField,
    RegisterGenderField,
    RegisterPhoneNumberField,
  },
  formComponents: {
    SubscribeButton
  },
  fieldContext,
  formContext,
})
