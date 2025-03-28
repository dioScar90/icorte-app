import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-contexts'
import { RegisterEmailField, RegisterPasswordField, RegisterSubscribeButton } from '@/components/forms/register/_form'

export const { useAppForm: useLoginForm } = createFormHook({
  fieldComponents: {
    RegisterEmailField,
    RegisterPasswordField,
  },
  formComponents: {
    RegisterSubscribeButton,
  },
  fieldContext,
  formContext,
})
