import { useCallback, useEffect, useReducer, useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useOutletContext } from "react-router-dom"
import { BarberScheduleLayoutContextType } from "@/components/layouts/barber-schedule-layout"
import { Service } from "@/types/models/service"
import { ServiceByName } from "@/types/custom-models/service-by-name"
import { useHandleErrors } from "@/providers/handleErrorProvider"
import { debounce } from "@/utils/debounce"

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
]

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
  }
}

type InitialState = ReturnType<typeof getInitialValue>

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
  }
}

type NotFoundState = ReturnType<typeof getNotFoundState>

type ServiceState = ServiceByName[] | InitialState | NotFoundState

type ServiceAction =
  | { type: 'SET_MANY', payload: ServiceByName[] }
  | { type: 'SET_NOT_FOUND' }
  | { type: 'CLEAR' }

function serviceReducer(_: ServiceState, action: ServiceAction): ServiceState {
  switch (action.type) {
    case 'SET_MANY':
      return [...action.payload]
    case 'SET_NOT_FOUND':
      return getNotFoundState()
    case 'CLEAR':
      return getInitialValue()
    default:
      return getNotFoundState()
  }
}

function getServicesTableRow(state: ServiceState) {
  const isInitial = (_st: ServiceState): _st is InitialState => !Array.isArray(_st) && _st.name === INITIAL_TEXT
  const isNotFound = (_st: ServiceState): _st is NotFoundState => !Array.isArray(_st) && _st.name === NOT_FOUND_TEXT

  if (isInitial(state) || isNotFound(state)) {
    return (
      <TableRow key={state.id}>
        <TableCell colSpan={100}>{state.name}</TableCell>
      </TableRow>
    )
  }
  
  return state.map(item => {
    return (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{item.barberShopName}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.description}</TableCell>
        <TableCell className="text-right">{item.price}</TableCell>
      </TableRow>
    )
  })
}

export function SchedulePage() {
  const { handleError } = useHandleErrors()
  const { servicesByName } = useOutletContext<BarberScheduleLayoutContextType>()
  const [state, dispatch] = useReducer(serviceReducer, getInitialValue())
  const [value, setValue] = useState('')
  const [valueToDebounce, setValueToDebounce] = useState('')
  
  // const [sorting, setSorting] = useState<SortingState>([])
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
  //   []
  // )
  // const [columnVisibility, setColumnVisibility] =
  //   useState<VisibilityState>({})
  // const [rowSelection, setRowSelection] = useState({})

  // const table = useReactTable({
  //   data,
  //   columns,
  //   onSortingChange: setSorting,
  //   onColumnFiltersChange: setColumnFilters,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   onColumnVisibilityChange: setColumnVisibility,
  //   onRowSelectionChange: setRowSelection,
  //   state: {
  //     sorting,
  //     columnFilters,
  //     columnVisibility,
  //     rowSelection,
  //   },
  // })

  const setValueeeee = useCallback(debounce(function(val: string) {
    setValueToDebounce(val)
  }), [])
  
  useEffect(() => {
    // setTimeout(() => {
      // servicesByName('   cort   mESSi   cR7 ')
      servicesByName(valueToDebounce)
        .then(resp => resp)
        .then(resp => {console.log('resp_vaaaaaai', resp);
          if (!resp.isSuccess) {
            dispatch({ type: 'CLEAR' })
            handleError(resp.error)
            return
          }
          
          if (!resp.value.items.length) {
            dispatch({ type: 'SET_NOT_FOUND' })
            return
          }
          
          dispatch({ type: 'SET_MANY', payload: resp.value.items })
        })
        .catch(err => {
          dispatch({ type: 'CLEAR' })
          handleError(err)
        })
    // }, 2_000)
  }, [valueToDebounce])
  
  return (
    <>
      <Input
        placeholder="Digite qual serviço deseja"
        value={value}
        onChange={e => {
          setValue(e.currentTarget.value)
          setValueeeee(e.currentTarget.value)
        }}
        className="max-w-sm"
      />
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Barbearia</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getServicesTableRow(state)}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  )

  // return (
  //   <div className="w-full">
  //     <div className="flex items-center py-4">
  //       <Input
  //         placeholder="Filter emails..."
  //         value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
  //         onChange={(event) =>
  //           table.getColumn("email")?.setFilterValue(event.target.value)
  //         }
  //         className="max-w-sm"
  //       />
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="outline" className="ml-auto">
  //             Columns <ChevronDown />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           {table
  //             .getAllColumns()
  //             .filter((column) => column.getCanHide())
  //             .map((column) => {
  //               return (
  //                 <DropdownMenuCheckboxItem
  //                   key={column.id}
  //                   className="capitalize"
  //                   checked={column.getIsVisible()}
  //                   onCheckedChange={(value) =>
  //                     column.toggleVisibility(!!value)
  //                   }
  //                 >
  //                   {column.id}
  //                 </DropdownMenuCheckboxItem>
  //               )
  //             })}
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     </div>
  //     <div className="rounded-md border">
  //       <Table>
  //         <TableHeader>
  //           {table.getHeaderGroups().map((headerGroup) => (
  //             <TableRow key={headerGroup.id}>
  //               {headerGroup.headers.map((header) => {
  //                 return (
  //                   <TableHead key={header.id}>
  //                     {header.isPlaceholder
  //                       ? null
  //                       : flexRender(
  //                           header.column.columnDef.header,
  //                           header.getContext()
  //                         )}
  //                   </TableHead>
  //                 )
  //               })}
  //             </TableRow>
  //           ))}
  //         </TableHeader>
  //         <TableBody>
  //           {table.getRowModel().rows?.length ? (
  //             table.getRowModel().rows.map((row) => (
  //               <TableRow
  //                 key={row.id}
  //                 data-state={row.getIsSelected() && "selected"}
  //               >
  //                 {row.getVisibleCells().map((cell) => (
  //                   <TableCell key={cell.id}>
  //                     {flexRender(
  //                       cell.column.columnDef.cell,
  //                       cell.getContext()
  //                     )}
  //                   </TableCell>
  //                 ))}
  //               </TableRow>
  //             ))
  //           ) : (
  //             <TableRow>
  //               <TableCell
  //                 colSpan={columns.length}
  //                 className="h-24 text-center"
  //               >
  //                 No results.
  //               </TableCell>
  //             </TableRow>
  //           )}
  //         </TableBody>
  //       </Table>
  //     </div>
  //     <div className="flex items-center justify-end space-x-2 py-4">
  //       <div className="flex-1 text-sm text-muted-foreground">
  //         {table.getFilteredSelectedRowModel().rows.length} of{" "}
  //         {table.getFilteredRowModel().rows.length} row(s) selected.
  //       </div>
  //       <div className="space-x-2">
  //         <Button
  //           variant="outline"
  //           size="sm"
  //           onClick={() => table.previousPage()}
  //           disabled={!table.getCanPreviousPage()}
  //         >
  //           Previous
  //         </Button>
  //         <Button
  //           variant="outline"
  //           size="sm"
  //           onClick={() => table.nextPage()}
  //           disabled={!table.getCanNextPage()}
  //         >
  //           Next
  //         </Button>
  //       </div>
  //     </div>
  //   </div>
  // )
}
