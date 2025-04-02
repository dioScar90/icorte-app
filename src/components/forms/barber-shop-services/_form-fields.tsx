import { useStore } from '@tanstack/react-form'

import { useFieldContext } from '@/hooks/forms/form-contexts'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorMessages } from '../default'
import { applyMask } from '@/utils/mask'
import { navigateToEndAfterFocus } from "@/utils/cursor-end-of-input"
import type { ComponentProps } from 'react'

export function PriceField({ disabled }: { disabled?: boolean }) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  
  return (
    <div>
      <Label htmlFor="Preço" className="mb-2 text-xl font-bold">
        Preço
      </Label>
      <Input
        inputMode="decimal"
        placeholder="R$ 45,00"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => {
          field.handleChange(applyMask('MONEY', e.currentTarget.value))
          e.currentTarget.focus()
        }}
        onFocus={navigateToEndAfterFocus}
        disabled={disabled}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

function BaseTimeField({ label, placeholder, disabled }: { label: string, placeholder: string, disabled?: boolean }) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  
  return (
    <div>
      <Label htmlFor={label} className="mb-2 text-xl font-bold">
        {label}
      </Label>
      <Input
        inputMode="numeric"
        value={field.state.value}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        onChange={(e) => {
          field.handleChange(applyMask('TIME_ONLY', e.currentTarget.value))
          e.currentTarget.focus()
        }}
        onFocus={navigateToEndAfterFocus}
        disabled={disabled}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function DurationField(props: ComponentProps<typeof BaseTimeField>) {
  return <BaseTimeField {...props} />
}
