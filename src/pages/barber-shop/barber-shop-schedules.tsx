import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorClosed, DoorOpen, Edit, ShoppingBag, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCallback, useEffect, useReducer, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormRecurringSchedule, RecurringScheduleRegisterProps, RecurringScheduleRemoveProps, RecurringScheduleUpdateProps } from "@/components/forms/form-recurring-schedule";
import { FormSpecialSchedule, SpecialScheduleRegisterProps, SpecialScheduleRemoveProps, SpecialScheduleUpdateProps } from "@/components/forms/form-special-schedule";
import { useSchedulesLayout } from "@/components/layouts/barber-shop-schedules-layout";
import { getEnumAsString } from "@/utils/enum-as-array";
import { DayOfWeekEnum } from "@/schemas/recurringSchedule";
import { Separator } from "@/components/ui/separator";
import { TimeOnly } from "@/utils/types/date";
import { getFormattedDate } from "@/schemas/sharedValidators/dateOnly";

type AllClosedState = {
  open: false
}

type DialogRecurringScheduleRegisterState = {
  open: true,
  scheduleType: 'recurring',
  submitBtnInnerText: 'Cadastrar',
  submitBtnVariant: 'default',
  dialogTitle: 'Novo serviço',
  dialogDescription: 'Preencha os campos abaixo para criar um novo serviço.',
  barberShopId: number,
} & RecurringScheduleRegisterProps

type DialogRecurringScheduleUpdateState = {
  open: true,
  scheduleType: 'recurring',
  submitBtnInnerText: 'Atualizar',
  submitBtnVariant: 'default',
  dialogTitle: 'Atualizar serviço',
  dialogDescription: 'Confira os campos abaixo para atualizar o serviço.',
  barberShopId: number,
} & RecurringScheduleUpdateProps

type DialogRecurringScheduleRemoveState = {
  open: true,
  scheduleType: 'recurring',
  submitBtnInnerText: 'Remover',
  submitBtnVariant: 'destructive',
  dialogTitle: 'Remover serviço',
  dialogDescription: 'ATENÇÃO - Serviço será removido.',
  barberShopId: number,
} & RecurringScheduleRemoveProps

type DialogSpecialScheduleRegisterState = {
  open: true,
  scheduleType: 'special',
  submitBtnInnerText: 'Cadastrar',
  submitBtnVariant: 'default',
  dialogTitle: 'Novo serviço',
  dialogDescription: 'Preencha os campos abaixo para criar um novo serviço.',
  barberShopId: number,
} & SpecialScheduleRegisterProps

type DialogSpecialScheduleUpdateState = {
  open: true,
  scheduleType: 'special',
  submitBtnInnerText: 'Atualizar',
  submitBtnVariant: 'default',
  dialogTitle: 'Atualizar serviço',
  dialogDescription: 'Confira os campos abaixo para atualizar o serviço.',
  barberShopId: number,
} & SpecialScheduleUpdateProps

type DialogSpecialScheduleRemoveState = {
  open: true,
  scheduleType: 'special',
  submitBtnInnerText: 'Remover',
  submitBtnVariant: 'destructive',
  dialogTitle: 'Remover serviço',
  dialogDescription: 'ATENÇÃO - Serviço será removido.',
  barberShopId: number,
} & SpecialScheduleRemoveProps

type DialogState =
  | AllClosedState
  | DialogRecurringScheduleRegisterState
  | DialogRecurringScheduleUpdateState
  | DialogRecurringScheduleRemoveState
  | DialogSpecialScheduleRegisterState
  | DialogSpecialScheduleUpdateState
  | DialogSpecialScheduleRemoveState

type DialogRecurringScheduleRegisterAction = Pick<DialogRecurringScheduleRegisterState, 'action' | 'barberShopId'>
type DialogRecurringScheduleUpdateAction = Pick<DialogRecurringScheduleUpdateState, 'action' | 'barberShopId' | 'dayOfWeek' | 'schedule'>
type DialogRecurringScheduleRemoveAction = Pick<DialogRecurringScheduleRemoveState, 'action' | 'barberShopId' | 'dayOfWeek' | 'schedule'>
type DialogSpecialScheduleRegisterAction = Pick<DialogSpecialScheduleRegisterState, 'action' | 'barberShopId'>
type DialogSpecialScheduleUpdateAction = Pick<DialogSpecialScheduleUpdateState, 'action' | 'barberShopId' | 'date' | 'schedule'>
type DialogSpecialScheduleRemoveAction = Pick<DialogSpecialScheduleRemoveState, 'action' | 'barberShopId' | 'date' | 'schedule'>

