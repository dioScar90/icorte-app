import { z } from 'zod'

export function emailValidator(messageIdentifier?: string) {
  const Email = messageIdentifier ?? 'Email'

  return z.string()
    .trim()
    .min(1, { message: `${Email} obrigatório` })
    .email(`Formato de ${Email} inválido`)
}
