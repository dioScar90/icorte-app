import { DivBeforeCard } from '@/components/div-before-card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { UserByName } from '@/types/custom-models/user-by-name'
import { useClipBoard } from '@/utils/copy-to-clipboard'
import { debounce } from '@/utils/debounce'
import { applyMask } from '@/utils/mask'
import { Link, useNavigate } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { ListEnd } from 'lucide-react'
import { useEffect, useReducer, useState } from 'react'
import { z } from 'zod'

export const Route = createFileRoute(
  '/(authenticated-only)/admin/search-users',
)({
  component: RouteComponent,
  validateSearch: z.object({
    q: z.string().optional(),
  }),
})

const notFoundState = {
  id: 'NOT_FOUND',
  description: 'Não encontrado',
} as const

type NotFoundState = typeof notFoundState

const initialState = {
  id: 'INITIAL_STATE',
  description: 'Digite para começar',
} as const

type InitialState = typeof initialState

type OneOrMoreUsers = [UserByName, ...UserByName[]]
type UserState = OneOrMoreUsers | InitialState | NotFoundState

function isInitial(_st: UserState): _st is InitialState {
  return !Array.isArray(_st) && _st.id === 'NOT_FOUND'
}

function isNotFound(_st: UserState): _st is NotFoundState {
  return !Array.isArray(_st) && _st.id === 'INITIAL_STATE'
}

type UserActionType = [
  'SET_MANY',
  'SET_NOT_FOUND',
  'CLEAR',
][number]

type UserAction<TType = UserActionType> =
  TType extends 'SET_MANY'
    ? {
      type: TType,
      payload: OneOrMoreUsers,
    } : {
      type: TType,
    }

function userReducer(_: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_MANY':
      return [...action.payload]
    case 'SET_NOT_FOUND':
      return notFoundState
    case 'CLEAR':
      return initialState
    default:
      return notFoundState
  }
}

function TableBodyWithRows({ state }: { state: UserState }) {
  const { copyToClipboard } = useClipBoard()

  if (isInitial(state)) {
    return (
      <TableRow key={state.id}>
        <TableCell colSpan={100}>
          <Alert variant="default">
            <AlertDescription className="text-center my-1">
              {state.description}
            </AlertDescription>
          </Alert>
        </TableCell>
      </TableRow>
    )
  }
  
  if (isNotFound(state)) {
    return (
      <TableRow key={state.id}>
        <TableCell colSpan={100}>
          <Alert variant="warning">
            <AlertDescription className="text-center my-1">
              {state.description}
            </AlertDescription>
          </Alert>
        </TableCell>
      </TableRow>
    )
  }
  
  return state.map(({ id, email, phoneNumber, isBarberShop, firstName, lastName }) => (
    <TableRow key={id}>
      <TableCell className="font-medium text-center">{firstName + ' ' + lastName}</TableCell>
      <TableCell className="text-center">{email}</TableCell>
      <TableCell className="text-center">
        <CopyToClipboard onClick={() => copyToClipboard(email)} innerText="Copiar email" />
      </TableCell>
      <TableCell className="text-center">{applyMask('PHONE_NUMBER', phoneNumber)}</TableCell>
      <TableCell className="text-center">{isBarberShop ? 'Barbeiro' : 'Cliente'}</TableCell>
    </TableRow>
  ))
}

function RouteComponent() {
  const [handleError, searchByName] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.admin.searchByName,
    ] as const
  })
  
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()

  const [state, dispatch] = useReducer(userReducer, initialState)
  
  const [q, setQ] = useState(search?.q)
  const [qParam, _setQParam] = useState(search?.q)

  const setQParam = debounce((q?: string) => _setQParam(q))
  
  useEffect(() => {
    navigate({
      search: (prev) => ({ ...prev, q: qParam }),
      replace: true,
    })
  }, [qParam])
  
  useEffect(() => {
    if (!q?.length) {
      dispatch({ type: 'CLEAR' })
    } else {
      searchByName(q)
        .then(resp => resp)
        .then(resp => {
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
    <DivBeforeCard>
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
                value={q} type="search" inputMode="search"
                onChange={e => {
                  setQ(e.currentTarget.value)
                  setQParam(e.currentTarget.value)
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
                  <TableBodyWithRows state={state} />
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="flex justify-center align-center mt-4">
            <Link
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
              to="/admin/last-users"
            >
              <ListEnd />
              Last users
            </Link>
          </div>
        </CardContent>

      </Card>
    </DivBeforeCard>
  )
}
