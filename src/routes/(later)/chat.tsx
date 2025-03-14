import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(later)/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/chat"!</div>
}
