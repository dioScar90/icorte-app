function getPhone(value: string) {
  return value
    .replace(/[\D]/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5}|\d{4})(\d{4})/, '$1-$2')
    .replace(/(-\d{4})(\d+?)/, '$1')
}

function getCpf(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

function getCnpj(value: string) {
  return value
    .replace(/[\D]/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

function getCep(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d{3})+?$/, '$1-$2')
    .replace(/(-\d{3})(\d+?)/, '$1')
}

export enum MaskTypeEnum {
  CPF = 1,
  CNPJ,
  CEP,
  PHONE_NUMBER,
}

export function applyMask(type: MaskTypeEnum, value?: string) {
  if (!value || !value.length) {
    return ''
  }
  
  value = value!.trim()
  
  switch (type) {
    case MaskTypeEnum.CPF:
      return getCpf(value)
    case MaskTypeEnum.CNPJ:
      return getCnpj(value)
    case MaskTypeEnum.CEP:
      return getCep(value)
    case MaskTypeEnum.PHONE_NUMBER:
      return getPhone(value)
    default:
      return ''
  }
}
