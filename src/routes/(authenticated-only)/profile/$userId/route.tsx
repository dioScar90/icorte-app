import { Profile } from '@/types/models/profile'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { z } from 'zod'

const schema = z.object({
  userId: z.number()
}) satisfies z.ZodType<{ userId: Profile['id'] }>

export const Route = createFileRoute('/(authenticated-only)/profile/$userId')({
  component: RouteComponent,
  params: {
    parse: (params) => schema.parse(params),
  },
  beforeLoad: async ({ context, params }) => {
    const res = await context.getProfileById(params.userId)
    
    if (!res.isSuccess) {
      context.goHome()
    }
    
    return {
      profile: res.value!,
    }
  },
})

function RouteComponent() {
  return (
    <>
      <div className="flex-1 flex flex-col h-full">
        <Outlet />
      </div>
    </>
  )
}
