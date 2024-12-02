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
import { Link, useSearchParams } from "react-router-dom"
import { useHandleErrors } from "@/providers/handleErrorProvider"
import { debounce } from "@/utils/debounce"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Prettify } from "@/utils/types/prettify"
import { UserByName } from "@/types/custom-models/user-by-name"
import { applyMask } from "@/utils/mask"
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard"
import { useClipBoard } from "@/utils/copy-to-clipboard"
import { useAdminLayout } from "@/components/layouts/admin-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ListEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ROUTE_ENUM } from "@/types/route"

const NOT_FOUND_TEXT = 'Não encontrado'

function getNotFoundState() {
  return {
    id: -1,
    email: NOT_FOUND_TEXT,
    phoneNumber: NOT_FOUND_TEXT,
    firstName: NOT_FOUND_TEXT,
    lastName: NOT_FOUND_TEXT,
  } as const
}

type NotFoundState = Prettify<ReturnType<typeof getNotFoundState>>

const INITIAL_TEXT = 'Digite para começar'

function getInitialValue() {
  return {
    id: 0,
    email: INITIAL_TEXT,
    phoneNumber: INITIAL_TEXT,
    firstName: INITIAL_TEXT,
    lastName: INITIAL_TEXT,
  } as const
}

type InitialState = Prettify<ReturnType<typeof getInitialValue>>

type OneOrMoreUsers = [UserByName, ...UserByName[]]
type UserState = OneOrMoreUsers | [InitialState] | [NotFoundState]

type UserAction =
  | { type: 'SET_MANY', payload: OneOrMoreUsers }
  | { type: 'SET_NOT_FOUND' }
  | { type: 'CLEAR' }

function userReducer(_: UserState, action: UserAction): UserState {
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


const initialState: [InitialState] = [getInitialValue()]

export function SearchUsersByNamePage() {
  const { handleError } = useHandleErrors()
  const { searchByName } = useAdminLayout()
  const [state, dispatch] = useReducer(userReducer, initialState)
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q')
  const [value, setValue] = useState(q ?? '')
  const { copyToClipboard } = useClipBoard()
  
  const handleValueToSearchParam = useCallback(debounce((q?: string) => {
    setSearchParams(!q?.length ? undefined : { q })
  }), [])
  
  const getUserTableRow = useCallback(function<T extends UserState[number]>(stateItem: T) {
    const isInitial = (_st: UserState[number]): _st is InitialState => _st.email === INITIAL_TEXT
    const isNotFound = (_st: UserState[number]): _st is NotFoundState => _st.email === NOT_FOUND_TEXT
    
    if (isInitial(stateItem)) {
      return (
        <TableRow key={stateItem.id}>
          <TableCell colSpan={100}>
            <Alert variant="default">
              <AlertDescription className="text-center my-1">
                {stateItem.email}
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
                {stateItem.email}
              </AlertDescription>
            </Alert>
          </TableCell>
        </TableRow>
      )
    }
    
    const fullName = stateItem.firstName + ' ' + stateItem.lastName
    
    return (
      <TableRow key={stateItem.id}>
        <TableCell className="font-medium text-center">{fullName}</TableCell>
        <TableCell className="text-center">{stateItem.email}</TableCell>
        <TableCell className="text-center">
          <CopyToClipboard onClick={() => copyToClipboard(stateItem.email)} innerText="Copiar email" />
        </TableCell>
        <TableCell className="text-center">{applyMask('PHONE_NUMBER', stateItem.phoneNumber)}</TableCell>
        <TableCell className="text-center">{stateItem.isBarberShop ? 'Barbeiro' : 'Cliente'}</TableCell>
      </TableRow>
    )
  }, [])
  
  useEffect(() => {
    if (!q?.length) {
      dispatch({ type: 'CLEAR' })
    } else {
      searchByName(q)
        .then(resp => resp)
        .then(resp => {
          console.log('items', resp.value)
          if (!resp.isSuccess) {
            throw resp.error
          }
          
          if (!resp.value?.length) {
            dispatch({ type: 'SET_NOT_FOUND' })
            return
          }
          
          dispatch({ type: 'SET_MANY', payload: resp.value as OneOrMoreUsers })
        })
        .catch(err => {
          dispatch({ type: 'CLEAR' })
          handleError(err)
        })
    }
  }, [q])
  
  return (
    <>
      <div className="before-card">
        <Card className="mx-auto max-w-sm min-w-[80vw] md:min-w-[750px] lg:min-w-[800px]">
          <CardHeader>
            <CardTitle className="text-2xl">Usuários</CardTitle>
            <CardDescription>
              Pesquise um email desejado para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  placeholder="Digite para pesquisar"
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
                      <TableHead className="w-[100px] text-center">Nome</TableHead>
                      <TableHead className="text-center">Email</TableHead>
                      <TableHead className="text-center"></TableHead>
                      <TableHead className="text-center">Telefone</TableHead>
                      <TableHead className="text-center">Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.map(getUserTableRow)}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="flex justify-center align-center mt-4">
              <Link
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
                to={`${ROUTE_ENUM.ADMIN}/last-users`}
              >
                <ListEnd />
                Last users
              </Link>
            </div>
          </CardContent>

        </Card>
      </div>
    </>
  )
}
