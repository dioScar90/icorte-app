import { z } from 'zod'
import { getStringAsTimeOnly } from './sharedValidators/timeOnly'
import { getStringAsDateOnly, isCorrectDateString, isDateGreaterThenToday } from './sharedValidators/dateOnly'

export const specialScheduleSchema = z.object({
  date: z.string({ required_error: 'Dia obrigatório' })
    .refine(isCorrectDateString, 'Dia inválido')
    .refine(isDateGreaterThenToday, 'Dia não pode ser inferior ou igual a hoje')
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
  .superRefine(({ openTime, closeTime, isClosed }, ctx) => {
    if (isClosed) {
      return
    }
    
    if (openTime && closeTime && openTime >= closeTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Horário de encerramento precisa ser maior que horário de abertura',
        path: ['closeTime'],
      })
      return
    }
    
    if (!openTime && !closeTime) {
      const pathes = ['openTime', 'closeTime']
      
      pathes.forEach(path =>
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'É preciso informar pelo menos um dos novos horários',
          path: [path],
        })
      )
      
      return
    }
  })

export type SpecialScheduleZod = z.infer<typeof specialScheduleSchema>
