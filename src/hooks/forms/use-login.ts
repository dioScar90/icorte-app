import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-contexts'
import {
  RegisterEmailField as LoginEmailField,
  RegisterPasswordField as LoginPasswordField,
  RegisterSubscribeButton as LoginSubscribeButton,
  RegisterSubscribeWithGoogleButton as LoginSubscribeWithGoogleButton,
} from '@/components/forms/register/_form'

export const { useAppForm: useLoginForm } = createFormHook({
  fieldComponents: {
    LoginEmailField,
    LoginPasswordField,
  },
  formComponents: {
    LoginSubscribeButton,
    LoginSubscribeWithGoogleButton,
  },
  fieldContext,
  formContext,
})
