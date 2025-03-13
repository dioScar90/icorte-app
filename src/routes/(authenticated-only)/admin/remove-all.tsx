import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/admin/remove-all',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authenticated-only)/(admin-only)/admin/remove-all"!</div>
}
