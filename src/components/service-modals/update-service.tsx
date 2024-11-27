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
// import { useEffect } from "react"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "../ui/form"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
// import { BarberShopServicesLayoutContextType } from "../layouts/barber-shop-services-layout"
// import { useLocation, useNavigate } from "react-router-dom"
// import { useHandleErrors } from "@/providers/handleErrorProvider"
// import { ShoppingBag } from "lucide-react"

// type Props = {
//   update: BarberShopServicesLayoutContextType['update']
//   closeModal: () => void
//   barberShopId: number
//   serviceId: number
// }

// export function UpdateServiceModal({ update, closeModal, barberShopId, serviceId }: Props) {
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
//       const result = await update(barberShopId, serviceId, data)
      
//       if (!result.isSuccess) {
//         throw result.error
//       }
      
//       navigate(pathname, { replace: true, state: { message: 'Serviço atualizado com sucesso!' }})
//     } catch (err) {
//       handleError(err, form)
//     }
//   }
  
//   useEffect(() => {
//     return closeModal
//   }, [])

//   return (
//     <Dialog defaultOpen={true}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Share link</DialogTitle>
//           <DialogDescription>
//             Anyone who has this link will be able to view this.
//           </DialogDescription>
//         </DialogHeader>
        
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <div className="before-card">
//               <Card className="w-full md:max-w-96">
//                 <CardHeader>
//                   <CardTitle className="text-2xl">Novo usuário</CardTitle>
//                   <CardDescription>
//                     Vamos começar. Preencha os campos abaixo.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid gap-4">
//                     <div className="grid gap-3">
//                       <FormField
//                         control={form.control}
//                         name="name"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Nome</FormLabel>
//                             <FormControl>
//                               <Input type="text" placeholder="Nome" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
                      
//                       <FormField
//                         control={form.control}
//                         name="description"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Sobrenome</FormLabel>
//                             <FormControl>
//                               <Input type="text" placeholder="Descrição (opcional)" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
                      
//                       <FormField
//                         control={form.control}
//                         name="price"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Telefone</FormLabel>
//                             <FormControl>
//                               <Input type="text" inputMode="decimal" placeholder="Preço" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
                      
//                       <FormField
//                         control={form.control}
//                         name="duration"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Telefone</FormLabel>
//                             <FormControl>
//                               <Input type="text" inputMode="decimal" placeholder="Preço" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
                      
//                       <FormRootErrorMessage />
//                     </div>

//                     <div className="mt-3 grid gap-3">
//                       <Button
//                         type="submit"
//                         isLoading={form.formState.isLoading || form.formState.isSubmitting}
//                         IconLeft={<ShoppingBag />}
//                       >
//                         Cadastrar
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </form>
//         </Form>

//         {/* <div className="flex items-center space-x-2">
//           <div className="grid flex-1 gap-2">
//             <Label htmlFor="link" className="sr-only">
//               Link
//             </Label>
//             <Input
//               id="link"
//               defaultValue="https://ui.shadcn.com/docs/installation"
//               readOnly
//             />
//           </div>
//           <Button type="submit" size="sm" className="px-3">
//             <span className="sr-only">Copy</span>
//             <Copy />
//           </Button>
//         </div> */}
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
