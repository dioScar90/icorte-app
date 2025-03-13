import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/admin/dashboard',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authenticated-only)/(admin-only)/admin/dashboard"!</div>
}
