import { z } from 'zod'

type TReadonlyArr = readonly [string, ...string[]]

type IndexesOf<TArr extends TReadonlyArr> =
  Exclude<Partial<TArr>["length"], TArr["length"]>
  
export type ExcludeUndefinedFromStringArr<TArr extends readonly [string, ...string[], undefined]> =
  TArr extends readonly [...(infer Strs), undefined] ? readonly [...Strs] : never
  
export function getEnumAsArray<
  TEnum extends TReadonlyArr,
  TKey extends keyof TEnum = keyof TEnum
>(enumItself: TReadonlyArr) {
  return Object.keys(enumItself)
    .filter(key => Number.isNaN(+key)) as [TKey, ...TKey[]]
}

export function getEnumAsString<
  TEnum extends TReadonlyArr,
  // TKey extends keyof TEnum = keyof TEnum
>(enumItself: TEnum, enumVal?: number) {
  if (enumVal === undefined) {
    return undefined
  }
  
  return enumItself[enumVal] as TEnum[number]
}

export function nativeEnumValidator<
  TArr extends TReadonlyArr,
  TIdx extends IndexesOf<TArr> = IndexesOf<TArr>,
>(arr: TArr, errorMessage?: string) {
  function getIndexOf(el: z.Writeable<TArr>[number]): TIdx {
    return arr.indexOf(el) as TIdx
  }
  
  return z.enum(arr).optional()
    .refine(gen => gen !== undefined, { message: errorMessage })
    .transform(getIndexOf)
}
