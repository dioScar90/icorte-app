import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import { resetPasswordSchema, ResetPasswordZod, useAdminLayout } from "@/components/layouts/admin-layout";
import { ListRestart } from "lucide-react";

export function ResetPassword() {
  const { resetPassword } = useAdminLayout()
  const navigate = useNavigate()
  const { handleError } = useHandleErrors()
  
  const form = useForm<ResetPasswordZod>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      passphrase: '',
      email: '',
    }
  })
  
  async function onSubmit(values: ResetPasswordZod) {
    try {
      const result = await resetPassword(values)

      if (!result.isSuccess) {
        throw result.error
      }
      
      const message = 'Senha resetada'
      const url = `${ROUTE_ENUM.ADMIN}/dashboard`
      navigate(url, { state: { message } })
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
