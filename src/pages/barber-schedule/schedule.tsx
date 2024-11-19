import { useCallback, useEffect, useReducer, useState } from "react"
import {
  ColumnDef,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useOutletContext } from "react-router-dom"
import { BarberScheduleLayoutContextType } from "@/components/layouts/barber-schedule-layout"
import { ServiceByName } from "@/types/custom-models/service-by-name"
import { useHandleErrors } from "@/providers/handleErrorProvider"
import { debounce } from "@/utils/debounce"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Prettify } from "@/utils/types/prettify"

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

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
  console.log('action.type', action.type)
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

function getServiceTableRow<T extends ServiceState[number]>(stateItem: T) {
  const isInitial = (_st: ServiceState[number]): _st is InitialState => _st.name === INITIAL_TEXT
  const isNotFound = (_st: ServiceState[number]): _st is NotFoundState => _st.name === NOT_FOUND_TEXT
  
  if (isInitial(stateItem)) {
    return (
      <TableRow key={stateItem.id}>
        <TableCell colSpan={100}>{stateItem.name}</TableCell>
      </TableRow>
    );
  }
  
  if (isNotFound(stateItem)) {
    return (
      <TableRow key={stateItem.id}>
        <TableCell colSpan={100}>{stateItem.name}</TableCell>
      </TableRow>
    );
  }
  
  return (
    <TableRow key={stateItem.id}>
      <TableCell className="font-medium">{stateItem.barberShopName}</TableCell>
      <TableCell>{stateItem.name}</TableCell>
      <TableCell className="line-clamp-2">{stateItem.description}</TableCell>
      <TableCell className="text-right">{stateItem.price}</TableCell>
    </TableRow>
  );
}

const initialState: [InitialState] = [getInitialValue()]

export function SchedulePage() {
  const { handleError } = useHandleErrors()
  const { servicesByName } = useOutletContext<BarberScheduleLayoutContextType>()
  const [state, dispatch] = useReducer(serviceReducer, initialState)
  const [value, setValue] = useState('')
  const [valueToDebounce, setValueToDebounce] = useState('')
  
  const setValueeeee = useCallback(debounce(setValueToDebounce), [])
  
  useEffect(() => {
    if (!valueToDebounce.length) {
      dispatch({ type: 'CLEAR' })
    } else {
      servicesByName(valueToDebounce)
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
  }, [valueToDebounce])
  
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
                    setValueeeee(e.currentTarget.value?.trim() ?? '')
                  }}
                  className="max-w-sm"
                />
              </div>
              <div className="grid gap-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Barbearia</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
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
    </>
  )
}
