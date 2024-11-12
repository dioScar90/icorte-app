import { UseFormReturn } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { getEnumAsArray, GetEnumAsString } from "@/utils/enum-as-array"
import { Button } from "../ui/button"
import { BarberShopZod } from "@/schemas/barberShop"
import { StateEnum } from "@/schemas/address"

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

// function isUpdate(props: Props): props is UpdateProps {
//   return typeof props.id === 'number'
// }

export function BarberShopForm(props: Props) {
  // if (isUpdate(props)) {
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
            
            <Button type="submit" disabled={form.formState.isLoading || form.formState.isSubmitting}>
              {isUpdate ? 'Salvar' : 'Cadastrar'}
            </Button>
          </form>
        </Form>
      </>
    )
  // } else {
  //   const { form, onSubmit } = props
    
  //   return (
  //     <>
  //       <Form {...form}>
  //         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
  //           <FormField
  //             control={form.control}
  //             name="profile.firstName"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Nome</FormLabel>
  //                 <FormControl>
  //                   <Input type="text" placeholder="Nome" {...field} />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  
  //           <FormField
  //             control={form.control}
  //             name="profile.lastName"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Sobrenome</FormLabel>
  //                 <FormControl>
  //                   <Input type="text" placeholder="Sobrenome" {...field} />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  
  //           <FormField
  //             control={form.control}
  //             name="profile.phoneNumber"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Telefone</FormLabel>
  //                 <FormControl>
  //                   <Input type="tel" placeholder="Telefone" {...field} />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  
  //           <FormField
  //             control={form.control}
  //             name="profile.gender"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Gênero</FormLabel>
  //                 <Select onValueChange={field.onChange} defaultValue={GetEnumAsString(GenderEnum, field.value)}>
  //                   <FormControl>
  //                     <SelectTrigger className="w-[180px]">
  //                       <SelectValue placeholder="Gênero" />
  //                     </SelectTrigger>
  //                   </FormControl>
  //                   <SelectContent>
  //                     <SelectGroup>
  //                       {getEnumAsArray(GenderEnum).map(gender => (
  //                         <SelectItem key={gender} value={gender}>{gender}</SelectItem>
  //                       ))}
  //                     </SelectGroup>
  //                   </SelectContent>
  //                 </Select>
  
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
            
  //           <FormField
  //             control={form.control}
  //             name="email"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Email</FormLabel>
  //                 <FormControl>
  //                   <Input type="email" placeholder="Digite seu email" {...field} />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />

  //           <FormField
  //             control={form.control}
  //             name="password"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Senha</FormLabel>
  //                 <FormControl>
  //                   <Input type="password" placeholder="Digite sua senha" {...field} />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />

  //           <FormField
  //             control={form.control}
  //             name="confirmPassword"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Confirmação</FormLabel>
  //                 <FormControl>
  //                   <Input type="password" placeholder="Confirme sua senha" {...field} />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
            
  //           <FormRootErrorMessage />
            
  //           <Button type="submit" disabled={form.formState.isLoading || form.formState.isSubmitting}>
  //             Cadastrar
  //           </Button>
  //         </form>
  //       </Form>
  //     </>
  //   )
  // }
}
