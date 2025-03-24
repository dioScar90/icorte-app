import { ForTheFuture } from '@/components/for-the-future'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(later)/work-with-us')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ForTheFuture>Work with Us!</ForTheFuture>
}
