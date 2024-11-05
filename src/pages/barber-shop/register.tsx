import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { useToast } from "@/hooks/use-toast";
import { UnprocessableEntityError } from "@/providers/proxyProvider";
import { barberShopSchema, BarberShopForFormType } from "@/schemas/barberShop";
import { StateEnum, StateEnumAsConst } from "@/schemas/address";
import { useBarberShop } from "@/providers/barberShopProvider";

export function RegisterBarberShop() {
  console.log('passei loucamente por RegisterBarberShop')
  const { register } = useBarberShop()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const form = useForm<BarberShopForFormType>({
    resolver: zodResolver(barberShopSchema),
    defaultValues: {
      name: '',
      description: '',
      comercialNumber: '',
      comercialEmail: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: 'SP',
        postalCode: '',
        country: 'Brasil',
      }
    }
  })

  async function onSubmit(values: BarberShopForFormType) {
    const state = StateEnum[values.address.state]
    const data = { ...values, address: { ...values.address, state } }
    
    try {
      const result = await register(data)
      
      if (!result.isSuccess) {
        throw result.error
      }
      
      navigate(`${ROUTE_ENUM.BARBER_SHOP}/dashboard`, { state: { message: result.value?.message } })
    } catch (err) {
      if (err instanceof UnprocessableEntityError) {
        err.displayToastAndFormErrors(form.setError)
        return
      }

      console.log('oi acabou a agua... ♫')
      const message = err instanceof Error
        ? err.message
        : typeof err === 'string' ? err : 'Erro desconhecido, tente novamente'
        
      toast({
        variant: 'destructive',
        title: 'Erro no cadastro',
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Opcional. Ex.: A sua barbearia..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comercialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone Comercial</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Telefone comercial" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comercialEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Comercial</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email comercial" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ADDRESS */}

          <FormField
            control={form.control}
            name="address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rua</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Rua" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Número" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.complement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Complemento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Bairro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Estado</SelectLabel>
                      {StateEnumAsConst.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="CEP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="País" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Cadastrar</Button>
        </form>
      </Form>
    </>
  )
}
