import { z } from 'zod'

export const messageSchema = z.object({
  content: z.string()
    .trim()
    .min(1, { message: 'Mensagem não pode estar vazia' })
    .max(255, { message: 'Mensagem não pode ser maior que 255 caracteres' }),
})

export type MessageZod = z.infer<typeof messageSchema>
