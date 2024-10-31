import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userRegisterSchema, UserRegisterForFormType } from "@/schemas/user";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/authProvider";
import { ROUTE_ENUM } from "@/types/route";
import { Gender } from "@/schemas/profile";
import { useToast } from "@/hooks/use-toast";
import { UnprocessableEntityError } from "@/providers/proxyProvider";

export function Register() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  const { toast } = useToast()

  const form = useForm<UserRegisterForFormType>({
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

  async function onSubmit(values: UserRegisterForFormType) {
    console.log('values', values)
    
    // const gender = values.profile.gender === 'Masculino' ? Gender.Male : Gender.Female
    // const data: UserRegisterForFormType = { ...values, profile: { ...values.profile, gender }}

    const gender = values.profile.gender === 'Masculino' ? Gender.Male : Gender.Female
    const data = { ...values, profile: { ...values.profile, gender } }

    console.log('data', data)
  
    try {
      const ola = await register(data)
      
      if (!ola.isSuccess) {
        throw ola.error
      }

      console.log('olaaaaaaaaa_register', ola)
      navigate(ROUTE_ENUM.HOME, { replace: true })
    } catch (err) {
      if (err instanceof UnprocessableEntityError) {
        err.errorsEntries
          .forEach(([name, messages]) => {
            form.setError(name as keyof UserRegisterForFormType, { ...messages })
          })
        return
      }

      console.log('oi acabou a agua... ♫')
      const message = err instanceof Error
        ? err.message
        : typeof err === 'string' ? err : 'Erro desconhecido, tente novamente'
        
      toast({
        variant: 'destructive',
        title: 'Erro no cadastro',
        description: message,
      })
    }
  }

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
                  <Input type="tel" placeholder="Telefone" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Gênero</SelectLabel>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
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
                  <Input type="email" placeholder="Digite seu email" {...field} />
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
                  <Input type="password" placeholder="Digite sua senha" {...field} />
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

          <Button type="submit" disabled={isLoading}>Cadastrar</Button>
        </form>
      </Form>
    </>
  )
}
