import { z } from 'zod'

// const isValidPostalCode = (value: string) => /^\d{5}-\d{3}$/.test(value) // xxxxxxxx
const isValidPostalCode = (value: string) => /^\d{5}-\d{3}$/.test(value) // xxxxx-xxx

export function postalCodeValidator(messageIdentifier?: string) {
  const NumTelefone = messageIdentifier ?? "CEP"

  return z.string()
    .min(1, { message: `${NumTelefone} obrigatório` })
    .refine(isValidPostalCode, { message: `${NumTelefone} precisa estar no formato xxxxx-xxx` })
    .transform(value => value.replace(/\D/g, ''))
}
