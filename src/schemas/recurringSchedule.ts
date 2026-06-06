import { z } from 'zod'
import { getStringAsTimeString } from './sharedValidators/timeString'
import { nativeEnumValidator } from './sharedValidators/nativeEnumValidator'

export const daysOfWeek = [
  'DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO',
] as const

const dayOfWeek = nativeEnumValidator(daysOfWeek, 'Dia da semana inválido')

export const recurringScheduleSchema = z.object({
  dayOfWeek,

  openTime: z.string({ error: 'Horário de abertura obrigatório' })
    .time('Horário de abertura inválido')
    .transform(getStringAsTimeString),

  closeTime: z.string({ error: 'Horário de encerramento obrigatório' })
    .time('Horário de encerramento inválido')
    .transform(getStringAsTimeString),
})
  .refine(({ openTime, closeTime }) => closeTime > openTime, {
    message: 'Horário de encerramento precisa ser superior ao horário de abertura',
    path: ['closeTime']
  })

export type RecurringScheduleZod = z.infer<typeof recurringScheduleSchema>
