import { profileLoader } from "@/data/loaders/profileLoader";
import { ProfileRepository } from "@/data/repositories/ProfileRepository";
import { ProfileService } from "@/data/services/ProfileService";
import { httpClient } from "@/providers/proxyProvider";
import { ProfileZod } from "@/schemas/profile";
import { useCallback } from "react";
import { Outlet, useLoaderData } from "react-router-dom";

export type ProfileLayoutContextType = {
  updateProfile: (id: number, data: ProfileZod) => Promise<ReturnType<ProfileRepository['updateProfile']>>
  profile: NonNullable<Awaited<ReturnType<typeof profileLoader>>>
}

export function ProfileLayout() {
  const profile = useLoaderData() as Awaited<ReturnType<typeof profileLoader>>

  if (!profile) {
    return <p>Não tem perfil nenhum aqui não</p>
  }

  const profileRepository = new ProfileRepository(new ProfileService(httpClient))
  
  const updateProfile = useCallback(async (id: number, data: ProfileZod) => {
    return await profileRepository.updateProfile(id, data)
  }, [])
  
  return (
    <>
      <div className="flex-1 flex flex-col h-full">
        <Outlet context={{ updateProfile, profile }} />
      </div>
    </>
  )
}
