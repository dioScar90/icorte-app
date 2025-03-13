import { Profile } from '@/types/models/profile'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const schema = z.object({
  userId: z.number()
}) satisfies z.ZodType<{ userId: Profile['id'] }>

export const Route = createFileRoute('/(authenticated-only)/profile/$userId')({
  component: RouteComponent,
  params: {
    parse: (params) => schema.parse(params),
  }
})

function RouteComponent() {
  return <div>Hello "/(authenticated-only)/profile/$userId"!</div>
}
