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
import { InvalidUsernameOrPasswordError, NetworkConnectionError } from "@/providers/proxyProvider";

type SchemaType = z.infer<typeof userLoginSchema>

export function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const { toast } = useToast()

  const form = useForm<SchemaType>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  async function onSubmit(values: SchemaType) {
    try {
      const ola = await login(values)
      console.log('olaaaaaaaaa', ola)

      if (!ola.isSuccess) {
        throw ola.error
      }

      navigate(ROUTE_ENUM.HOME, { replace: true })
    } catch (err) {
      if (err instanceof InvalidUsernameOrPasswordError) {
        err.displayToastAndFormErrors(form.setError)
        return
      }
      
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
