import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userLoginSchema } from "@/schemas/user";
import { useAuth } from "@/providers/authProvider";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogInIcon } from "lucide-react";
import { GoogleSvg } from "@/components/ui/google-svg";
import { toast } from "@/hooks/use-toast";

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
          <div className="before-card">
            <Card className="w-full md:max-w-96">
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Digite seu email abaixo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
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
                  </div>
                  <div className="grid gap-2">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center">
                              <FormLabel>Senha</FormLabel>
                              <Button variant="link" asChild>
                                <Link to="#" className="ml-auto inline-block text-sm underline" title="Indisponível no momento" tabIndex={-1}>
                                  Esqueceu sua senha?
                                </Link>
                              </Button>
                            </div>
                            <FormControl>
                              <Input type="password" placeholder="Digite sua senha" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                  
                  <FormRootErrorMessage />

                  <Button
                    type="submit" className="w-full"
                    isLoading={form.formState.isLoading || form.formState.isSubmitting}
                    IconLeft={<LogInIcon />}
                  >
                    Login
                  </Button>
                  <Button
                    type="button"
                    variant="outline" className="w-full"
                    onClick={() => toast({
                      variant: "destructive",
                      description: "Indisponível no momento",
                    })}
                    isLoading={form.formState.isLoading || form.formState.isSubmitting}
                    IconLeft={<GoogleSvg />}
                  >
                    Login with Google
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  <span>Não tem conta?</span>{' '}
                  <Link to={ROUTE_ENUM.REGISTER} className="underline">
                    Cadastre-se
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </>
  )
}
