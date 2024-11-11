import { z } from 'zod'
import { phoneNumberValidator } from './sharedValidators/phoneNumberValidator'
import { emailValidator } from './sharedValidators/emailValidator'
import { addressSchema } from './address'

export const barberShopSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: 'Nome obrigatório' })
    .min(3, { message: 'Nome precisa ter pelo menos 3 caracteres' })
    .max(50, { message: 'Nome precisa ter no máximo 100 caracteres' }),

  description: z.string()
    .trim()
    .min(3, { message: 'Descrição precisa ter pelo menos 3 caracteres' })
    .max(100, { message: 'Descrição precisa ter no máximo 100 caracteres' })
    .optional()
    .or(z.literal(''))
    .transform(value => value || undefined),

  comercialNumber: phoneNumberValidator('Telefone comercial'),
  comercialEmail: emailValidator('Email comercial'),

  address: addressSchema,
})

export type BarberShopZod = z.infer<typeof barberShopSchema>
