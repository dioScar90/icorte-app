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

const hasOnlyZerosAfterExcludeNonNumerics = (value: string) => !(+(value.replace(/\D/g, '')))

function getTimeOnly(value: string) {
  value = value
    .replace(/\D/g, '')
    .padStart(6, '0')
    .slice(-6)
    .replace(/(\d{2})(\d)/, '$1:$2')
    .replace(/(\d{2})(\d)/, '$1:$2')

  return hasOnlyZerosAfterExcludeNonNumerics(value) ? '' : value
}

function getDateOnly(value: string) {
  value = value.replace(/\D/g, '').slice(0, 8)

  const putFirstBar = value.length > 2
  const putSecondBar = value.length > 4

  if (putSecondBar) {
    value = value.slice(0, 4) + '/' + value.slice(4)
  }

  if (putFirstBar) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  
  return value
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
  'DATE_ISO',
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

  if (type === 'DATE_ISO') {
    return getDateOnly(value)
  }
  
  return ''
}
