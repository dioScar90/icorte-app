import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BetweenHorizonalStart } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute(
  '/(authenticated-only)/admin/populate-all',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [handleError, populateAll, schema] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.admin.populateAll,
      s.admin.baseAdminSchema,
    ] as const
  })
  
  const navigate = useNavigate()
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      passphrase: '',
    }
  })
  
  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const result = await populateAll(values)

      if (!result.isSuccess) {
        throw result.error
      }
      
      navigate({
        to: '/admin/dashboard',
        state: {
          message: 'Usuários reinseridos, menos você né pae...',
        },
      })
    } catch (err) {
      handleError(err, form)
    }
  }

  return (
    <>
      <h3>Populate all users and their related tables again</h3>
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
          
          <FormRootErrorMessage />

          <Button
            type="submit"
            isLoading={form.formState.isLoading || form.formState.isSubmitting}
            IconLeft={<BetweenHorizonalStart />}
          >
            Reinserir tudo
          </Button>
        </form>
      </Form>
    </>
  )
}
