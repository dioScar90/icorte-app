import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { userUpdateSchema, UserUpdateZod } from "@/schemas/user";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "@/providers/authProvider";
import { ROUTE_ENUM } from "@/types/route";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import { UserForm } from "@/components/forms/user-form";
import { ProfileLayoutContextType } from "@/components/layouts/profile-layout";
import { useCallback } from "react";

export function ProfileEdit() {
  const { updateProfile, profile } = useOutletContext<ProfileLayoutContextType>()

  const navigate = useNavigate()
  const { user } = useAuth()
  const { handleError } = useHandleErrors()
  
  const form = useForm<UserUpdateZod>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: user!.phoneNumber,
        gender: profile.gender,
      }
    }
  })
  
  const onSubmit = useCallback(async function(values: UserUpdateZod) {
    try {
      console.log('submetasse', values)
      const result = await updateProfile(profile.id, values.profile)
      
      if (!result.isSuccess) {
        throw result.error
      }
      
      const url = `${ROUTE_ENUM.PROFILE}/${profile.id}`
      const message = 'Perfil alterado com sucesso'
      navigate(url, { state: { message } })
    } catch (err) {
      handleError(err, form)
    }
  }, [])

  return (
    <>
      <h3>{profile.fullName}</h3>
      <UserForm form={form} isUpdate onSubmit={onSubmit} />
    </>
  )
}
