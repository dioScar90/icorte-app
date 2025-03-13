import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/profile',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authenticated-only)/(client-only)/profile/$userId"!</div>
}
