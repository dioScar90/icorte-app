import { useStore } from '@tanstack/react-form'

import { useFieldContext } from '@/hooks/forms/form-contexts'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Activity, type ComponentProps } from 'react'
import { ErrorMessages, Switch, Select, TextField } from '../default'
import { Mask } from '@/utils/mask'
import { navigateToEndAfterFocus } from "@/utils/cursor-end-of-input"

export function DateField({ label, placeholder, disabled }: { label: string, placeholder: string, disabled?: boolean }) {
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
          field.handleChange(Mask.DATE_ISO(e.currentTarget.value))
          e.currentTarget.focus()
        }}
        onFocus={navigateToEndAfterFocus}
        disabled={disabled}
      />
      <Activity mode={field.state.meta.isTouched ? 'visible' : 'hidden'}>
        <ErrorMessages errors={errors} />
      </Activity>
    </div>
  )
}

export function NotesField({ disabled }: { disabled?: boolean }) {
  return <TextField label="Descrição" placeholder="Descrição (opcional)" disabled={disabled} />
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
          field.handleChange(Mask.TIME_ONLY(e.currentTarget.value))
          e.currentTarget.focus()
        }}
        onFocus={navigateToEndAfterFocus}
        disabled={disabled}
      />
      <Activity mode={field.state.meta.isTouched ? 'visible' : 'hidden'}>
        <ErrorMessages errors={errors} />
      </Activity>
    </div>
  )
}

export function OpenTimeField({ disabled }: { disabled?: boolean }) {
  return <BaseTimeField label="Hora de abertura" placeholder="08:00:00" disabled={disabled} />
}

export function CloseTimeField({ disabled }: { disabled?: boolean }) {
  return <BaseTimeField label="Hora de fechamento" placeholder="18:00:00" disabled={disabled} />
}

export function IsClosedField({ disabled }: { disabled?: boolean }) {
  return <Switch label="Barbearia Fechada" description="Caso queira fechar nesse dia" disabled={disabled} />
}

export function DayOfWeekField({ baseEnum, disabled }: Pick<ComponentProps<typeof Select>, 'baseEnum'> & { disabled?: boolean }) {
  return (
    <Select
      baseEnum={baseEnum}
      label="Dia da Semana"
      disabled={disabled}
    />
  )
}
