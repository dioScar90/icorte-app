import { DivBeforeCard } from "@/components/div-before-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLoginForm } from "@/hooks/forms/use-login"
import { userLoginSchema } from "@/schemas/user"
import { Link } from "@tanstack/react-router"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute('/login')({
  component: Login,
})

export function Login() {
  const [handleError, login] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.auth.login,
    ] as const
  })
  
  const navigate = useNavigate()
  
  const form = useLoginForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      // onBlur: userLoginSchema,
      onSubmit: userLoginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await login(value)
  
        if (result.error) {
          throw result.error
        }
        
        navigate({
          to: '/',
          state: {
            alert: {
              message: 'Login realizado com sucesso',
            },
          },
        })
      } catch (err) {
        handleError(err)
      }
    },
  })
  
  return (
    <form
      className="space-y-6"
      onSubmit={e => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <DivBeforeCard>
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
                  {(field) => <field.LoginEmailField />}
                </form.AppField>
                
                <form.AppField name="password">
                  {(field) => <field.LoginPasswordField isLogin />}
                </form.AppField>
              </div>
              
              {/* <FormRootErrorMessage /> */}
              
              <form.AppForm>
                <form.LoginSubscribeButton isLogin />
                <form.LoginSubscribeWithGoogleButton isLogin />
              </form.AppForm>
            </div>
            <div className="mt-4 text-center text-sm">
              <span>Não tem conta?</span>{' '}
              <Link to="/register" className="underline">
                Cadastre-se
              </Link>
            </div>
          </CardContent>
        </Card>
      </DivBeforeCard>
    </form>
  )
}
