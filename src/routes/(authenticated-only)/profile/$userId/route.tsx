import type { Profile } from '@/types/models/profile'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { z } from 'zod'

const schema = z.object({
  userId: z.number()
}) satisfies z.ZodType<{ userId: Profile['id'] }>

export const Route = createFileRoute('/(authenticated-only)/profile/$userId')({
  component: RouteComponent,
  params: schema,
  beforeLoad: async ({ context, params }) => {
    const res = await context.getProfileById(params.userId)
    
    if (res.error) {
      context.goHome()
    }
    
    return {
      profile: res.data?.item!,
    }
  },
})

function RouteComponent() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <Outlet />
    </div>
  )
}
