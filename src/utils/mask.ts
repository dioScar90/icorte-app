import { getNumberAsCurrency } from "./currency"

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

function getTimeOnly(value: string) {
  return value
    .replace(/\D/g, '')
    .padStart(6, '0')
    .slice(-6)
    .replace(/(\d{2})(\d)/, '$1:$2')
    .replace(/(\d{2})(\d)/, '$1:$2')
}

function getMoney(value: number | string) {
  value = (typeof value === 'string' ? value : String(value * 100))
    .replace(/\D/g, '')
    .padStart(3, '0')
    .replace(/(\d)(?=\d{2}$)/, '$1.')
  
  const money = +value
  
  if (!money) {
    return getNumberAsCurrency(0)
  }
  
  return getNumberAsCurrency(money)
}

const types = [
  'CPF',
  'CNPJ',
  'CEP',
  'PHONE_NUMBER',
  'TIME_ONLY',
  'MONEY',
] as const

type MaskType = typeof types[number]

type MaskFunc =
  <
    TType extends MaskType,
    TValue extends TType extends 'MONEY' ? number | string : string,
  >
  (type: TType, value?: TValue) => string

export const applyMask: MaskFunc = (type, value) => {
  if (value === undefined) {
    return ''
  }
  
  const isMoneyType = (t: typeof type, v: unknown): v is number | string => t === 'MONEY' && (typeof v === 'number' || typeof v === 'string')
  
  if (isMoneyType(type, value)) {
    return getMoney(value)
  }
  
  if (type === 'CPF') {
    return getCpf(value)
  }

  if (type === 'CNPJ') {
    return getCnpj(value)
  }

  if (type === 'CEP') {
    return getCep(value)
  }

  if (type === 'PHONE_NUMBER') {
    return getPhone(value)
  }

  if (type === 'TIME_ONLY') {
    return getTimeOnly(value)
  }
  
  return ''
}
