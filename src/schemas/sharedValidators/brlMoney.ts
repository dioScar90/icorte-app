
export function isValidBrlMoney(value: string) { // R$ 2.342,90
  /*
    return /^R\$ ?\d{1,3}(\.\d{3})*,\d{2}$/.test(value)
    Acredite se quiser, eu estava tendo problemas ao comparar o formado com o espaço
    após o '$', pois alguns espaços podem ser U+0020 ou U+00A0. Que Unicode maldito!
  */

  value = value.replace(/\s/g, '')
  return /^R\$?\d{1,3}(\.\d{3})*,\d{2}$/.test(value)
}

export function isBrMoneyGreaterThenZero(value: string) {
  return +(value.replace(/\D/g, '')) > 0
}

export function getBrlMoneyIntoFloat(value: string) {
  console.log('price-antes-final', value)
  return +(value.replace(/[^0-9,]/g, '').replace(',', '.')) || 0.00
}
