import { z } from 'zod'

const MIN_RATING = 1
const MAX_RATING = 5
export type Rating = 1 | 2 | 3 | 4 | 5

function isInRange(value: number) {
  return value >= MIN_RATING && value <= MAX_RATING
}

function getNumberAsRating(rating: number) {
  return rating as Rating
}

export const reportSchema = z.object({
  title: z.string({ required_error: 'Título obrigatório' })
    .trim()
    .min(3, { message: 'Título precisa ter pelo menos 3 caracteres' }),

  content: z.string()
    .min(3, { message: 'Comentário precisa ter pelo menos 3 caracteres' })
    .optional()
    .or(z.literal(''))
    .transform(value => value?.trim() || undefined),

  rating: z.coerce.number({ required_error: 'Nota obrigatória' })
    .int('Nota inválida')
    .refine(isInRange, { message: `Nota precisa estar entre ${MIN_RATING} e ${MAX_RATING}` })
    .transform(getNumberAsRating),
})

export type ReportZod = z.infer<typeof reportSchema>
