import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { getNumberAsCurrency } from "@/utils/currency";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, ShoppingBag, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarberShopServicesLayoutContextType } from "@/components/layouts/barber-shop-services-layout";
import { useRef } from "react";
import { ServiceZod } from "@/schemas/service";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Swal from "sweetalert2";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRegisterSchema } from "@/schemas/user";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export function BarberShopServices() {
  const { barberShop, services, register, remove } = useOutletContext<BarberShopServicesLayoutContextType>()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { handleError } = useHandleErrors()
  const openModalBtnRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  
  const form = useForm<ServiceZod>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0.0,
      duration: '00:00:00',
    }
  })
  
  async function onSubmit(data: ServiceZod) {
    try {
      console.log('ora ora ora se não são as minhas escolhas...', data)
      const result = await register(barberShop.id, data)
      
      if (!result.isSuccess) {
        throw result.error
      }
      
      navigate(pathname, { replace: true, state: { message: result.value.message }})
    } catch (err) {
      handleError(err, form)
    }
  }
  
  function handleRemove(serviceId: number) {
    Swal.fire({
      icon: 'question',
      title: 'Excluir',
      text: 'Deseja realmente remover o serviço?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar',
    })
      .then(async ({ isConfirmed }) => {
        if (isConfirmed) {
          try {
            const res = await remove(barberShop.id, serviceId)

            if (!res.isSuccess) {
              throw res.error
            }

            navigate(pathname, { replace: true, state: { message: 'Serviço removido com sucesso' }})
          } catch (err) {
            handleError(err)
          }
        }
      })
  }

  const FORM_REGISTER_ID = "form-register"
  
  return (
    <>
      <div className="space-y-6">
        <div className="before-card">
          <Card className="w-full md:max-w-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Serviços - {barberShop.name}</CardTitle>
              <CardDescription>
                Visualize e gerencia os serviços que aparecerão aos clientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Sua lista de serviços oferecidos.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px] text-center">Nome</TableHead>
                    <TableHead className="text-center">Descrição</TableHead>
                    <TableHead className="text-center">Preço</TableHead>
                    <TableHead className="text-center">Duração</TableHead>
                    <TableHead className="text-center">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(services?.items) && services.items.length > 0
                    ? services.items.map(({ id: serviceId, barberShopId, ...service }) => (
                      <TableRow key={serviceId} data-barber-shop-id={barberShopId}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell className="line-clamp-2">{service.description}</TableCell>
                        <TableCell>{getNumberAsCurrency(service.price)}</TableCell>
                        <TableCell>{service.duration}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-between gap-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              title="Editar"
                              onClick={() => toast({ variant: "destructive", description: "Indisponível no momento" })}
                            >
                              <Edit />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              title="Remover"
                              onClick={() => handleRemove(serviceId)}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                    : (
                      <TableRow>
                        <TableCell colSpan={100}>
                          <Alert variant="warning">
                            <AlertDescription className="text-center my-1">
                              Nenhum serviço cadastrado
                            </AlertDescription>
                          </Alert>
                        </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
              
              <div className="w-full h-14 relative">
                <Button
                  type="button" className="absolute-middle-y right-0"
                  onClick={() => openModalBtnRef.current?.click()}
                >
                  <ShoppingBag />
                  Novo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button style={{ display: 'none' }} ref={openModalBtnRef}>Vai</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id={FORM_REGISTER_ID} ref={formRef} className="space-y-6">
              <DialogHeader>
                <DialogTitle>Novo serviço</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para criar um novo serviço.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3">
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
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Descrição (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço</FormLabel>
                      <FormControl>
                        <Input type="text" inputMode="decimal" placeholder="Preço" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração</FormLabel>
                      <FormControl>
                        <Input type="text" inputMode="numeric" placeholder="Duração" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormRootErrorMessage />
                
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  
                  <Button
                    type="submit"
                    form={FORM_REGISTER_ID}
                    isLoading={form.formState.isLoading || form.formState.isSubmitting}
                    IconLeft={<ShoppingBag />}
                  >
                    Cadastrar
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
