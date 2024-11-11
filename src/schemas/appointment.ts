import { getToday } from '@/utils/date'
import { Prettify } from '@/utils/types/prettify'
import { z } from 'zod'

function dataIsEqualOrGreaterThenToday(informedDate: string) {
  const todayDate = getToday({ isDateIso: true }) as string
  return informedDate >= todayDate
}

export const appointmentSchema = z.object({
  date: z.string({ required_error: 'Data do agendamento obrigatória' })
    .trim()
    .date('Data do agendamento inválida')
    .refine(dataIsEqualOrGreaterThenToday, { message: 'Data do agendamento precisa ser maior ou igual à data de hoje' }),

  startTime: z.string({ required_error: 'Horário de início obrigatório' })
    .time('Horário de início inválido'),

  notes: z.string()
    .trim()
    .optional()
    .or(z.literal(''))
    .transform(value => value || undefined),
})

export type AppointmentZod = z.infer<typeof appointmentSchema>
export type AppointmentType = Prettify<AppointmentZod>
