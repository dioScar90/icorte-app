import { AdminRepository } from "@/data/repositories/AdminRepository"
import { AdminService } from "@/data/services/AdminService"
import { createContext, PropsWithChildren, useContext, useMemo } from "react"
import { useProxy } from "./proxyProvider"
import { IAdminRepository } from "@/data/repositories/interfaces/IAdminRepository"

export type AdminContextType = {
  removeAllRows: (data: { passphrase: string }) => ReturnType<IAdminRepository['removeAllRows']>
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
  
  const removeAllRows = async (data: { passphrase: string }) => await adminRepository.removeAllRows(data)
  
  return (
    <AdminContext.Provider
      value={{
        removeAllRows,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}