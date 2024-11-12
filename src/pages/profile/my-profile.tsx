import { ProfileLayoutContextType } from "@/components/layouts/profile-layout";
import { Button } from "@/components/ui/button";
import { ROUTE_ENUM } from "@/types/route";
import { Link, useOutletContext } from "react-router-dom";

export function MyProfile() {
  const { profile } = useOutletContext<ProfileLayoutContextType>()
  
  return (
    <>
      <h3>{profile.fullName}</h3>
      <pre>{JSON.stringify(profile, undefined, 2)}</pre>
      <Button variant="link" asChild>
        <Link to={`${ROUTE_ENUM.PROFILE}/${profile.id}/edit`}>Editar</Link>
      </Button>
    </>
  )
}
