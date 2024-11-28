import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { getNumberAsCurrency } from "@/utils/currency";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, ShoppingBag, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarberShopServicesLayoutContextType } from "@/components/layouts/barber-shop-services-layout";
import { useCallback, useEffect, useReducer, useState } from "react";
import { ServiceZod } from "@/schemas/service";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import Swal from "sweetalert2";
import { FormRegisterService } from "@/components/service-forms/register-service";
import { FormUpdateService } from "@/components/service-forms/update-service";

type AllClosedState = {
  open: false
}

type DialogRegisterState = {
  open: true
  formId: 'register-form'
  submitBtnInnerText: 'Cadastrar'
  barberShopId: number
}

type DialogUpdateState = {
  open: true
  formId: 'update-form'
  submitBtnInnerText: 'Atualizar'
  barberShopId: number
  serviceId: number
  service: ServiceZod
}

type DialogState =
  | AllClosedState
  | DialogRegisterState
  | DialogUpdateState
  
type DialogRegisterAction = Pick<DialogRegisterState, 'barberShopId'>
type DialogUpdateAction = Pick<DialogUpdateState, 'barberShopId' | 'serviceId' | 'service'>

type DialogAction =
  | { type: 'ALL_CLOSED' }
  | { type: 'REGISTER_FORM', payload: DialogRegisterAction }
  | { type: 'UPDATE_FORM', payload: DialogUpdateAction }

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case 'REGISTER_FORM':
      return {
        ...state,
        ...action.payload,
        open: true,
        formId: 'register-form',
        submitBtnInnerText: 'Cadastrar',
      }
    case 'UPDATE_FORM':
      return {
        ...state,
        ...action.payload,
        open: true,
        formId: 'update-form',
        submitBtnInnerText: 'Atualizar',
      }
    case 'ALL_CLOSED':
      return {
        open: false,
      }
  }
}
  
export function BarberShopServices() {
  const { barberShop, services, register, update, remove } = useOutletContext<BarberShopServicesLayoutContextType>()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { handleError } = useHandleErrors()

  const [isLoading, setIsLoading] = useState(false)
  const [state, dispatch] = useReducer(dialogReducer, { open: false })
  
  const setLoadingState = useCallback((arg: boolean) => setIsLoading(arg), [])
  const closeModal = useCallback(() => dispatch({ type: 'ALL_CLOSED' }), [])
  
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
  
  useEffect(() => {
    if (!state.open) {
      setIsLoading(false)
    }
  }, [state.open])
  
  function handleDialogOpenChange(isOpen: boolean) {
    if (!isOpen) {
      dispatch({ type: 'ALL_CLOSED' })
    }
  }
  
  return (
    <>
      <div className="space-y-6">
        <div className="before-card">
          <Card className="w-full md:max-w-96">
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
                              onClick={() => dispatch({ type: 'UPDATE_FORM', payload: { barberShopId, serviceId, service }})}
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
                  onClick={() => dispatch({ type: 'REGISTER_FORM', payload: { barberShopId: barberShop.id } })}
                >
                  <ShoppingBag />
                  Novo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={state.open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-96">
          <DialogHeader>
            <DialogTitle>Novo serviço</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar um novo serviço.
            </DialogDescription>
          </DialogHeader>
          
          {state.open && state?.formId === 'register-form' && (
            <FormRegisterService { ...state } register={register} closeModal={closeModal} setLoadingState={setLoadingState} />
          )}
          
          {state.open && state?.formId === 'update-form' && (
          <FormUpdateService { ...state } update={update} closeModal={closeModal} setLoadingState={setLoadingState} />
          )}
          
          <DialogFooter className="gap-x-1">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            
            {state.open && (
              <Button
                type="submit"
                form={state.formId}
                isLoading={isLoading}
                IconLeft={<ShoppingBag />}
              >
                {state.submitBtnInnerText}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
