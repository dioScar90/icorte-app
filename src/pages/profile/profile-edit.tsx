import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { userUpdateSchema, UserUpdateZod } from "@/schemas/user";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/authProvider";
import { ROUTE_ENUM } from "@/types/route";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import { useProfileLayout } from "@/components/layouts/profile-layout";
import { useEffect } from "react";
import { applyMask } from "@/utils/mask";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEnumAsArray, getEnumAsString } from "@/utils/enum-as-array";
import { GenderEnum } from "@/schemas/profile";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, UserRoundPlusIcon } from "lucide-react";

export function ProfileEdit() {
  const { updateProfile, profile } = useProfileLayout()

  const navigate = useNavigate()
  const { user } = useAuth()
  const { handleError } = useHandleErrors()

  const form = useForm<UserUpdateZod>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        gender: profile.gender,
        phoneNumber: applyMask('PHONE_NUMBER', user!.phoneNumber),
      }
    }
  })

  async function onSubmit(values: UserUpdateZod) {
    try {
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
  }

  const phoneNumber = form.watch('profile.phoneNumber')

  useEffect(() => {
    form.setValue('profile.phoneNumber', applyMask('PHONE_NUMBER', phoneNumber))
  }, [phoneNumber])

  return (
    <>
      <h3>{profile.fullName}</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="profile.firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile.lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Sobrenome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile.phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input type="tel" inputMode="tel" placeholder="Telefone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile.gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gênero</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={getEnumAsString(GenderEnum, field.value)}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {getEnumAsArray(GenderEnum).map(gender => (
                        <SelectItem key={gender} value={gender} >{gender}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormRootErrorMessage />

          <div className="flex justify-center align-center gap-x-3">
            <Link
              className={buttonVariants({ variant: "secondary" })}
              to={`${ROUTE_ENUM.PROFILE}/${profile.id}`}
            >
              <ChevronLeft />
              Voltar
            </Link>
            <Button
              type="submit" formNoValidate
              isLoading={form.formState.isLoading || form.formState.isSubmitting}
              IconLeft={<UserRoundPlusIcon />}
            >
              Salvar
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
