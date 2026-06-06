import { z } from 'zod'
import { phoneNumberValidator } from './sharedValidators/phoneNumberValidator'
import { nativeEnumValidator } from './sharedValidators/nativeEnumValidator'

export const genders = [
  'Feminino',
  'Masculino',
] as const

const gender = nativeEnumValidator(genders, 'Gênero inválido')
const phoneNumber = phoneNumberValidator()

export const profileSchema = z.object({
  firstName: z.string({ error: 'Nome obrigatório' })
    .trim()
    .min(3, { message: 'Nome precisa ter pelo menos 3 caracteres' }),

  lastName: z.string({ error: 'Sobrenome obrigatório' })
    .trim()
    .min(3, { message: 'Sobrenome precisa ter pelo menos 3 caracteres' }),
    
  gender,
  phoneNumber,
})

export type ProfileZod = z.infer<typeof profileSchema>
