import { z } from 'zod'

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
    .trim()
    .date('Dia inválido'),
  
  openTime: z.string({ required_error: 'Horário de abertura obrigatório' })
    .trim()
    .time('Horário de abertura inválido')
    .optional()
    .or(z.literal(''))
    .transform(value => value || undefined),

  closeTime: z.string({ required_error: 'Horário de encerramento obrigatório' })
    .trim()
    .time('Horário de encerramento inválido')
    .optional()
    .or(z.literal(''))
    .transform(value => value || undefined),

  isClosed: z.coerce.boolean(),
})
  .refine(closeTimeMustBeGreaterThenOpenTimeIfClosed, {
    message: 'Horário de encerramento precisa ser superior ao horário de abertura',
    path: ['closeTime']
  })

export type SpecialScheduleType = z.infer<typeof specialScheduleSchema>
