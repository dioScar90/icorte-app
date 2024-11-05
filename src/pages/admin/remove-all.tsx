import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { useToast } from "@/hooks/use-toast";
import { InvalidUsernameOrPasswordError } from "@/providers/proxyProvider";
import { useAdmin } from "@/providers/adminProvider";

const schema = z.object({
  passphrase: z.string().min(1, { message: 'Senha obrigatória' })
})

type SchemaType = z.infer<typeof schema>

export function RemoveAll() {
  const navigate = useNavigate()
  const { removeAllRows } = useAdmin()
  const { toast } = useToast()

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      passphrase: '',
    }
  })

  async function onSubmit(values: SchemaType) {
    try {
      const result = await removeAllRows(values)

      if (!result.isSuccess) {
        throw result.error
      }

      navigate(`${ROUTE_ENUM.ADMIN}/dashboard`, { state: { message: 'Usuários removidos com sucesso' } })
    } catch (err) {
      if (err instanceof InvalidUsernameOrPasswordError) {
        err.displayToastAndFormErrors(form.setError)
        return
      }
      
      const message = err instanceof Error
        ? err.message
        : typeof err === 'string' ? err : 'Erro desconhecido, tente novamente'
        
      toast({
        variant: 'destructive',
        title: 'Erro no loginnnnnnnn',
        description: message,
      })
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="passphrase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Digite sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit">Remover tudo</Button>
        </form>
      </Form>
    </>
  )
}
