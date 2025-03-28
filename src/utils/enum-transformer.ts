
type EnumObj = Record<string, string | number>
type Func = <T extends EnumObj>(enumItself: T) => (keyof T)[]

export const getEnumAsArray: Func = (enumItself) => {
  return Object.keys(enumItself)
    .filter(key => Number.isNaN(+key))
}

enum GenderEnum {
  // Deixar em pt-br mesmo, porque sim. Isso já foi testado, apenas aceite.
  Feminino,
  Masculino,
}

const enummm = [
  'Feminino',
  'Masculino',
] as const

type MamaMia = keyof typeof GenderEnum

const vamos: MamaMia = 'aldskfj'
console.log(vamos)

type Func2 = <T extends EnumObj>(enumItself: T, enumVal?: number) => keyof T | undefined

export const transformEnum: Func2 = (enumItself, enumVal) => {
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
