import { getStringAsDateString } from "@/schemas/sharedValidators/dateString"
import { getNumberAsCurrency } from "./currency"
import { getStringAsTimeString } from "@/schemas/sharedValidators/timeString"

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

function getTimeString(value: string) {
  value = value
    .replace(/\D/g, '')
    .padStart(6, '0')
    .slice(-6)
    .replace(/(\d{2})(\d)/, '$1:$2')
    .replace(/(\d{2})(\d)/, '$1:$2')

  if (hasOnlyZerosAfterExcludeNonNumerics(value)) {
    return ''
  }

  return getStringAsTimeString(value)
}

function getDateString(value: string) {
  value = value.replace(/\D/g, '').slice(0, 8)

  const putFirstBar = value.length > 2
  const putSecondBar = value.length > 4

  if (putSecondBar) {
    value = value.slice(0, 4) + '/' + value.slice(4)
  }

  if (putFirstBar) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  
  return getStringAsDateString(value)
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

const maskObj = {
  CPF: getCpf,
  CNPJ: getCnpj,
  CEP: getCep,
  PHONE_NUMBER: getPhone,
  TIME_ONLY: getTimeString,
  MONEY: getMoney,
  DATE_ISO: getDateString,
} as const

type MaskObj = typeof maskObj
type MaskObjKey = keyof MaskObj

export const applyMask = 
<
  TType extends MaskObjKey,
  TValues extends Parameters<MaskObj[TType]>,
>(type: TType, ...value: TValues): ReturnType<MaskObj[TType]> => {
  if (!value.length || value[0] === undefined || !(type in (maskObj as MaskObj))) {
    return ''
  }
  
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  return maskObj[type](...value)
}
