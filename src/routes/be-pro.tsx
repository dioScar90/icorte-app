import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/be-pro')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/be-pro"!</div>
}
