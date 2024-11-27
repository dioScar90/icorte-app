// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { ServiceZod } from "@/schemas/service"
// import { userRegisterSchema } from "@/schemas/user"
// import { memo } from "react"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
// import { BarberShopServicesLayoutContextType } from "../layouts/barber-shop-services-layout"
// import { useLocation, useNavigate } from "react-router-dom"
// import { useHandleErrors } from "@/providers/handleErrorProvider"
// import { ShoppingBag } from "lucide-react"
// import { DialogTrigger } from "@radix-ui/react-dialog"

// type Props = {
//   register: BarberShopServicesLayoutContextType['register']
//   // closeModal: () => void
//   barberShopId: number
// }

// function FormRegisterServiceToMemoized({ register, barberShopId }: Props) {
//   console.log('tentei abrir FormRegisterService')
//   const navigate = useNavigate()
//   const { pathname } = useLocation()
//   const { handleError } = useHandleErrors()
  
//   const form = useForm<ServiceZod>({
//     resolver: zodResolver(userRegisterSchema),
//     defaultValues: {
//       name: '',
//       description: '',
//       price: 0.0,
//       duration: '00:00:00',
//     }
//   })
  
//   async function onSubmit(data: ServiceZod) {
//     try {
//       console.log('ora ora ora se não são as minhas escolhas...', {barberShopId, data})
//       const result = await register(barberShopId, data)
      
//       if (!result.isSuccess) {
//         throw result.error
//       }
      
//       navigate(pathname, { replace: true, state: { message: result.value.message }})
//       // closeModal()
//     } catch (err) {
//       handleError(err, form)
//     }
//   }
  
//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <div className="grid gap-3">
//           <FormField
//             control={form.control}
//             name="name"
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
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Sobrenome</FormLabel>
//                 <FormControl>
//                   <Input type="text" placeholder="Descrição (opcional)" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
          
//           <FormField
//             control={form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Telefone</FormLabel>
//                 <FormControl>
//                   <Input type="text" inputMode="decimal" placeholder="Preço" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
          
//           <FormField
//             control={form.control}
//             name="duration"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Telefone</FormLabel>
//                 <FormControl>
//                   <Input type="text" inputMode="decimal" placeholder="Preço" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
          
//           <FormRootErrorMessage />
          
//           <Button
//             type="submit"
//             isLoading={form.formState.isLoading || form.formState.isSubmitting}
//             IconLeft={<ShoppingBag />}
//             onClick={() => console.log('Por que essa merda não está acontecendo?')}
//           >
//             Cadastrar
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }

// export const FormRegisterService = memo(FormRegisterServiceToMemoized);

// function RegisterServiceModalToMemoized(props: Props) {
//   console.log('tentei abrir RegisterServiceModal')
  
//   // function closeModalIfOpenChanged(status: boolean) {
//   //   if (!status) {
//   //     props.closeModal()
//   //   }
//   // }
  
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">Vai</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Share link</DialogTitle>
//           <DialogDescription>
//             Anyone who has this link will be able to view this.
//           </DialogDescription>
//         </DialogHeader>
        
//         <FormRegisterService { ...props } />
        
//         <DialogFooter className="sm:justify-start">
//           <DialogClose asChild>
//             <Button type="button" variant="secondary">
//               Close
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export const RegisterServiceModal = memo(RegisterServiceModalToMemoized)
