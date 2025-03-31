import { userRegisterSchema } from "@/schemas/user";
import { FormRootErrorMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { genders } from "@/schemas/profile";
import { Link } from "@tanstack/react-router";
import { useRegisterForm } from "@/hooks/forms/use-register";
import { z } from "zod";

export const Route = createFileRoute('/register')({
  component: Register,
})

export function Register() {
  const [handleError, register] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.auth.register,
    ] as const
  })

  const navigate = useNavigate()

  const form = useRegisterForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      profile: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: undefined,
      },
    } as z.input<typeof userRegisterSchema>,
    validators: {
      onSubmit: userRegisterSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const values = userRegisterSchema.parse(value)
        const result = await register(values)
  
        if (!result.isSuccess) {
          throw result.error
        }
  
        navigate({
          to: '/',
          state: {
            alert: {
              message: result.value?.message,
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
      <div className="before-card">
        <Card className="w-full md:max-w-96">
          <CardHeader>
            <CardTitle className="text-2xl">Novo usuário</CardTitle>
            <CardDescription>
              Vamos começar. Preencha os campos abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <form.AppForm>
                  <form.RegisterSubscribeWithGoogleButton />
                </form.AppForm>
              </div>

              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-muted-foreground">OU</span>
                <Separator className="flex-1" />
              </div>

              <div className="grid gap-3">
                <form.AppField name="profile.firstName">
                  {(field) => <field.RegisterFirstNameField />}
                </form.AppField>
                
                <form.AppField name="profile.lastName">
                  {(field) => <field.RegisterLastNameField />}
                </form.AppField>
                
                <form.AppField name="profile.phoneNumber">
                  {(field) => <field.RegisterPhoneNumberField />}
                </form.AppField>
                
                <form.AppField name="profile.gender">
                  {(field) => <field.RegisterGenderField baseEnum={genders} />}
                </form.AppField>
                
                <form.AppField name="email">
                  {(field) => <field.RegisterEmailField />}
                </form.AppField>
                
                <form.AppField name="email">
                  {(field) => <field.RegisterEmailField />}
                </form.AppField>
                
                <form.AppField name="password">
                  {(field) => <field.RegisterPasswordField />}
                </form.AppField>
                
                <form.AppField name="confirmPassword">
                  {(field) => <field.RegisterConfirmPasswordField />}
                </form.AppField>

                <FormRootErrorMessage />
              </div>

              <div className="mt-3 grid gap-3">
                <form.AppForm>
                  <form.RegisterSubscribeButton />
                </form.AppForm>

                <div className="text-center text-sm">
                  <span>Já possui uma conta?</span>{' '}
                  <Link to="/login" className="underline">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
