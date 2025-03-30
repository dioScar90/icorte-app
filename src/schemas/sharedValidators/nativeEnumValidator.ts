import { z } from 'zod'

type IndexesOf<T extends readonly [string, ...string[]]> =
  Exclude<Partial<T>["length"], T["length"]>

export function getEnumAsArray<
  TEnum extends Record<string, string | number>,
  TKey extends keyof TEnum = keyof TEnum
>(enumItself: TEnum) {
  return Object.keys(enumItself)
    .filter(key => Number.isNaN(+key)) as [TKey, ...TKey[]]
}

export function getEnumAsString<
  TEnum extends Record<string, string | number>,
  TKey extends keyof TEnum = keyof TEnum
>(enumItself: TEnum, enumVal?: number) {
  if (enumVal === undefined) {
    return undefined
  }

  const record = Object.entries(enumItself)
    .find(([_, value]) => value === enumVal)

  if (!record) {
    return undefined
  }

  return record[0] as TKey
}

// export function nativeEnumValidator(enumItself: Record<string, string | number>, errorMessage: string) {
//   return z.enum(getEnumAsArray(enumItself)).optional()
//     .refine(
//       gen => {
//         return gen !== undefined
//         // if (gen === undefined) {
//         //   return false
//         // }

//         // if (typeof enumItself[gen] === 'number') {
//         //   return false
//         // }

//         // return true
//       },
//       { message: errorMessage }
//     )
//     .transform(gen => enumItself[gen])
// }

// export function nativeEnumValidator<TArr extends [string, ...string[]]>(arr: TArr, errorMessage: string) {
//   return z.enum(arr).optional()
//     .refine(gen => gen !== undefined, { message: errorMessage })
//     .transform(gen => arr.indexOf(gen as TArr[number & keyof TArr]))
// }

export function nativeEnumValidator<TArr extends readonly [string, ...string[]], TIdx extends IndexesOf<TArr> = IndexesOf<TArr>>(arr: TArr, errorMessage: string) {
  function getIndexOf(el: z.Writeable<TArr>[number]): TIdx {
    return arr.indexOf(el) as TIdx
  }
  
  return z.enum(arr).optional()
    .refine(gen => gen !== undefined, { message: errorMessage })
    .transform(getIndexOf)
}

// enum Mamaaa { Vish, Ave }

// const mamamia = nativeEnumValidator(Mamaaa, 'alksdfjsa')
// const mamamia = nativeEnumValidator(['Vish', 'Ave', 'Uuuuuu'] as const, 'alksdfjsa')
const burro = ['Vish', 'Ave', 'Uuuuuu'] as const
const gender = nativeEnumValidator(burro, 'alksdfjsa')
const mamamia = z.object({
  gender,
})


type oi = z.output<typeof mamamia>
