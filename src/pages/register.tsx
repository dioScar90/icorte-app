import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { userRegisterSchema, UserRegisterZod } from "@/schemas/user";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/authProvider";
import { ROUTE_ENUM } from "@/types/route";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import { UserForm } from "@/components/forms/user-form";
import { useEffect } from "react";
import { applyMask, MaskTypeEnum } from "@/utils/mask";

export function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { handleError } = useHandleErrors()

  const form = useForm<UserRegisterZod>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      profile: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: undefined,
      }
    }
  })

  async function onSubmit(values: UserRegisterZod) {
    try {
      const result = await register(values)

      if (!result.isSuccess) {
        throw result.error
      }

      navigate(ROUTE_ENUM.HOME, { state: { message: result.value?.message } })
    } catch (err) {
      handleError(err, form)
    }
  }

  const phoneNumber = form.watch('profile.phoneNumber')
  
  useEffect(() => {
    form.setValue('profile.phoneNumber', applyMask(MaskTypeEnum.PHONE_NUMBER, phoneNumber))
  }, [phoneNumber])
  
  return (
    <>
      <UserForm form={form} onSubmit={onSubmit} />
    </>
  )
}
