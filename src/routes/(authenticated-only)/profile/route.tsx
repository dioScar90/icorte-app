import { ProfileService } from '@/data/services/ProfileService'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/profile',
)({
  beforeLoad: async () => {
    const repository = new ProfileService()

    return {
      getProfileById: repository.getProfileById,
      updateProfile: repository.updateProfile,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
