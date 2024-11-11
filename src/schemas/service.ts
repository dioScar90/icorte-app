import { z } from 'zod'
import { getStringAsTimeOnly } from './sharedValidators/timeOnly'

export const serviceSchema = z.object({
  name: z.string({ required_error: 'Nome obrigatório' })
    .trim()
    .min(3, { message: 'Nome precisa ter pelo menos 3 caracteres' }),

  description: z.string({ required_error: 'Descrição obrigatória' })
    .trim()
    .min(3, { message: 'Descrição precisa ter pelo menos 3 caracteres' }),

  price: z.coerce.number({ required_error: 'Preço obrigatório' })
    .positive('Preço precisa ser maior que R$ 0,00'),

  duration: z.string({ required_error: 'Duração obrigatória' })
    .time('Duração inválida')
    .transform(getStringAsTimeOnly),
})

export type ServiceZod = z.infer<typeof serviceSchema>
