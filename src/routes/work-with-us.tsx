import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/work-with-us')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/work-with-us"!</div>
}
