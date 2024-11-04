import { ProfileRepository } from "@/data/repositories/ProfileRepository"
import { IProfileRepository } from "@/data/repositories/interfaces/IProfileRepository"
import { ProfileService } from "@/data/services/ProfileService"
import { UserMe } from "@/types/models/user"
import { createContext, PropsWithChildren, useContext } from "react"
import { useAuth } from "./authProvider"
import { useProxy } from "./proxyProvider"

export type ClientContextType = {
  profile: NonNullable<UserMe['profile']>
  repository: IProfileRepository
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export function useClient() {
  const clientContext = useContext(ClientContext)

  if (!clientContext) {
    throw new Error('useClient must be used within an ClientProvider')
  }

  return clientContext
}

export function ClientProvider({ children }: PropsWithChildren) {
  const { httpClient } = useProxy()
  const { user } = useAuth()

  return (
    <ClientContext.Provider
      value={{
        profile: user!.profile!,
        repository: new ProfileRepository(new ProfileService(httpClient)),
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}