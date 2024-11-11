import { z } from 'zod'
import { getStringAsTimeOnly } from './sharedValidators/timeOnly'
import { getStringAsDateOnly } from './sharedValidators/dateOnly'

type RefineFuncProps = {
  openTime?: string,
  closeTime?: string,
  isClosed: boolean,
}

function closeTimeMustBeGreaterThenOpenTimeIfClosed({ openTime, closeTime, isClosed }: RefineFuncProps) {
  if (isClosed) {
    return true
  }

  if (!openTime && !closeTime) {
    return false
  }

  if (!closeTime) {
    return true
  }

  if (openTime && openTime > closeTime) {
    return true
  }

  return false
}

export const specialScheduleSchema = z.object({
  date: z.string({ required_error: 'Dia obrigatório' })
    .date('Dia inválido')
    .transform(getStringAsDateOnly),

  notes: z.string()
    .trim()
    .optional()
    .or(z.literal(''))
    .transform(value => value || undefined),

  openTime: z.string({ required_error: 'Horário de abertura obrigatório' })
    .time('Horário de abertura inválido')
    .optional()
    .or(z.literal(''))
    .transform(value => value ? getStringAsTimeOnly(value) : undefined),

  closeTime: z.string({ required_error: 'Horário de encerramento obrigatório' })
    .time('Horário de encerramento inválido')
    .optional()
    .or(z.literal(''))
    .transform(value => value ? getStringAsTimeOnly(value) : undefined),

  isClosed: z.coerce.boolean(),
})
  .refine(closeTimeMustBeGreaterThenOpenTimeIfClosed, {
    message: 'Horário de encerramento precisa ser superior ao horário de abertura',
    path: ['closeTime']
  })

export type SpecialScheduleZod = z.infer<typeof specialScheduleSchema>
