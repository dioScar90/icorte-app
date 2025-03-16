import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useClipBoard } from '@/utils/copy-to-clipboard'
import { debounce } from '@/utils/debounce'
import { applyMask } from '@/utils/mask'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { z } from 'zod'

export const Route = createFileRoute(
  '/(authenticated-only)/admin/last-users',
)({
  component: RouteComponent,
  beforeLoad: ({ context, search, location }) => ({
    queryOptions: (init?: number) =>
      queryOptions({
        queryKey: [location.pathname, { take: init ?? search?.take }],
        queryFn: () => context.admin.getLastUsers(init ?? search?.take)
          .then(resp => resp)
          .then(resp => {
            if (!resp.isSuccess) {
              throw resp.error
            }

            if (!resp.value?.length) {
              return []
            }

            return resp.value
          })
          .catch(err => {
            context.handleError(err)
            return []
          }),
      })
  }),
  loader: async ({ context: { queryClient, queryOptions } }) =>
    queryClient.ensureQueryData(queryOptions(5)),
  validateSearch: z.object({
    take: z.number().int().optional(),
  }),
})

function RouteComponent() {
  const queryOptions = Route.useRouteContext({ select: (s) => s.queryOptions })

  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()

  const { data: users } = useSuspenseQuery(queryOptions())
  
  const [take, setTake] = useState(search?.take)
  const [takeParam, _setTakeParam] = useState(search?.take)
  const { copyToClipboard } = useClipBoard()

  const setTakeParam = debounce((take?: number) => _setTakeParam(take))
  
  useEffect(() => {
    navigate({
      search: (prev) => ({ ...prev, take: takeParam }),
      replace: true,
    })
  }, [takeParam])
  
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
                  value={take} min={1} step={1} type="number" inputMode="numeric"
                  onChange={e => {
                    const value = +e.currentTarget.value || undefined
                    setTake(value)
                    setTakeParam(value)
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
                    {users.length > 0 ? (
                      users.map(({ id, firstName, lastName, email, phoneNumber, isBarberShop }) => (
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
                    ) : (
                      <TableRow>
                        <TableCell colSpan={100}>
                          <Alert variant="warning">
                            <AlertDescription className="text-center my-1">
                              Nada para exibir
                            </AlertDescription>
                          </Alert>
                        </TableCell>
                      </TableRow>
                    )}
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
