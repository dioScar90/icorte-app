import { Prettify } from '@/utils/types/prettify'
import { z } from 'zod'

export enum StateEnum {
  AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA,
  PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO,
}

export const StateEnumAsConst = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const

export const addressSchema = z.object({
  street: z.string({ required_error: 'Logradouro obrigatório' })
    .trim()
    .min(3, { message: 'Logradouro precisa ter pelo menos 3 caracteres' }),

  number: z.string({ required_error: 'Número obrigatório' }).trim(),

  complement: z.string()
    .trim()
    .min(3, { message: 'Complemento precisa ter pelo menos 3 caracteres' })
    .optional()
    .or(z.literal(''))
    .transform(value => value || undefined),

  neighborhood: z.string({ required_error: 'Bairro obrigatório' })
    .trim()
    .min(3, { message: 'Bairro precisa ter pelo menos 3 caracteres' }),

  city: z.string({ required_error: 'Cidade obrigatória' })
    .trim()
    .min(3, { message: 'Cidade precisa ter pelo menos 3 caracteres' }),

  state: z.enum(StateEnumAsConst, {
    required_error: 'Estado obrigatório',
    message: 'Estado inválido',
  }),

  postalCode: z.string({ required_error: 'CEP obrigatório' })
    .trim()
    .length(8, { message: 'CEP precisa ter 8 dígitos' }),

  country: z.string({ required_error: 'País obrigatório' })
    .trim()
    .min(3, { message: 'País precisa ter 8 caracteres' }),
})

export type AddressZod = z.infer<typeof addressSchema>
export type Address = Prettify<Omit<AddressZod, 'state'> & {
  state: StateEnum
}>
