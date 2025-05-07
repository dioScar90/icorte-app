import { DivBeforeCard } from '@/components/div-before-card'
import { DialogNewAppointment } from '@/components/forms/new-appointment/_dialog'
import { TableBodyWithRows } from '@/components/forms/new-appointment/_tableRows'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { debounce } from '@/utils/debounce'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute(
  '/(authenticated-only)/barber-schedule/new-appointment/',
)({
  component: RouteComponent,
})

function InputQ() {
  const navigate = useNavigate({ from: Route.fullPath })
  const q = Route.useSearch({ select: (s) => s.q })
  
  const [qValue, setQValue] = useState(q)
  const [qParam, _setQParam] = useState(q)

  const setQParam = debounce((_q?: string) => _setQParam(_q))
  
  useEffect(() => {
    navigate({
      search: (prev) => ({ ...prev, q: qParam }),
      replace: true,
    })
  }, [qParam])

  return (
    <Input
      placeholder="Digite qual serviço deseja"
      value={qValue} type="search" inputMode="search"
      onChange={e => {
        setQValue(e.currentTarget.value)
        setQParam(e.currentTarget.value)
      }}
      className="max-w-sm"
    />
  )
}

function RouteComponent() {
  return (
    <>
      <DivBeforeCard>
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
                <InputQ />
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
                    <TableBodyWithRows />
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </DivBeforeCard>

      <DialogNewAppointment />
    </>
  )
}
