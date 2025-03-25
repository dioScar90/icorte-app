import { createFormHook } from '@tanstack/react-form'

import {
  Select,
  SubscribeButton,
  TextArea,
  TextField,
} from '@/components/forms/default'
import { fieldContext, formContext } from './form-contexts'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})
