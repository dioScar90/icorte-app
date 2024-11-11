
type EnumObj = Record<string, string | number>
type Func = <T extends EnumObj>(enumVal: T) => (keyof T)[]

export const getEnumAsArray: Func = (enumVal) => {
  return Object.keys(enumVal)
    .filter(key => Number.isNaN(+key))
}
