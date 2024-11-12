import { AdminRepository } from "@/data/repositories/AdminRepository";
import { AdminService } from "@/data/services/AdminService";
import { httpClient } from "@/providers/proxyProvider";
import { useCallback, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { z } from "zod";

export const removeAllSchema = z.object({
  passphrase: z.string().min(1, { message: 'Senha obrigatória' }),
  evenMasterAdmin: z.boolean().optional(),
})

export type RemoveAllZod = z.infer<typeof removeAllSchema>

export type AdminLayoutContextType = {
  removeAll: (data: RemoveAllZod) => Promise<ReturnType<AdminRepository['removeAll']>>
}

export function AdminLayout() {
  const repository = useMemo(() => new AdminRepository(new AdminService(httpClient)), [])
  
  const removeAll = useCallback(async (data: RemoveAllZod) => {
    return await repository.removeAll(data)
  }, [])
  
  return (
    <>
      <h3>Admin's space</h3>
      <Outlet context={{ removeAll }} />
    </>
  )
}
