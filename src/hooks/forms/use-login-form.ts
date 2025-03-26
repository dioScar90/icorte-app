import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-contexts'
import { LoginEmailField, LoginPasswordField, LoginSubscribeButton } from '@/components/forms/login/_form'

export const { useAppForm: useLoginForm } = createFormHook({
  fieldComponents: {
    LoginEmailField,
    LoginPasswordField,
  },
  formComponents: {
    LoginSubscribeButton,
  },
  fieldContext,
  formContext,
})
