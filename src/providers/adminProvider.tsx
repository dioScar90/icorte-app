import { AdminRepository } from "@/data/repositories/AdminRepository"
import { AdminService } from "@/data/services/AdminService"
import { createContext, PropsWithChildren, useContext, useMemo } from "react"
import { useProxy } from "./proxyProvider"
import { IAdminRepository } from "@/data/repositories/interfaces/IAdminRepository"

export type AdminContextType = {
  removeAll: (data: { passphrase: string }) => ReturnType<IAdminRepository['removeAll']>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function useAdmin() {
  const adminContext = useContext(AdminContext)

  if (!adminContext) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }

  return adminContext
}

export function AdminProvider({ children }: PropsWithChildren) {
  const { httpClient } = useProxy()
  const adminRepository = useMemo(() => new AdminRepository(new AdminService(httpClient)), [])
  
  const removeAll = async (data: { passphrase: string }) => await adminRepository.removeAll(data)
  
  return (
    <AdminContext.Provider
      value={{
        removeAll,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}