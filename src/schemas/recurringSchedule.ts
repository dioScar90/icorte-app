import { z } from 'zod'
import { getStringAsTimeString } from './sharedValidators/timeString'

export enum DayOfWeekEnum {
  DOMINGO, SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SÁBADO
}

const DayOfWeekEnumAsConst = [
  'DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO',
] as const

export const recurringScheduleSchema = z.object({
  dayOfWeek: z.enum(DayOfWeekEnumAsConst, {
    required_error: 'Dia da semana obrigatório',
    message: 'Dia da semana inválido',
  })
    .transform(day => DayOfWeekEnum[day]),

  openTime: z.string({ required_error: 'Horário de abertura obrigatório' })
    .time('Horário de abertura inválido')
    .transform(getStringAsTimeString),

  closeTime: z.string({ required_error: 'Horário de encerramento obrigatório' })
    .time('Horário de encerramento inválido')
    .transform(getStringAsTimeString),
})
  .refine(({ openTime, closeTime }) => closeTime > openTime, {
    message: 'Horário de encerramento precisa ser superior ao horário de abertura',
    path: ['closeTime']
  })

export type RecurringScheduleZod = z.infer<typeof recurringScheduleSchema>
