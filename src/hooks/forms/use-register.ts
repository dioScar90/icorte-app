import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-contexts'
import {
  RegisterEmailField,
  RegisterPhoneNumberField,
  RegisterGenderField,
  RegisterFirstNameField,
  RegisterLastNameField,
  RegisterPasswordField,
  RegisterConfirmPasswordField,
  RegisterSubscribeButton,
  RegisterSubscribeWithGoogleButton
} from '@/components/forms/register/_form'

export const { useAppForm: useRegisterForm } = createFormHook({
  fieldComponents: {
    RegisterEmailField,
    RegisterPhoneNumberField,
    RegisterGenderField,
    RegisterFirstNameField,
    RegisterLastNameField,
    RegisterPasswordField,
    RegisterConfirmPasswordField,
  },
  formComponents: {
    RegisterSubscribeButton,
    RegisterSubscribeWithGoogleButton,
  },
  fieldContext,
  formContext,
})
