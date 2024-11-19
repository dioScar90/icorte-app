import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import { Switch } from "@/components/ui/switch";
import { AdminLayoutContextType, baseAdminSchema, BaseAdminZod } from "@/components/layouts/admin-layout";
import { Bomb } from "lucide-react";

export function RemoveAll() {
  const { removeAll } = useOutletContext<AdminLayoutContextType>()
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
      const result = await removeAll(values)

      if (!result.isSuccess) {
        throw result.error
      }
      
      const message = 'Usuários removidos' + (values.evenMasterAdmin ? ', inclusive você, seu maluco!' : '')
      const url = `${ROUTE_ENUM.ADMIN}/dashboard`
      navigate(url, { state: { message } })
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