type DialogAction =
  | { type: 'ALL_CLOSED' }
  | { type: 'RECURRING_REGISTER_FORM', payload: DialogRecurringScheduleRegisterAction }
  | { type: 'RECURRING_UPDATE_FORM', payload: DialogRecurringScheduleUpdateAction }
  | { type: 'RECURRING_REMOVE_FORM', payload: DialogRecurringScheduleRemoveAction }
  | { type: 'SPECIAL_REGISTER_FORM', payload: DialogSpecialScheduleRegisterAction }
  | { type: 'SPECIAL_UPDATE_FORM', payload: DialogSpecialScheduleUpdateAction }
  | { type: 'SPECIAL_REMOVE_FORM', payload: DialogSpecialScheduleRemoveAction }

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case 'RECURRING_REGISTER_FORM':
      return {
        ...action.payload,
        open: true,
        scheduleType: 'recurring',
        formId: 'recurring-register-form',
        submitBtnInnerText: 'Cadastrar',
        submitBtnVariant: 'default',
        dialogTitle: 'Novo serviço',
        dialogDescription: 'Preencha os campos abaixo para criar um novo serviço.',
      }
    case 'RECURRING_UPDATE_FORM':
      return {
        ...state,
        ...action.payload,
        open: true,
        scheduleType: 'recurring',
        formId: 'recurring-update-form',
        submitBtnInnerText: 'Atualizar',
        submitBtnVariant: 'default',
        dialogTitle: 'Atualizar serviço',
        dialogDescription: 'Confira os campos abaixo para atualizar o serviço.',
      }
    case 'RECURRING_REMOVE_FORM':
      return {
        ...action.payload,
        open: true,
        scheduleType: 'recurring',
        formId: 'recurring-remove-form',
        submitBtnInnerText: 'Remover',
        submitBtnVariant: 'destructive',
        dialogTitle: 'Remover serviço',
        dialogDescription: 'ATENÇÃO - Serviço será removido.',
      }
    case 'SPECIAL_REGISTER_FORM':
      return {
        ...action.payload,
        open: true,
        scheduleType: 'special',
        formId: 'special-register-form',
        submitBtnInnerText: 'Cadastrar',
        submitBtnVariant: 'default',
        dialogTitle: 'Novo serviço',
        dialogDescription: 'Preencha os campos abaixo para criar um novo serviço.',
      }
    case 'SPECIAL_UPDATE_FORM':
      return {
        ...state,
        ...action.payload,
        open: true,
        scheduleType: 'special',
        formId: 'special-update-form',
        submitBtnInnerText: 'Atualizar',
        submitBtnVariant: 'default',
        dialogTitle: 'Atualizar serviço',
        dialogDescription: 'Confira os campos abaixo para atualizar o serviço.',
      }
    case 'SPECIAL_REMOVE_FORM':
      return {
        ...action.payload,
        open: true,
        scheduleType: 'special',
        formId: 'special-remove-form',
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

export function BarberShopSchedules() {
  const { barberShop, recurring, special } = useSchedulesLayout()
  
  const [isLoading, setIsLoading] = useState(false)
  const [state, dispatch] = useReducer(dialogReducer, { open: false })

  const setLoadingState = useCallback((arg: boolean) => setIsLoading(arg), [])
  const closeModal = useCallback(() => dispatch({ type: 'ALL_CLOSED' }), [])

  const formatTimeOnly = useCallback((time: TimeOnly) => {
    const [hh, mm] = time.split(':')
    return hh + 'h' + mm
  }, [])
  
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
            <CardTitle className="text-2xl">Horários recorrentes - {barberShop.name}</CardTitle>
            <CardDescription>
              Adicione os dias da semana e horários que você atenderá.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-4 px-2 md:px-3 lg:px-4">
            <Table>
              <TableCaption>Sua lista de horários recorrentes.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Dia</TableHead>
                  <TableHead className="text-center">Abertura</TableHead>
                  <TableHead className="text-center">Fechamento</TableHead>
                  <TableHead className="text-center w-[100px]">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(recurring.schedules?.items) && recurring.schedules.items.length > 0
                  ? recurring.schedules.items.map(({ barberShopId, ...schedule }) => (
                    <TableRow key={schedule.dayOfWeek} data-barber-shop-id={barberShopId}>
                      <TableCell className="text-center">{getEnumAsString(DayOfWeekEnum, schedule.dayOfWeek)}</TableCell>
                      <TableCell className="text-center">{formatTimeOnly(schedule.openTime)}</TableCell>
                      <TableCell className="text-center">{formatTimeOnly(schedule.closeTime)}</TableCell>
                      <TableCell className="text-center w-[100px]">
                        <div className="flex justify-between gap-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            title="Editar"
                            onClick={() => dispatch({ type: 'RECURRING_UPDATE_FORM', payload: { action: recurring.update, barberShopId, dayOfWeek: schedule.dayOfWeek, schedule } })}
                          >
                            <Edit />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            title="Remover"
                            onClick={() => dispatch({ type: 'RECURRING_REMOVE_FORM', payload: { action: recurring.remove, barberShopId, dayOfWeek: schedule.dayOfWeek, schedule } })}
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
                            Nenhum horário recorrente cadastrado
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
                onClick={() => dispatch({ type: 'RECURRING_REGISTER_FORM', payload: { action: recurring.register, barberShopId: barberShop.id } })}
              >
                <ShoppingBag />
                Novo
              </Button>
            </div>
          </CardContent>
          
          <Separator />
          
          <CardHeader className="py-4 px-2 md:px-3 lg:px-4">
            <CardTitle className="text-2xl">Horários especiais - {barberShop.name}</CardTitle>
            <CardDescription>
              Adicione horários diferentes do habitual, ou informe o fechamento de algum dia específico.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-4 px-2 md:px-3 lg:px-4">
            <Table>
              <TableCaption>Sua lista de horários especiais.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Dia</TableHead>
                  <TableHead className="text-center">Comentário</TableHead>
                  <TableHead className="text-center">Abertura</TableHead>
                  <TableHead className="text-center">Fechamento</TableHead>
                  <TableHead className="text-center">Fechado</TableHead>
                  <TableHead className="text-center w-[100px]">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(special.schedules?.items) && special.schedules.items.length > 0
                  ? special.schedules.items.map(({ barberShopId, ...schedule }) => (
                    <TableRow key={schedule.date} data-barber-shop-id={barberShopId}>
                      <TableCell className="text-center">{getFormattedDate(schedule.date)}</TableCell>
                      <TableCell className="text-center">{schedule.notes ?? '---'}</TableCell>
                      <TableCell className="text-center">{schedule.isClosed || !schedule.openTime ? '---' : formatTimeOnly(schedule.openTime)}</TableCell>
                      <TableCell className="text-center">{schedule.isClosed || !schedule.closeTime ? '---' : formatTimeOnly(schedule.closeTime)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {schedule.isClosed
                            ? <DoorClosed className="text-red-600" />
                            : <DoorOpen className="text-green-600" />
                          }
                        </div>
                      </TableCell>
                      <TableCell className="text-center w-[100px]">
                        <div className="flex justify-between gap-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            title="Editar"
                            onClick={() => dispatch({ type: 'SPECIAL_UPDATE_FORM', payload: { action: special.update, barberShopId, date: schedule.date, schedule } })}
                          >
                            <Edit />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            title="Remover"
                            onClick={() => dispatch({ type: 'SPECIAL_REMOVE_FORM', payload: { action: special.remove, barberShopId, date: schedule.date, schedule } })}
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
                            Nenhum horário especial cadastrado
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
                onClick={() => dispatch({ type: 'SPECIAL_REGISTER_FORM', payload: { action: special.register, barberShopId: barberShop.id } })}
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
          
          {state.open && state.scheduleType === 'recurring' && (
            <FormRecurringSchedule
              {...state}
              closeModal={closeModal}
              setLoadingState={setLoadingState}
            />
          )}
          
          {state.open && state.scheduleType === 'special' && (
            <FormSpecialSchedule
              {...state}
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
