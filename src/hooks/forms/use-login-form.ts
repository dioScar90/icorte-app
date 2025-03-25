import { createFormHook } from '@tanstack/react-form'

// import {
//   TextField,
// } from '@/components/forms/default'
import { fieldContext, formContext } from './form-contexts'
import { LoginEmailField, LoginPasswordField, LoginSubscribeButton } from '@/components/forms/login/_form'

export const { useAppForm: useLoginForm } = createFormHook({
  fieldComponents: {
    // TextField,
    LoginEmailField,
    LoginPasswordField,
  },
  formComponents: {
    LoginSubscribeButton,
  },
  fieldContext,
  formContext,
})
