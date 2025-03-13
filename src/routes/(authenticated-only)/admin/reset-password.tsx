import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/admin/reset-password',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/(authenticated-only)/(admin-only)/admin/reset-password"!</div>
  )
}
