import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated-only)/profile/$userId/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const profile = Route.useRouteContext({ select: (s) => s.profile })
  
  return (
    <>
      <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <Avatar className="w-24 h-24 rounded-full">
            <AvatarImage src={profile?.imageUrl} alt={profile.fullName} />
            <AvatarFallback>iCorte</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{profile.fullName}</h2>
            <p className="text-gray-500">{profile.gender === 1 ? "Masculino" : "Feminino"}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-medium">Detalhes</h3>
          <div className="space-y-4 mt-4">
            <div className="flex justify-between">
              <span className="font-semibold">Primeiro Nome</span>
              <span className="text-gray-600">{profile.firstName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Sobrenome</span>
              <span className="text-gray-600">{profile.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">ID</span>
              <span className="text-gray-600">{profile.id}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center align-center gap-x-3">
        <Link
          className={buttonVariants({ variant: "link" })}
          to="/profile/$userId/edit"
          params={{
            userId: profile.id,
          }}
        >
          Editar
        </Link>
      </div>
    </>
  )
}
