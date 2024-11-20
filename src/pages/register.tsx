import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { userRegisterSchema, UserRegisterZod } from "@/schemas/user";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/authProvider";
import { ROUTE_ENUM } from "@/types/route";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import { useEffect, useState } from "react";
import { applyMask, MaskTypeEnum } from "@/utils/mask";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEnumAsArray, GetEnumAsString } from "@/utils/enum-as-array";
import { GenderEnum } from "@/schemas/profile";
import { Eye, EyeOff, UserRoundPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Register() {
  const [isViewPassword, setIsViewPassword] = useState(false)
  const EyeViewPasswordIcon = isViewPassword ? Eye : EyeOff
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
      <h3>Novo usuário</h3>

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
                <Select onValueChange={field.onChange} defaultValue={GetEnumAsString(GenderEnum, field.value)}>
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {getEnumAsArray(GenderEnum).map(gender => (
                        <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" inputMode="email" placeholder="Digite seu email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={isViewPassword ? 'text' : 'password'} placeholder="Digite sua senha" {...field} />
                    <EyeViewPasswordIcon
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-gray-500"
                      onClick={() => setIsViewPassword(!isViewPassword)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmação</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirme sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormRootErrorMessage />
          
          <Button
            type="submit"
            isLoading={form.formState.isLoading || form.formState.isSubmitting}
            IconLeft={<UserRoundPlusIcon />}
          >
            Cadastrar
          </Button>
        </form>
      </Form>
    </>
  )
}
