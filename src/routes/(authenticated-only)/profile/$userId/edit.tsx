import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/profile/$userId/edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/(authenticated-only)/(client-only)/profile/$userId/edit"!</div>
  )
}
