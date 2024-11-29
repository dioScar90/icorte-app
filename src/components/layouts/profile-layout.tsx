import { profileLoader } from "@/data/loaders/profileLoader";
import { ProfileRepository } from "@/data/repositories/ProfileRepository";
import { ProfileService } from "@/data/services/ProfileService";
import { httpClient } from "@/providers/proxyProvider";
import { useCallback, useMemo } from "react";
import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";

type ProfileLayoutContextType = {
  updateProfile: ProfileRepository['updateProfile']
  profile: NonNullable<Awaited<ReturnType<typeof profileLoader>>>
}

export function ProfileLayout() {
  const profile = useLoaderData() as Awaited<ReturnType<typeof profileLoader>>
  const repository = useMemo(() => new ProfileRepository(new ProfileService(httpClient)), [])
  
  if (!profile) {
    return <p>Não tem perfil nenhum aqui não</p>
  }
  
  const updateProfile = useCallback(async function(...args: Parameters<typeof repository.updateProfile>) {
    return await repository.updateProfile(...args)
  }, [])
  
  const props: ProfileLayoutContextType = {
    updateProfile,
    profile,
  }
  
  return (
    <>
      <div className="flex-1 flex flex-col h-full">
        <Outlet context={props} />
      </div>
    </>
  )
}

export function useProfileLayout() {
  return useOutletContext<ProfileLayoutContextType>()
}
