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
import { Eye, EyeOff, LogInIcon } from "lucide-react";
import { GoogleSvg } from "@/components/ui/google-svg";
import { toast } from "@/hooks/use-toast";
import { MouseEvent, useState } from "react";

type SchemaType = z.infer<typeof userLoginSchema>

export function Login() {
  const [isViewPassword, setIsViewPassword] = useState(false)
  const EyeViewPasswordIcon = isViewPassword ? Eye : EyeOff
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
  
  function unavailableForNow(e: MouseEvent) {
    e.preventDefault()
    toast({ variant: "destructive", description: "Indisponível no momento" })
  }

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
                  <div className="grid gap-3">
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
                            <div className="flex items-center">
                              <FormLabel>Senha</FormLabel>
                              <Button variant="link" asChild>
                                <Link
                                  to="#" tabIndex={-1}
                                  onClick={unavailableForNow}
                                  className="ml-auto inline-block text-sm underline"
                                  title="Indisponível no momento"
                                >
                                  Esqueceu sua senha?
                                </Link>
                              </Button>
                            </div>
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
                    title="Indisponível no momento"
                    onClick={unavailableForNow}
                    isLoading={form.formState.isLoading || form.formState.isSubmitting}
                    IconLeft={<GoogleSvg />}
                  >
                    Fazer login com Google
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
