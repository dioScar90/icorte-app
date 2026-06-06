import { z } from 'zod'
import { getStringAsTimeString } from './sharedValidators/timeString'
import { getStringAsDateString, isCorrectDateString, isDateGreaterThenToday } from './sharedValidators/dateString'

export const specialScheduleSchema = z.object({
  date: z.string('Dia obrigatório')
    .refine(isCorrectDateString, 'Dia inválido')
    .refine(isDateGreaterThenToday, 'Dia não pode ser inferior ou igual a hoje')
    .transform(getStringAsDateString),

  notes: z.string()
    .trim()
    .optional()
    .or(z.literal(''))
    .transform(value => value || undefined),
    
  openTime: z.iso.time('Horário de abertura inválido')
    .optional()
    .or(z.literal(''))
    .transform(value => value ? getStringAsTimeString(value) : undefined),

  closeTime: z.iso.time('Horário de encerramento inválido')
    .optional()
    .or(z.literal(''))
    .transform(value => value ? getStringAsTimeString(value) : undefined),

  isClosed: z.coerce.boolean(),
}).superRefine(({ openTime, closeTime, isClosed }, ctx) => {
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
}).transform((values) => ({
  ...values,
  openTime: values.isClosed ? undefined : values.openTime,
  closeTime: values.isClosed ? undefined : values.closeTime,
}))

export type SpecialScheduleZod = z.infer<typeof specialScheduleSchema>
