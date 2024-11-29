import { AdminRepository } from "@/data/repositories/AdminRepository";
import { AdminService } from "@/data/services/AdminService";
import { httpClient } from "@/providers/proxyProvider";
import { useCallback, useMemo } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
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

type AdminLayoutContextType = {
  removeAll: AdminRepository['removeAll']
  populateAll: AdminRepository['populateAll']
  popAppointments: AdminRepository['populateWithAppointments']
  resetPassword: AdminRepository['resetPasswordForSomeUser']
}

export function AdminLayout() {
  const repository = useMemo(() => new AdminRepository(new AdminService(httpClient)), [])
  
  const removeAll = useCallback(async function(...args: Parameters<typeof repository.removeAll>) {
    return await repository.removeAll(...args)
  }, [])
  
  const populateAll = useCallback(async function(...args: Parameters<typeof repository.populateAll>) {
    return await repository.populateAll(...args)
  }, [])
  
  const popAppointments = useCallback(async function(...args: Parameters<typeof repository.populateWithAppointments>) {
    return await repository.populateWithAppointments(...args)
  }, [])
  
  const resetPassword = useCallback(async function(...args: Parameters<typeof repository.resetPasswordForSomeUser>) {
    return await repository.resetPasswordForSomeUser(...args)
  }, [])

  const props: AdminLayoutContextType = {
    removeAll,
    populateAll,
    popAppointments,
    resetPassword,
  }
  
  return (
    <>
      <h3>Admin's space</h3>
      <Outlet context={props} />
    </>
  )
}

export function useAdminLayout() {
  return useOutletContext<AdminLayoutContextType>()
}
