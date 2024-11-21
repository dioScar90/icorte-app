import { z } from 'zod'

// const isValidPhoneNumber = (value: string) => /^\d{2}9\d{8}$/.test(value) // xx9xxxxxxxx
const isValidPhoneNumber = (value: string) => /^\(\d{2}\) 9\d{4}-\d{4}$/.test(value) // (xx) 9xxxx-xxxx

export function phoneNumberValidator(messageIdentifier?: string) {
  const NumTelefone = messageIdentifier ?? "Telefone"

  return z.string()
    .min(1, { message: `${NumTelefone} obrigatório` })
    .refine(isValidPhoneNumber, { message: `${NumTelefone} precisa estar no formato (xx) 9xxxx-xxxx` })
    .transform(value => value.replace(/\D/g, ''))
}
