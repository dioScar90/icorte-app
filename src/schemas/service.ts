import { z } from 'zod'
import { getStringAsTimeString } from './sharedValidators/timeString'
import { isBrMoneyGreaterThenZero, isValidBrlMoney } from './sharedValidators/brlMoney'

export const serviceSchema = z.object({
  name: z.string({ error: 'Nome obrigatório' })
    .trim()
    .min(3, { message: 'Nome precisa ter pelo menos 3 caracteres' }),

  description: z.string({ error: 'Descrição obrigatória' })
    .trim()
    .min(3, { message: 'Descrição precisa ter pelo menos 3 caracteres' }),

  price: z.string({ error: 'Preço obrigatório' })
    .refine(isValidBrlMoney, { message: 'Preço inválido' })
    .refine(isBrMoneyGreaterThenZero, { message: 'Preço precisa ser maior que R$ 0,00' }),

  duration: z.string({ error: 'Duração obrigatória' })
    .time('Duração inválida')
    .transform(getStringAsTimeString),
})

export type ServiceZod = z.infer<typeof serviceSchema>
