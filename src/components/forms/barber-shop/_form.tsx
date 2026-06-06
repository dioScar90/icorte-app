import { useStore } from '@tanstack/react-form'

import { useFieldContext } from '@/hooks/forms/form-contexts'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Activity, type ComponentProps } from 'react'
import { ErrorMessages, Select, TextField } from '../default'
import { Mask } from '@/utils/mask'

export function NameField({ label, placeholder, disabled, ...rest }: ComponentProps<typeof TextField>) {
  return <TextField label={label ?? 'Nome'} placeholder={placeholder ?? 'Nome'} disabled={disabled} {...rest} />
}

export function DescriptionField({ label, placeholder, disabled, ...rest }: ComponentProps<typeof TextField>) {
  return <TextField label={label ?? 'Descrição'} placeholder={placeholder ?? 'Opcional. Ex.: A sua barbearia...'} disabled={disabled} {...rest} />
}

export function ComercialNumberField() {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor="Telefone Comercial" className="mb-2 text-xl font-bold">
        Telefone Comercial
      </Label>
      <Input
        type="tel"
        value={field.state.value}
        placeholder="Telefone Comercial"
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(Mask.PHONE_NUMBER(e.target.value))}
      />
      <Activity mode={field.state.meta.isTouched ? 'visible' : 'hidden'}>
        <ErrorMessages errors={errors} />
      </Activity>
    </div>
  )
}

export function ComercialEmailField() {
  return <TextField type="email" label="Email Comercial" placeholder="Email Comercial" />
}

export function StreetField() {
  return <TextField label="Rua" placeholder="Rua" />
}

export function NumberField() {
  return <TextField label="Número" inputMode="numeric" placeholder="Número" />
}

export function ComplementField() {
  return <TextField label="Complemento" placeholder="Complemento" />
}

export function NeighborhoodField() {
  return <TextField label="Bairro" placeholder="Bairro" />
}

export function CityField() {
  return <TextField label="Bairro" placeholder="Bairro" />
}

export function StateField({ baseEnum }: Pick<ComponentProps<typeof Select>, 'baseEnum'>) {
  return (
    <Select
      baseEnum={baseEnum}
      label="Estado"
    />
  )
}

export function PostalCodeField() {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor="CEP" className="mb-2 text-xl font-bold">
        CEP
      </Label>
      <Input
        inputMode="numeric"
        value={field.state.value}
        placeholder="CEP"
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(Mask.CEP(e.target.value))}
      />
      <Activity mode={field.state.meta.isTouched ? 'visible' : 'hidden'}>
        <ErrorMessages errors={errors} />
      </Activity>
    </div>
  )
}

export function CountryField() {
  return <TextField label="País" placeholder="País" />
}
