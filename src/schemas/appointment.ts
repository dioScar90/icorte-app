import { z } from 'zod'
import { dataIsEqualOrGreaterThenToday, getStringAsDateString } from './sharedValidators/dateString'

export enum PaymentTypeEnum {
  Cartão,
  Dinheiro,
  Pix,
}

export const paymentTypeAsConst = [
  'Cartão',
  'Dinheiro',
  'Pix',
] as const

export const appointmentSchema = z.object({
  date: z.string({ error: 'Data do agendamento obrigatória' })
    .trim()
    .date('Data do agendamento inválida')
    // .refine(isValidDateString, { message: 'Data do agendamento inválida' })
    .refine(dataIsEqualOrGreaterThenToday, { message: 'Data do agendamento precisa ser maior ou igual à data de hoje' })
    .transform(getStringAsDateString),

  startTime: z.iso.time('Horário de início inválido'),

  paymentType: z.enum(paymentTypeAsConst, {
    error: (issues) => {
      return issues.code === 'invalid_value'
        ? 'Tipo de pagamento inválido'
        : 'Tipo de pagamento obrigatório'
    }
  })
    .transform(payment => PaymentTypeEnum[payment]),

  notes: z.string()
    .trim()
    .optional()
    .or(z.literal(''))
    .transform(value => value || undefined),

  serviceIds: z.array(
    z.number()
  )
    .min(1, 'É necessário marcar pelo menos um serviço')
})

export type AppointmentZod = z.infer<typeof appointmentSchema>
