import { z } from 'zod'

const DayOfWeekEnumAsConst = [
  'DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO',
] as const

export const recurringScheduleSchema = z.object({
  dayOfWeek: z.enum(DayOfWeekEnumAsConst, {
    required_error: 'Dia da semana obrigatório',
    message: 'Dia da semana inválido',
  }),
  
  openTime: z.string({ required_error: 'Horário de abertura obrigatório' })
    .trim()
    .time('Horário de abertura inválido'),

  closeTime: z.string({ required_error: 'Horário de encerramento obrigatório' })
    .trim()
    .time('Horário de encerramento inválido'),
})
  .refine(({ openTime, closeTime }) => closeTime > openTime, {
    message: 'Horário de encerramento precisa ser superior ao horário de abertura',
    path: ['closeTime']
  })

export type RecurringScheduleType = z.infer<typeof recurringScheduleSchema>
