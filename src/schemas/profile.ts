import { z } from 'zod'
import { phoneNumberValidator } from './sharedValidators/phoneNumberValidator'
import { Prettify } from '@/utils/types/prettify'

export const GenderEnumAsConst = ['Feminino', 'Masculino'] as const

export enum GenderEnum {
  // Deixar em pt-br mesmo, porque sim. Isso já foi testado, apenas aceite.
  Feminino,
  Masculino,
}

export const profileSchema = z.object({
  firstName: z.string({ required_error: 'Nome obrigatório' })
    .trim()
    .min(3, { message: 'Nome precisa ter pelo menos 3 caracteres' }),

  lastName: z.string({ required_error: 'Sobrenome obrigatório' })
    .trim()
    .min(3, { message: 'Sobrenome precisa ter pelo menos 3 caracteres' }),

  gender: z.enum(GenderEnumAsConst, { message: 'Gênero inválido' }),

  phoneNumber: phoneNumberValidator(),
})

export type ProfileZod = z.infer<typeof profileSchema>
export type ProfileType = Prettify<Omit<ProfileZod, 'gender'> & {
  gender: GenderEnum
}>
