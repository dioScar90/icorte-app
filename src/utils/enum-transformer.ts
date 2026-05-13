export function getEnumAsArray<
  TEnum extends Record<string, string | number>,
  TKey extends keyof TEnum = keyof TEnum
>(enumItself: TEnum) {
  return Object.keys(enumItself)
    .filter(key => Number.isNaN(+key)) as [TKey, ...TKey[]]
}

export function getEnumAsString<
  TEnum extends readonly string[],
  TKey extends keyof TEnum = keyof TEnum
>(enumItself: TEnum, enumVal?: TKey): string | undefined {
  if (typeof enumVal !== 'number') {
    return undefined
  }
  
  return enumItself[enumVal] ?? undefined

  // const record = Object.entries(enumItself)
  //   .find(([_, value]) => value === enumVal)

  // if (!record) {
  //   return undefined
  // }

  // return record[0] as TKey
}

// export function getEnumAsString<
//   TEnum extends Record<string, string | number>,
//   TKey extends keyof TEnum = keyof TEnum
// >(enumItself: TEnum, enumVal?: number) {
//   if (enumVal === undefined) {
//     return undefined
//   }

//   const record = Object.entries(enumItself)
//     .find(([_, value]) => value === enumVal)

//   if (!record) {
//     return undefined
//   }

//   return record[0] as TKey
// }
