import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { applyMask } from "@/utils/mask"
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard"
import { useClipBoard } from "@/utils/copy-to-clipboard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLastUsersLayout } from "@/components/layouts/last-users-layout"
import { useCallback, useEffect, useState } from "react"
import { useHandleErrors } from "@/providers/handleErrorProvider"
import { debounce } from "@/utils/debounce"
import { useSearchParams } from "react-router-dom"
import { Input } from "@/components/ui/input"

export function LastUsersPage() {
  const { handleError } = useHandleErrors()
  const { lastUsers, getLastUsers } = useLastUsersLayout()
  const [searchParams, setSearchParams] = useSearchParams()
  const takeParam = searchParams.get('take')
  const [take, setTake] = useState<number | undefined>(+takeParam! || undefined)
  const [users, setUsers] = useState(lastUsers?.value ?? [])
  const { copyToClipboard } = useClipBoard()
  
  const handleValueToSearchParam = useCallback(debounce((take?: number) => {
    setSearchParams(!take ? undefined : { take: String(take.toFixed(0)) })
  }), [])
  
  useEffect(() => {
    if (take === undefined) {
      return
    }
    
    const takeAux = Number.isNaN(takeParam) ? 0 : +takeParam!
    
    if (takeAux === 0) {
      setUsers([])
    }
    
    getLastUsers(takeAux)
      .then(resp => resp)
      .then(resp => {
        console.log('items', resp.value)
        if (!resp.isSuccess) {
          throw resp.error
        }
        
        if (!resp.value?.length) {
          setUsers([])
          return
        }
        
        setUsers(resp.value)
      })
      .catch(err => {
        setUsers([])
        handleError(err)
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
                    const value = +e.currentTarget.value || 0
                    setTake(value)
                    handleValueToSearchParam(value)
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
