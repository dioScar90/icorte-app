import { z } from 'zod'
import { postalCodeValidator } from './sharedValidators/postalCodeValidator'
import { nativeEnumValidator } from './sharedValidators/nativeEnumValidator'

export const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const

const state = nativeEnumValidator(states, 'Estado inválido')
const postalCode = postalCodeValidator()

export const addressSchema = z.object({
  street: z.string({ error: 'Logradouro obrigatório' })
    .trim()
    .min(3, { message: 'Logradouro precisa ter pelo menos 3 caracteres' }),

  number: z.string({ error: 'Número obrigatório' }).trim(),

  complement: z.string()
    .trim()
    .min(3, { message: 'Complemento precisa ter pelo menos 3 caracteres' })
    .optional()
    .or(z.literal(''))
    .transform(value => value || undefined),

  neighborhood: z.string({ error: 'Bairro obrigatório' })
    .trim()
    .min(3, { message: 'Bairro precisa ter pelo menos 3 caracteres' }),

  city: z.string({ error: 'Cidade obrigatória' })
    .trim()
    .min(3, { message: 'Cidade precisa ter pelo menos 3 caracteres' }),

  state,
  postalCode,

  country: z.string({ error: 'País obrigatório' })
    .trim()
    .min(3, { message: 'País precisa ter 8 caracteres' }),
})

export type AddressZod = z.infer<typeof addressSchema>
