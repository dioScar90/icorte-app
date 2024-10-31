import { z } from 'zod'
import { phoneNumberValidator } from './sharedValidators/phoneNumberValidator'

export enum Gender {
  Female,
  Male,
}

export const profileSchema = z.object({
  firstName: z.string({ required_error: 'Nome obrigatório' })
    .min(3, { message: 'Nome precisa ter pelo menos 3 caracteres' }),

  lastName: z.string({ required_error: 'Sobrenome obrigatório' })
    .min(3, { message: 'Sobrenome precisa ter pelo menos 3 caracteres' }),

  gender: z.enum(['Masculino', 'Feminino'], { message: 'Gênero inválido' })
    // .transform(value => value === 'Masculino' ? Gender.Male : Gender.Female)
    ,

  phoneNumber: phoneNumberValidator(),
})

export type ProfileForFormType = z.infer<typeof profileSchema>
export type ProfileType = Omit<ProfileForFormType, 'gender'> & {
  gender: Gender
}

// export type ProfileType = Omit<z.infer<typeof profileSchema>, 'gender'> & {
//   gender: Gender,
// }

const vamos: ProfileType = {
  firstName: 'Diogo',
  lastName: 'Scarmagnani',
  phoneNumber: '18988144394',
  gender: 1,
}
