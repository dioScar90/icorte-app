import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleSvg } from "@/components/ui/google-svg"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"
import { useAppForm } from "@/hooks/demo.form"
import { toast } from "@/hooks/use-toast"
import { userLoginSchema } from "@/schemas/user"
import { Link } from "@tanstack/react-router"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Eye, EyeOff, LogInIcon } from "lucide-react"
import { useRef, useState, type RefObject } from "react"

export const Route = createFileRoute('/login')({
  component: Login,
})

function EyeViewPasswordIcon({ ref }: { ref: RefObject<HTMLInputElement | null> }) {
  const [isViewPassword, setIsViewPassword] = useState(false)
  const Icon = isViewPassword ? Eye : EyeOff

  function handleClick() {
    setIsViewPassword(prev => !prev)

    if (ref?.current) {
      ref?.current.setAttribute('type', isViewPassword ? 'text' : 'password')
    }
  }

  return (
    <Icon
      className="absolute-middle-y right-4 z-10 cursor-pointer text-gray-500"
      onClick={handleClick}
    />
  )
}

export function Login() {
  const [handleError, login] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.auth.login,
    ] as const
  })
  
  const navigate = useNavigate()

  const passwordInputRef = useRef<HTMLInputElement>(null)
  
  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onBlur: userLoginSchema,
      onSubmit: userLoginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await login(value)
  
        if (!result.isSuccess) {
          throw result.error
        }
        
        navigate({
          to: '/',
          replace: true,
          state: {
            message: 'Login realizado com sucesso',
          },
        })
      } catch (err) {
        handleError(err)
      }
    },
  })
  
  function dispatchToastUnavailableForNow() {
    toast({
      variant: 'destructive',
      description: 'Indisponível no momento',
    })
  }
  
  return (
    <form
      className="space-y-6"
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
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
                <form.AppField name="email">
                  {(field) => <field.TextField type="email" label="Email" placeholder="Digite seu email" />}
                </form.AppField>

                <form.AppField
                  name="password"
                  children={(field) => (
                    <div className="relative">
                      <div>
                        <Label className="mb-2 text-xl font-bold">
                          Email
                        </Label>
                        
                        <div className="relative">
                          <Input
                            ref={passwordInputRef}
                            type="password"
                            value={field.state.value}
                            placeholder={'*'.repeat(8)}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />

                          <EyeViewPasswordIcon ref={passwordInputRef} />
                        </div>
                        
                        {field.state.meta.isTouched && <em>{field.state.meta.errors.join(',')}</em>}
                      </div>
                      
                      <Button variant="link" asChild className="absolute right-0">
                        <Link
                          to={Route.fullPath}
                          tabIndex={-1}
                          onClick={e => {
                            e.preventDefault()
                            e.currentTarget.toggleAttribute('data-disabled', true)
                            dispatchToastUnavailableForNow()
                            setTimeout(() => e.currentTarget.toggleAttribute('data-disabled', false), 500)
                          }}
                          className="ml-auto inline-block text-sm underline [&[data-disabled]]:opacity-50 [&[data-disabled]]:pointer-events-none"
                          title="Indisponível no momento"
                        >
                          Esqueceu sua senha?
                        </Link>
                      </Button>
                    </div>
                  )}
                />
              </div>
              
              {/* <FormRootErrorMessage /> */}
              
              <div className="w-full">
                <form.AppForm>
                  <form.SubscribeButton label="Login" IconLeft={<LogInIcon />} />
                </form.AppForm>
              </div>

              <SubmitButton
                type="button"
                variant="outline" className="w-full"
                title="Indisponível no momento"
                onClick={e => {
                  e.preventDefault()
                  dispatchToastUnavailableForNow()
                }}
                disabled={form.state.isSubmitting}
                IconLeft={<GoogleSvg />}
              >
                Fazer login com Google
              </SubmitButton>
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
  )
}
