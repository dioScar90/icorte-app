import { UseFormReturn } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { getEnumAsArray, GetEnumAsString } from "@/utils/enum-as-array"
import { Button } from "../ui/button"
import { BarberShopZod } from "@/schemas/barberShop"
import { StateEnum } from "@/schemas/address"
import { StoreIcon } from "lucide-react"

// type RegisterProps = {
//   id: undefined
//   form: UseFormReturn<UserRegisterZod>
//   onSubmit(values: UserRegisterZod): Promise<void>
// }

type UpdateProps = {
  isUpdate?: boolean
  form: UseFormReturn<BarberShopZod>
  onSubmit(values: BarberShopZod): Promise<void>
}

type Props = UpdateProps

export function BarberShopForm(props: Props) {
  const { form, isUpdate, onSubmit } = props

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
                <Select onValueChange={field.onChange} defaultValue={GetEnumAsString(StateEnum, field.value)}>
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {getEnumAsArray(StateEnum).map(state => (
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
          
          <FormRootErrorMessage />
          
          <Button
            type="submit" variant={isUpdate ? 'outline' : 'default'}
            isLoading={form.formState.isLoading || form.formState.isSubmitting}
            IconLeft={<StoreIcon />}
          >
            {isUpdate ? 'Salvar' : 'Cadastrar'}
          </Button>
        </form>
      </Form>
    </>
  )
}
