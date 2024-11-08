import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userLoginSchema } from "@/schemas/user";
import { useAuth } from "@/providers/authProvider";
import { useNavigate } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { useHandleErrors } from "@/providers/handleErrorProvider";

type SchemaType = z.infer<typeof userLoginSchema>

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { handleError } = useHandleErrors()

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
      handleError(err, form)
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

          <FormRootErrorMessage />

          <Button type="submit" disabled={form.formState.isLoading || form.formState.isSubmitting}>Login</Button>
        </form>
      </Form>
    </>
  )
}
