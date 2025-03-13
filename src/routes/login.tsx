import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "@/components/ui/form"
import { GoogleSvg } from "@/components/ui/google-svg"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/providers/authProvider"
import { useHandleErrors } from "@/providers/handleErrorProvider"
import { userLoginSchema } from "@/schemas/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "@tanstack/react-router"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Eye, EyeOff, LogInIcon } from "lucide-react"
import { useState } from "react"
import { ControllerRenderProps, useForm } from "react-hook-form"
import { z } from "zod"

export const Route = createFileRoute('/login')({
  component: Login,
})

type SchemaType = z.infer<typeof userLoginSchema>

function PasswordControl({ field }: { field: ControllerRenderProps<SchemaType, 'password'> }) {
  const [isViewPassword, setIsViewPassword] = useState(false)
  const EyeViewPasswordIcon = isViewPassword ? Eye : EyeOff

  return (
    <FormControl>
      <div className="relative">
        <Input type={isViewPassword ? 'text' : 'password'} placeholder="Digite sua senha" {...field} />
        <EyeViewPasswordIcon
          className="absolute-middle-y right-4 z-10 cursor-pointer text-gray-500"
          onClick={() => setIsViewPassword(!isViewPassword)}
        />
      </div>
    </FormControl>
  )
}

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
  
  function dispatchToastUnavailableForNow() {
    toast({
      variant: 'destructive',
      description: 'Indisponível no momento',
    })
  }
  
  async function onSubmit(values: SchemaType) {
    try {
      const result = await login(values)

      if (!result.isSuccess) {
        throw result.error
      }
      
      navigate({
        to: '/',
        replace: true,
        state: { message: 'Login realizado com sucesso' },
      })
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
                                  to="/" tabIndex={-1}
                                  onClick={e => {
                                    e.preventDefault()
                                    dispatchToastUnavailableForNow()
                                  }}
                                  className="ml-auto inline-block text-sm underline"
                                  title="Indisponível no momento"
                                >
                                  Esqueceu sua senha?
                                </Link>
                              </Button>
                            </div>
                            <PasswordControl field={field} />
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
                    onClick={e => {
                      e.preventDefault()
                      dispatchToastUnavailableForNow()
                    }}
                    isLoading={form.formState.isLoading || form.formState.isSubmitting}
                    IconLeft={<GoogleSvg />}
                  >
                    Fazer login com Google
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  <span>Não tem conta?</span>{' '}
                  <Link to="/register" className="underline">
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
