import { z } from 'zod'
import { dataIsEqualOrGreaterThenToday, getStringAsDateOnly } from './sharedValidators/dateOnly'
import { serviceSchema } from './service'

export enum PaymentTypeEnum {
  Cartão,
  Dinheiro,
  Pix,
}

const paymentTypeAsConst = [
  'Cartão',
  'Dinheiro',
  'Pix',
] as const

export const appointmentSchema = z.object({
  date: z.string({ required_error: 'Data do agendamento obrigatória' })
    .trim()
    .date('Data do agendamento inválida')
    // .refine(isValidDate, { message: 'Data do agendamento inválida' })
    .refine(dataIsEqualOrGreaterThenToday, { message: 'Data do agendamento precisa ser maior ou igual à data de hoje' })
    .transform(getStringAsDateOnly),

  startTime: z.string({ required_error: 'Horário de início obrigatório' })
    .time('Horário de início inválido'),

  paymentType: z.enum(paymentTypeAsConst, {
    required_error: 'Tipo de pagamento obrigatório',
    message: 'Tipo de pagamento inválido',
  })
    .transform(payment => PaymentTypeEnum[payment]),

  notes: z.string()
    .trim()
    .optional()
    .or(z.literal(''))
    .transform(value => value || undefined),

  serviceIds: z.array(
    z.object({
      id: z.number()
    })
    .merge(
      serviceSchema
    )
  )
    .transform(values => values.map(({ id }) => id))
})

export type AppointmentZod = z.infer<typeof appointmentSchema>
