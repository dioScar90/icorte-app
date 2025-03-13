import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/admin/populate-appointments',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/(authenticated-only)/(admin-only)/admin/populate-appointments"!
    </div>
  )
}
