import { LineClamp } from '@/components/line-clamp'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { getNumberAsCurrency } from '@/utils/currency'
import { useNavigate } from '@tanstack/react-router'
import { Edit, Trash2 } from 'lucide-react'
import { Route } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/services'

export function TableBodyWithRows() {
  const [services] = Route.useLoaderData({
    select: (s) => [
      s.services,
    ] as const
  })
  
  const navigate = useNavigate({
    from: Route.fullPath,
  })
  
  if (!services.length) {
    return (
      <TableRow>
        <TableCell colSpan={100}>
          <Alert variant="warning">
            <AlertDescription className="text-center my-1">
              Nenhum serviço cadastrado
            </AlertDescription>
          </Alert>
        </TableCell>
      </TableRow>
    )
  }
  
  return services.map(({ id: serviceId, barberShopId, ...service }) => (
    <TableRow key={serviceId} data-barber-shop-id={barberShopId}>
      <TableCell>{service.name}</TableCell>
      <TableCell>
        <LineClamp limit={2}>
          {service.description}
        </LineClamp>
      </TableCell>
      <TableCell>{getNumberAsCurrency(service.price)}</TableCell>
      <TableCell>{service.duration}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-between gap-x-2">
          <Button
            size="icon"
            variant="outline"
            title="Editar"
            onClick={() => navigate({
              search: (prev) => ({
                ...prev,
                open: {
                  action: 'UPDATE',
                  serviceId,
                },
              })
            })}
          >
            <Edit />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            title="Remover"
            onClick={() => navigate({
              search: (prev) => ({
                ...prev,
                open: {
                  action: 'REMOVE',
                  serviceId,
                },
              })
            })}
          >
            <Trash2 />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ))
}
