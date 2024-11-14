import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import { AdminLayoutContextType, baseAdminSchema, BaseAdminZod } from "@/components/layouts/admin-layout";

export function PopulateAll() {
  const { populateAll } = useOutletContext<AdminLayoutContextType>()
  const navigate = useNavigate()
  const { handleError } = useHandleErrors()
  
  const form = useForm<BaseAdminZod>({
    resolver: zodResolver(baseAdminSchema),
    defaultValues: {
      passphrase: '',
    }
  })
  
  async function onSubmit(values: BaseAdminZod) {
    try {
      const result = await populateAll(values)

      if (!result.isSuccess) {
        throw result.error
      }
      
      const message = 'Usuários reinseridos, menos você né pae...'
      const url = `${ROUTE_ENUM.ADMIN}/dashboard`
      navigate(url, { state: { message } })
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

          <Button type="submit" disabled={form.formState.isLoading || form.formState.isSubmitting}>Reinserir tudo</Button>
        </form>
      </Form>
    </>
  )
}
