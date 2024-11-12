import { BarberShopRepository } from "@/data/repositories/BarberShopRepository"
import { BarberShopService } from "@/data/services/BarberShopService"
import { UserMe } from "@/types/models/user"
import { createContext, PropsWithChildren, useContext } from "react"
import { useAuth } from "./authProvider"
import { useProxy } from "./proxyProvider"
import { BarberShopZod } from "@/schemas/barberShop"
import { IBarberShopRepository } from "@/data/repositories/interfaces/IBarberShopRepository"

export type BarberShopContextType = {
  userId: UserMe['id']
  isBarberShop: boolean
  barberShop?: NonNullable<UserMe['barberShop']>
  register: (data: BarberShopZod) => ReturnType<IBarberShopRepository['createBarberShop']>
}

const BarberShopContext = createContext<BarberShopContextType | undefined>(undefined)

export function useBarberShop() {
  const authContext = useContext(BarberShopContext)

  if (!authContext) {
    throw new Error('useBarberShop must be used within an BarberShopProvider')
  }

  return authContext
}

export function BarberShopProvider({ children }: PropsWithChildren) {
  const { httpClient } = useProxy()
  const { user } = useAuth()
  
  const repository = new BarberShopRepository(new BarberShopService(httpClient))
  
  const register = async (data: BarberShopZod) => {
    return await repository.createBarberShop(data)
  }
  
  return (
    <BarberShopContext.Provider
      value={{
        userId: user!.id,
        isBarberShop: !!user?.barberShop,
        barberShop: user?.barberShop,
        register,
      }}
    >
      {children}
    </BarberShopContext.Provider>
  )
}