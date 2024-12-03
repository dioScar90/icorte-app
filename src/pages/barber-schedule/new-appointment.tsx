import { useCallback, useEffect, useReducer, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useSearchParams } from "react-router-dom"
import { useBarberScheduleLayout } from "@/components/layouts/barber-schedule-layout"
import { ServiceByName } from "@/types/custom-models/service-by-name"
import { useHandleErrors } from "@/providers/handleErrorProvider"
import { debounce } from "@/utils/debounce"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Prettify } from "@/utils/types/prettify"
import { getNumberAsCurrency } from "@/utils/currency"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FormNewAppointment, NewAppointmentProps } from "@/components/forms/form-new-appointment"
import { Scissors } from "lucide-react"
import { LineClamp } from "@/components/line-clamp"
import { useAuth } from "@/providers/authProvider"

const NOT_FOUND_TEXT = 'Não encontrado'

function getNotFoundState() {
  return {
    id: -1,
    barberShopId: -1,
    barberShopName: NOT_FOUND_TEXT,
    name: NOT_FOUND_TEXT,
    description: NOT_FOUND_TEXT,
    price: 0.00,
    duration: '00:00:00',
  } as const
}

type NotFoundState = Prettify<ReturnType<typeof getNotFoundState>>

const INITIAL_TEXT = 'Digite para começar'

function getInitialValue() {
  return {
    id: 0,
    barberShopId: 0,
    barberShopName: INITIAL_TEXT,
    name: INITIAL_TEXT,
    description: INITIAL_TEXT,
    price: 0.00,
    duration: '00:00:00',
  } as const
}

type InitialState = Prettify<ReturnType<typeof getInitialValue>>

type OneOrMoreServices = [ServiceByName, ...ServiceByName[]]
type ServiceState = OneOrMoreServices | [InitialState] | [NotFoundState]

type ServiceAction =
  | { type: 'SET_MANY', payload: OneOrMoreServices }
  | { type: 'SET_NOT_FOUND' }
  | { type: 'CLEAR' }

function serviceReducer(_: ServiceState, action: ServiceAction): ServiceState {
  switch (action.type) {
    case 'SET_MANY':
      return [...action.payload]
    case 'SET_NOT_FOUND':
      return [getNotFoundState()]
    case 'CLEAR':
      return [getInitialValue()]
    default:
      return [getNotFoundState()]
  }
}

const EVENT_OPEN_MODAL_TYPE = 'open-modal'

type OpenModalEventDetail = {
  barberShopId: number
  defaultServiceId: number
}

function dispatchOpenModalEvent(barberShopId: number, defaultServiceId: number) {
  const event = new CustomEvent<OpenModalEventDetail>(EVENT_OPEN_MODAL_TYPE, {
    detail: { barberShopId, defaultServiceId }
  })
  dispatchEvent(event)
}

function getServiceTableRow<T extends ServiceState[number]>(stateItem: T) {
  const isInitial = (_st: ServiceState[number]): _st is InitialState => _st.name === INITIAL_TEXT
  const isNotFound = (_st: ServiceState[number]): _st is NotFoundState => _st.name === NOT_FOUND_TEXT
  
  if (isInitial(stateItem)) {
    return (
      <TableRow key={stateItem.id}>
        <TableCell colSpan={100}>
          <Alert variant="default">
            <AlertDescription className="text-center my-1">
              {stateItem.name}
            </AlertDescription>
          </Alert>
        </TableCell>
      </TableRow>
    )
  }
  
  if (isNotFound(stateItem)) {
    return (
      <TableRow key={stateItem.id}>
        <TableCell colSpan={100}>
          <Alert variant="warning">
            <AlertDescription className="text-center my-1">
              {stateItem.name}
            </AlertDescription>
          </Alert>
        </TableCell>
      </TableRow>
    )
  }
  
  return (
    <TableRow key={stateItem.id}>
      <TableCell className="text-center">{stateItem.barberShopName}</TableCell>
      <TableCell className="text-center">
        <Button
          onClick={() => dispatchOpenModalEvent(stateItem.barberShopId, stateItem.id)}
        >
          Abrir
        </Button>
      </TableCell>
      <TableCell className="text-center">{stateItem.name}</TableCell>
      <TableCell className="text-center">
        <LineClamp limit={2}>
          {stateItem.description}
        </LineClamp>
      </TableCell>
      <TableCell className="text-center">{getNumberAsCurrency(stateItem.price)}</TableCell>
    </TableRow>
  )
}

