import { LineClamp } from '@/components/line-clamp'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { getNumberAsCurrency } from '@/utils/currency'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useRouteContext } from '@tanstack/react-router'

export function TableBodyWithRows() {
  const queryOptions = useRouteContext({
    from: '/(authenticated-only)/barber-schedule/new-appointment',
    select: (s) => s.servicesByNameQueryOptions,
  })

  const navigate = useNavigate({
    from: '/barber-schedule/new-appointment',
  })
  
  const { data: services } = useQuery(queryOptions())

  if (!services) {
    return null
  }

  if (!Array.isArray(services) && services.id === 'INITIAL_STATE') {
    return (
      <TableRow key={services.id}>
        <TableCell colSpan={100}>
          <Alert variant="default">
            <AlertDescription className="text-center my-1">
              {services.description}
            </AlertDescription>
          </Alert>
        </TableCell>
      </TableRow>
    )
  }

  if (!Array.isArray(services) && services.id === 'NOT_FOUND') {
    return (
      <TableRow key={services.id}>
        <TableCell colSpan={100}>
          <Alert variant="warning">
            <AlertDescription className="text-center my-1">
              {services.description}
            </AlertDescription>
          </Alert>
        </TableCell>
      </TableRow>
    )
  }

  return services.map(({ id, barberShopName, barberShopId, name, description, price }) => (
    <TableRow key={id}>
      <TableCell className="text-center">{barberShopName}</TableCell>
      <TableCell className="text-center">
        <Button
          size="sm"
          onClick={() => navigate({
            search: (prev) => ({ ...prev, barberShopId }),
            replace: true,
          })}
        >
          Abrir
        </Button>
      </TableCell>
      <TableCell className="text-center">{name}</TableCell>
      <TableCell className="text-center">
        <LineClamp limit={2}>
          {description}
        </LineClamp>
      </TableCell>
      <TableCell className="text-center">{getNumberAsCurrency(price)}</TableCell>
    </TableRow>
  ))
}
