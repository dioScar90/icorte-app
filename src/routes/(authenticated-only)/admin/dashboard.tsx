import { ForTheFuture } from '@/components/for-the-future'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/admin/dashboard',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <ForTheFuture>This must be the Admin dashboard!</ForTheFuture>
}
