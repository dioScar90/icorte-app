import { AdminRepository } from "@/data/repositories/AdminRepository";
import { AdminService } from "@/data/services/AdminService";
import { httpClient } from "@/providers/proxyProvider";
import { useCallback, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { z } from "zod";

const passphrase = z.string().min(1, { message: 'Senha obrigatória' })
const evenMasterAdmin = z.boolean().optional()

export const baseAdminSchema = z.object({
  passphrase,
  evenMasterAdmin,
})

export const appointmentsAdminSchema = z.object({
  passphrase,
  firstDate: z.date()
    .transform(value => !value ? undefined : value.toISOString().split('T')[0] )
    .optional(),
  limitDate: z.date()
    .transform(value => !value ? undefined : value.toISOString().split('T')[0])
    .optional(),
})

export const resetPasswordSchema = z.object({
  passphrase,
  email: z.string().email('Email inválido'),
})

export type BaseAdminZod = z.infer<typeof baseAdminSchema>
export type AppointmentsAdminZod = z.infer<typeof appointmentsAdminSchema>
export type ResetPasswordZod = z.infer<typeof resetPasswordSchema>

export type AdminLayoutContextType = {
  removeAll: (data: BaseAdminZod) => Promise<ReturnType<AdminRepository['removeAll']>>
  populateAll: (data: BaseAdminZod) => Promise<ReturnType<AdminRepository['populateAll']>>
  popAppointments: (data: AppointmentsAdminZod) => Promise<ReturnType<AdminRepository['populateWithAppointments']>>
  resetPassword: (data: ResetPasswordZod) => Promise<ReturnType<AdminRepository['resetPasswordForSomeUser']>>
}

export function AdminLayout() {
  const repository = useMemo(() => new AdminRepository(new AdminService(httpClient)), [])
  
  const removeAll = useCallback(async (data: BaseAdminZod) => {
    return await repository.removeAll(data)
  }, [])
  
  const populateAll = useCallback(async (data: BaseAdminZod) => {
    return await repository.populateAll(data)
  }, [])
  
  const popAppointments = useCallback(async (data: AppointmentsAdminZod) => {
    return await repository.populateWithAppointments(data)
  }, [])
  
  const resetPassword = useCallback(async (data: ResetPasswordZod) => {
    return await repository.resetPasswordForSomeUser(data)
  }, [])
  
  return (
    <>
      <h3>Admin's space</h3>
      <Outlet context={{ removeAll, populateAll, popAppointments, resetPassword }} />
    </>
  )
}
