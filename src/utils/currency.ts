
export function getNumberAsCurrency(value: number, locale: string = 'pt-BR', currency: string = 'BRL') {
  return value.toLocaleString(locale, { style: 'currency', currency })
}
