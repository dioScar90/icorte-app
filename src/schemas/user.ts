import { z } from 'zod'
import { passwordValidator } from './sharedValidators/passwordValidator'
import { emailValidator } from './sharedValidators/emailValidator'
import { phoneNumberValidator } from './sharedValidators/phoneNumberValidator'
import { profileSchema } from './profile'

export enum UserRolesEnum {
  Guest,
  Client,
  BarberShop,
  Admin,
}

// const roles = [
//   'Guest',
//   'Client',
//   'BarberShop',
//   'Admin',
// ] as const

export const userEmailUpdate = z.object({
  email: emailValidator(),
})

export type UserEmailUpdateZod = z.infer<typeof userEmailUpdate>

export const userPhoneNumberUpdate = z.object({
  phoneNumber: phoneNumberValidator(),
})

export type UserPhoneNumberUpdateZod = z.infer<typeof userPhoneNumberUpdate>

export const userPasswordUpdate = z.object({
  currentPassword: z.string(),
  newPassword: passwordValidator(),
})

export type UserPasswordUpdateZod = z.infer<typeof userPasswordUpdate>

export const userRegisterSchema = z.object({
  email: emailValidator(),
  password: passwordValidator(),
  confirmPassword: z.string().min(1, { message: 'Confirmação de senha obrigatória' }),
  profile: profileSchema,
})
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Senhas devem ser iguais',
    path: ['confirmPassword']
  })

export type UserRegisterZod = z.infer<typeof userRegisterSchema>

export const userUpdateSchema = z.object({
  profile: profileSchema,
})

export type UserUpdateZod = z.infer<typeof userUpdateSchema>

export const userLoginSchema = z.object({
  email: emailValidator(),
  password: z.string().min(1, { message: 'Senha obrigatória' }),
})

export type UserLoginZod = z.infer<typeof userLoginSchema>

export const userPhoneNumberSchema = z.object({
  phoneNumber: phoneNumberValidator()
})

export type UserPhoneNumberZod = z.infer<typeof userPhoneNumberSchema>
