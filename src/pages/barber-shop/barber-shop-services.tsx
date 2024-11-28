import { Button } from "@/components/ui/button";
import { useOutletContext } from "react-router-dom";
import { getNumberAsCurrency } from "@/utils/currency";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, ShoppingBag, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarberShopServicesLayoutContextType } from "@/components/layouts/barber-shop-services-layout";
import { useCallback, useEffect, useReducer, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormService, RegisterProps, RemoveProps, UpdateProps } from "@/components/service-forms/form-service";
import { LineClamp } from "@/components/line-clamp";

type AllClosedState = {
  open: false
}

type DialogRegisterState = {
  open: true,
  submitBtnInnerText: 'Cadastrar',
  submitBtnVariant: 'default',
  dialogTitle: 'Novo serviço',
  dialogDescription: 'Preencha os campos abaixo para criar um novo serviço.',
  barberShopId: number,
} & RegisterProps

type DialogUpdateState = {
  open: true,
  submitBtnInnerText: 'Atualizar',
  submitBtnVariant: 'default',
  dialogTitle: 'Atualizar serviço',
  dialogDescription: 'Confira os campos abaixo para atualizar o serviço.',
  barberShopId: number,
} & UpdateProps

type DialogRemoveState = {
  open: true,
  submitBtnInnerText: 'Remover',
  submitBtnVariant: 'destructive',
  dialogTitle: 'Remover serviço',
  dialogDescription: 'ATENÇÃO - Serviço será removido.',
  barberShopId: number,
} & RemoveProps

type DialogState =
  | AllClosedState
  | DialogRegisterState
  | DialogUpdateState
  | DialogRemoveState
  
type DialogRegisterAction = Pick<DialogRegisterState, 'action' | 'barberShopId'>
type DialogUpdateAction = Pick<DialogUpdateState, 'action' | 'barberShopId' | 'serviceId' | 'service'>
type DialogRemoveAction = Pick<DialogRemoveState, 'action' | 'barberShopId' | 'serviceId' | 'service'>

type DialogAction =
  | { type: 'ALL_CLOSED' }
  | { type: 'REGISTER_FORM', payload: DialogRegisterAction }
  | { type: 'UPDATE_FORM', payload: DialogUpdateAction }
  | { type: 'REMOVE_FORM', payload: DialogRemoveAction }

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case 'REGISTER_FORM':
      return {
        ...action.payload,
        open: true,
        formId: 'register-form',
        submitBtnInnerText: 'Cadastrar',
  submitBtnVariant: 'default',
        dialogTitle: 'Novo serviço',
        dialogDescription: 'Preencha os campos abaixo para criar um novo serviço.',
      }
    case 'UPDATE_FORM':
      return {
        ...state,
        ...action.payload,
        open: true,
        formId: 'update-form',
        submitBtnInnerText: 'Atualizar',
  submitBtnVariant: 'default',
        dialogTitle: 'Atualizar serviço',
        dialogDescription: 'Confira os campos abaixo para atualizar o serviço.',
      }
    case 'REMOVE_FORM':
      return {
        ...action.payload,
        open: true,
        formId: 'remove-form',
        submitBtnInnerText: 'Remover',
        submitBtnVariant: 'destructive',
        dialogTitle: 'Remover serviço',
        dialogDescription: 'ATENÇÃO - Serviço será removido.',
      }
    case 'ALL_CLOSED':
      return {
        open: false,
      }
  }
}
  
export function BarberShopServices() {
  const { barberShop, services, register, update, remove } = useOutletContext<BarberShopServicesLayoutContextType>()

  const [isLoading, setIsLoading] = useState(false)
  const [state, dispatch] = useReducer(dialogReducer, { open: false })
  
  const setLoadingState = useCallback((arg: boolean) => setIsLoading(arg), [])
  const closeModal = useCallback(() => dispatch({ type: 'ALL_CLOSED' }), [])
  
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
      <div className="before-card">
        <Card className="mx-auto max-w-sm min-w-[80vw] md:min-w-[750px] lg:min-w-[800px]">
          <CardHeader className="py-4 px-2 md:px-3 lg:px-4">
            <CardTitle className="text-2xl">Serviços - {barberShop.name}</CardTitle>
            <CardDescription>
              Visualize e gerencia os serviços que aparecerão aos clientes.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-4 px-2 md:px-3 lg:px-4">
            <Table>
              <TableCaption>Sua lista de serviços oferecidos.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Nome</TableHead>
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
                      <TableCell>{service.name}</TableCell>
                      <TableCell>
                        <LineClamp limit={2}>
                          {service.description}
                        </LineClamp>
                      </TableCell>
                      <TableCell>{getNumberAsCurrency(service.price)}</TableCell>
                      <TableCell>{service.duration}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-between gap-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            title="Editar"
                            onClick={() => dispatch({ type: 'UPDATE_FORM', payload: { action: update, barberShopId, serviceId, service }})}
                          >
                            <Edit />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            title="Remover"
                            onClick={() => dispatch({ type: 'REMOVE_FORM', payload: { action: remove, barberShopId, serviceId, service }})}
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
                onClick={() => dispatch({ type: 'REGISTER_FORM', payload: { action: register, barberShopId: barberShop.id } })}
              >
                <ShoppingBag />
                Novo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={state.open} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{state.open && state.dialogTitle}</DialogTitle>
            <DialogDescription>
              {state.open && state.dialogDescription}
            </DialogDescription>
          </DialogHeader>
          
          {state.open && (
            <FormService
              { ...state }
              closeModal={closeModal}
              setLoadingState={setLoadingState}
            />
          )}
          
          <DialogFooter className="grid grid-cols-2 md:flex md:justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            
            {state.open && (
              <Button
                type="submit"
                variant={state.submitBtnVariant}
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
