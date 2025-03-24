import { ForTheFuture } from '@/components/for-the-future'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(later)/be-pro')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ForTheFuture>Be Pro!</ForTheFuture>
}
