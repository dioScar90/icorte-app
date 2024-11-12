
type EnumObj = Record<string, string | number>
type Func = <T extends EnumObj>(enumItself: T) => (keyof T)[]

export const getEnumAsArray: Func = (enumItself) => {
  return Object.keys(enumItself)
    .filter(key => Number.isNaN(+key))
}

type Func2 = <T extends EnumObj>(enumItself: T, enumVal?: number) => keyof T | undefined

export const GetEnumAsString: Func2 = (enumItself, enumVal) => {
  if (enumVal === undefined) {
    return undefined
  }

  const record = Object.entries(enumItself)
    .find(([_, value]) => value === enumVal)

  if (!record) {
    return undefined
  }
    
  return record[0]
}
