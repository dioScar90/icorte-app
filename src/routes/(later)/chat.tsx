import { ForTheFuture } from '@/components/for-the-future'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(later)/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ForTheFuture>Chat!</ForTheFuture>
}
