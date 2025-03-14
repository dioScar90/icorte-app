import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ListRestart } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute(
  '/(authenticated-only)/admin/reset-password',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { resetPassword, handleError, schema } = Route.useRouteContext(({
    select: (s) => ({
      resetPassword: s.admin.resetPassword,
      schema: s.admin.resetPasswordSchema,
      handleError: s.handleError,
    })
  }))
  
  const navigate = useNavigate()
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      passphrase: '',
      email: '',
    }
  })
  
  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const result = await resetPassword(values)

      if (!result.isSuccess) {
        throw result.error
      }
      
      navigate({
        to: '/admin/dashboard',
        state: {
          message: 'Senha resetada',
        },
      })
    } catch (err) {
      handleError(err, form)
    }
  }

  return (
    <>
      <h3>Reset user's password</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="passphrase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frase secreta</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Digite a frase secreta" {...field} />
                </FormControl>
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
                  <Input type="email" inputMode="email" placeholder="Digite o email do usuário" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormRootErrorMessage />

          <Button
            type="submit"
            isLoading={form.formState.isLoading || form.formState.isSubmitting}
            IconLeft={<ListRestart />}
          >
            Resetar senha
          </Button>
        </form>
      </Form>
    </>
  )
}
