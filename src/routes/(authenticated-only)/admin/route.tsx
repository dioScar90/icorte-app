import { AdminRepository } from '@/data/repositories/AdminRepository'
import { AdminService } from '@/data/services/AdminService'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/admin',
)({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    // TODO: if !isAdmin...
    if (false) {
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
    
    const repository = new AdminRepository(new AdminService(context.httpClient))
    
    return {
      removeAll: repository.removeAll,
      populateAll: repository.populateAll,
      popAppointments: repository.populateWithAppointments,
      resetPassword: repository.resetPasswordForSomeUser,
      searchByName: repository.searchUserByName,
      getLastUsers: repository.getLastUsers,
    }
  }
})

function RouteComponent() {
  return <Outlet />
}
