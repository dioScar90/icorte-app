import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/barber-schedule/dashboard/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/(authenticated-only)/(client-only)/barber-schedule/dashboard/"!
    </div>
  )
}
