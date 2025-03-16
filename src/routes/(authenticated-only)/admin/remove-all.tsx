import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Bomb } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const Route = createFileRoute(
  '/(authenticated-only)/admin/remove-all',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [handleError, removeAll, schema] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.admin.removeAll,
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
      const result = await removeAll(values)

      if (!result.isSuccess) {
        throw result.error
      }

      let message = 'Usuários removidos'

      if (values.evenMasterAdmin) {
        message += ', inclusive você, seu maluco!'
      }
      
      navigate({
        to: '/admin/dashboard',
        state: { message },
      })
    } catch (err) {
      handleError(err, form)
    }
  }

  return (
    <>
      <h3>Remove all users and their related tables</h3>
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
            name="evenMasterAdmin"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between gap-x-5 rounded-lg w-fit border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    All father
                  </FormLabel>
                  <FormDescription>
                    Remove master all father account too
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormRootErrorMessage />

          <Button
            type="submit"
            isLoading={form.formState.isLoading || form.formState.isSubmitting}
            IconLeft={<Bomb />}
          >
            Remover tudo
          </Button>
        </form>
      </Form>
    </>
  )
}
