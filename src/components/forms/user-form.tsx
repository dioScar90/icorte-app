import { UserRegisterZod, UserUpdateZod } from "@/schemas/user"
import { UseFormReturn } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { getEnumAsArray, GetEnumAsString } from "@/utils/enum-as-array"
import { GenderEnum } from "@/schemas/profile"
import { Button } from "../ui/button"
import { Eye, EyeOff, UserRoundPlusIcon } from "lucide-react"
import { memo, useState } from "react"

type RegisterProps = {
  isUpdate?: false
  form: UseFormReturn<UserRegisterZod>
  onSubmit(values: UserRegisterZod): Promise<void>
}

type UpdateProps = {
  isUpdate: true
  form: UseFormReturn<UserUpdateZod>
  onSubmit(values: UserUpdateZod): Promise<void>
}

type Props = RegisterProps | UpdateProps

function isUpdate(props: Props): props is UpdateProps {
  return !!props.isUpdate
}

export const UserForm = memo(function UserForm(props: Props) {
  const [isViewPassword, setIsViewPassword] = useState(false)
  const EyeViewPasswordIcon = isViewPassword ? Eye : EyeOff
  
  if (isUpdate(props)) {
    const { form, onSubmit } = props

    return (
      <>
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
            
            <FormRootErrorMessage />
            
            <Button
              type="submit"
              isLoading={form.formState.isLoading || form.formState.isSubmitting}
              IconLeft={<UserRoundPlusIcon />}
            >
              Salvar
            </Button>
          </form>
        </Form>
      </>
    )
  } else {
    const { form, onSubmit } = props
    
    return (
      <>
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
})
