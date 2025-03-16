import { ProfileService } from '@/data/services/ProfileService'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/profile',
)({
  beforeLoad: async ({ context }) => {
    const repository = new ProfileService(context.httpClient)

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
