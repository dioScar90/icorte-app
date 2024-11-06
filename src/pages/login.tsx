import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userLoginSchema } from "@/schemas/user";
import { useAuth } from "@/providers/authProvider";
import { useNavigate } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { useToast } from "@/hooks/use-toast";
import { useError } from "@/hooks/use.error";
// import { InvalidUsernameOrPasswordError } from "@/providers/proxyProvider";

type SchemaType = z.infer<typeof userLoginSchema>

export function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const { toast } = useToast()
  const { handleError } = useError()

  const form = useForm<SchemaType>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  async function onSubmit(values: SchemaType) {
    try {
      const result = await login(values)

      if (!result.isSuccess) {
        throw result.error
      }

      navigate(ROUTE_ENUM.HOME, { replace: true, state: { message: 'Login realizado com sucesso' } })
    } catch (err) {
      if (err instanceof Error) {
        const aqui = handleError(form, err)

        if (!aqui) {
          return
        }

        aqui
      }
      // if (err instanceof InvalidUsernameOrPasswordError) {
      //   err.displayToastAndFormErrors(form.setError)
      //     .forEach(({ error, toast }) => {
      //       form.setError(error.key, { message: error?.message })
      //       toast(toast)
      //     })
      //   return
      // }
      
      const message = err instanceof Error
        ? err.message
        : typeof err === 'string' ? err : 'Erro desconhecido, tente novamente'
        
      toast({
        variant: 'destructive',
        title: 'Erro no loginnnnnnnn',
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
          
          <Button type="submit" disabled={isLoading}>Login</Button>
        </form>
      </Form>
    </>
  )
}
