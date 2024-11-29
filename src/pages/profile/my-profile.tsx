import { JsonDebugger } from "@/components/json-debugger";
import { useProfileLayout } from "@/components/layouts/profile-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/providers/authProvider";
import { ROUTE_ENUM } from "@/types/route";
import { useState } from "react";
import { Link } from "react-router-dom";

export function MyProfile() {
  const { user } = useAuth()
  const { profile } = useProfileLayout()
  const [showPre, setShowPre] = useState(false)
  
  return (
    <>
      <h3>{profile.fullName}</h3>
      
      <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <Avatar className="w-24 h-24 rounded-full">
            <AvatarImage src={user?.profile?.imageUrl} alt={profile.fullName} />
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
        <Button variant="secondary" className="w-fit" onClick={() => setShowPre(prev => !prev)}>
          Toggle JSON
        </Button>
        
        <Link to={`${ROUTE_ENUM.PROFILE}/${profile.id}/edit`} className={buttonVariants({ variant: "link" })}>
          Editar
        </Link>
      </div>
      
      {showPre && <JsonDebugger obj={profile} />}
    </>
  )
}