const initialState: [InitialState] = [getInitialValue()]

export function NewAppointmentPage() {
  const { isAdmin } = useAuth()
  
  if (!isAdmin) {
    return (
      <p>Página ainda em construção...</p>
    )
  }
  
  const { handleError } = useHandleErrors()
  const { servicesByName, createAppointment, getAbailableSlots, getAllServices } = useBarberScheduleLayout()
  const [state, dispatch] = useReducer(serviceReducer, initialState)
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q')
  const [value, setValue] = useState(q ?? '')
  const [chosedBarberId, setChosedBarberId] = useState<NewAppointmentProps | null>(null)
  
  const handleValueToSearchParam = useCallback(debounce((q?: string) => {
    setSearchParams(!q?.length ? undefined : { q })
  }), [])

  const [isLoading, setIsLoading] = useState(false)

  const setLoadingState = useCallback((arg: boolean) => setIsLoading(arg), [])
  const closeModal = useCallback(() => setChosedBarberId(null), [])
  
  const openModal = useCallback((barberShopId: number, defaultServiceId: number) => {
    if (barberShopId > 0) {
      setChosedBarberId({
        formId: 'register-appointment',
        barberShopId,
        defaultServiceId,
        closeModal,
        setLoadingState,
        getAbailableSlots,
        getAllServices,
        register: createAppointment,
      })
    }
  }, [])
  
  useEffect(() => {
    if (!q?.length) {
      dispatch({ type: 'CLEAR' })
    } else {
      servicesByName(q)
        .then(resp => resp)
        .then(resp => {
          if (!resp.isSuccess) {
            throw resp.error
          }
          
          if (!resp.value.items.length) {
            dispatch({ type: 'SET_NOT_FOUND' })
            return
          }
          
          dispatch({ type: 'SET_MANY', payload: resp.value.items as OneOrMoreServices })
        })
        .catch(err => {
          dispatch({ type: 'CLEAR' })
          handleError(err)
        })
    }
  }, [q])
  
  function handleDialogOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setChosedBarberId(null)
    }
  }
  
  useEffect(() => {
    const listener = (event: Event) => openModal(
      (event as CustomEvent<OpenModalEventDetail>).detail.barberShopId,
      (event as CustomEvent<OpenModalEventDetail>).detail.defaultServiceId
    )
    window.addEventListener(EVENT_OPEN_MODAL_TYPE, listener)
    
    return () => window.removeEventListener(EVENT_OPEN_MODAL_TYPE, listener)
  }, [])
  
  return (
    <>
      <div className="before-card">
        <Card className="mx-auto max-w-sm min-w-[80vw] md:min-w-[750px] lg:min-w-[800px]">
          <CardHeader>
            <CardTitle className="text-2xl">Serviços</CardTitle>
            <CardDescription>
              Pesquise um serviço desejado para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  placeholder="Digite qual serviço deseja"
                  value={value} type="search" inputMode="search"
                  onChange={e => {
                    setValue(e.currentTarget.value)
                    handleValueToSearchParam(e.currentTarget.value)
                  }}
                  className="max-w-sm"
                />
              </div>
              <div className="grid gap-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] text-center">Barbearia</TableHead>
                      <TableHead className="text-center"></TableHead>
                      <TableHead className="text-center">Serviço</TableHead>
                      <TableHead className="text-center">Descrição</TableHead>
                      <TableHead className="text-center">Preço</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.map(getServiceTableRow)}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={!!chosedBarberId} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar horário</DialogTitle>
          </DialogHeader>
          
          {!!chosedBarberId && (
            <FormNewAppointment {...chosedBarberId} />
          )}
          
          <DialogFooter className="grid grid-cols-2 md:flex md:justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            
            {!!chosedBarberId && (
              <Button
                type="submit"
                form={chosedBarberId.formId}
                isLoading={isLoading}
                IconLeft={<Scissors />}
              >
                Agendar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
