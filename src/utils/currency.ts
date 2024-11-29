
export function getNumberAsCurrency(value: number | string, locale: string = 'pt-BR', currency: string = 'BRL') {
  value = +value || 0.00
  return value.toLocaleString(locale, { style: 'currency', currency })
}
