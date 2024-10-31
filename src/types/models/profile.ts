const genders = ['Feminino', 'Masculino'] as const
type Gender = typeof genders[number]

export type Profile = {
  id: number
  firstName: string
  lastName: string
  fullName: string
  gender: Gender
  imageUrl?: string
}
