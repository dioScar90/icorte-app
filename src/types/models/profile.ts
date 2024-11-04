const genders = ['Feminino', 'Masculino'] as const
type GenderEnum = typeof genders[number]

export type Profile = {
  id: number
  firstName: string
  lastName: string
  fullName: string
  gender: GenderEnum
  imageUrl?: string
}
