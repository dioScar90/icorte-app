import { AdminService } from '@/data/services/AdminService'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { z } from 'zod'

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

export const Route = createFileRoute(
  '/(authenticated-only)/admin',
)({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAdmin) {
      throw redirect({
        to: '/login',
        replace: true,
      })
    }
    
    if (location.pathname === '/admin/') {
      throw redirect({
        to: '/admin/dashboard',
        replace: true,
      })
    }
    
    const repository = new AdminService(context.httpClient)
    
    return {
      admin: {
        removeAll: repository.removeAll,
        populateAll: repository.populateAll,
        popAppointments: repository.populateWithAppointments,
        resetPassword: repository.resetPasswordForSomeUser,
        searchByName: repository.searchUserByName,
        getLastUsers: repository.getLastUsers,
        baseAdminSchema,
        appointmentsAdminSchema,
        resetPasswordSchema,
      }
    }
  }
})

function RouteComponent() {
  return <Outlet />
}
