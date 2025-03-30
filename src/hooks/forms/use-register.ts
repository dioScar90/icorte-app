import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-contexts'
import {
  RegisterEmailField,
  RegisterPhoneNumberField,
  RegisterFirstNameField,
  RegisterLastNameField,
  RegisterPasswordField,
  RegisterConfirmPasswordField,
  RegisterSubscribeButton,
  RegisterSubscribeWithGoogleButton
} from '@/components/forms/register/_form'
import { Select } from '@/components/forms/default'

export const { useAppForm: useRegisterForm } = createFormHook({
  fieldComponents: {
    RegisterEmailField,
    RegisterPhoneNumberField,
    RegisterFirstNameField,
    RegisterLastNameField,
    RegisterPasswordField,
    RegisterConfirmPasswordField,
    Select,
  },
  formComponents: {
    RegisterSubscribeButton,
    RegisterSubscribeWithGoogleButton,
  },
  fieldContext,
  formContext,
})
