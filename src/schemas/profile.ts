import { z, ZodEnum } from 'zod'
import { phoneNumberValidator } from './sharedValidators/phoneNumberValidator'
// import { getEnumAsArray } from '@/utils/enum-transformer'
import { nativeEnumValidator } from './sharedValidators/nativeEnumValidator'

// export enum GenderEnum {
//   Feminino,
//   Masculino,
// }

export const GenderEnum = [
  'Feminino',
  'Masculino',
] as const

const gender = nativeEnumValidator(GenderEnum, 'Gênero inválido')

export const profileSchema = z.object({
  firstName: z.string({ required_error: 'Nome obrigatório' })
    .trim()
    .min(3, { message: 'Nome precisa ter pelo menos 3 caracteres' }),

  lastName: z.string({ required_error: 'Sobrenome obrigatório' })
    .trim()
    .min(3, { message: 'Sobrenome precisa ter pelo menos 3 caracteres' }),
    
  // gender: z.enum(GenderEnum).optional()
  //   .refine(gen => gen !== undefined, { message: 'Gênero inválido' })
  //   // .transform(gen => GenderEnum[gen]),
  //   ,
    
  gender,

  phoneNumber: phoneNumberValidator(),
})

export type ProfileZod = z.infer<typeof profileSchema>

type aee = z.input<typeof profileSchema>['gender']
// console.log(aee)
