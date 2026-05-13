import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { useNavigate } from '@tanstack/react-router'
import { Edit, Trash2 } from 'lucide-react'
import { daysOfWeek } from '@/schemas/recurringSchedule'
import { getFormattedHour } from '@/schemas/sharedValidators/timeString'
import { Route } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'

export function TableBodyWithRowsRecurringSchedules() {
  const schedules = Route.useLoaderData({
    select: (s) => s.recurringSchedules,
  })

  const navigate = useNavigate({ from: Route.fullPath })

  if (!schedules.length) {
    return (
      <TableRow>
        <TableCell colSpan={100}>
          <Alert variant="warning">
            <AlertDescription className="text-center my-1">
              Nenhum horário recorrente cadastrado
            </AlertDescription>
          </Alert>
        </TableCell>
      </TableRow>
    )
  }

  return schedules.map(({ barberShopId, ...schedule }) => (
    <TableRow key={schedule.dayOfWeek} data-barber-shop-id={barberShopId}>
      <TableCell className="text-center">{daysOfWeek[schedule.dayOfWeek]}</TableCell>
      <TableCell className="text-center">{getFormattedHour(schedule.openTime, true)}</TableCell>
      <TableCell className="text-center">{getFormattedHour(schedule.closeTime, true)}</TableCell>
      <TableCell className="text-center w-[100px]">
        <div className="flex justify-between gap-x-2">
          <Button
            size="icon"
            variant="outline"
            title="Editar"
            onClick={() => navigate({
              search: (prev) => ({
                ...prev,
                open: {
                  scheduleType: 'recurring',
                  details: {
                    action: 'UPDATE',
                    dayOfWeek: daysOfWeek[schedule.dayOfWeek],
                  },
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
                  scheduleType: 'recurring',
                  details: {
                    action: 'REMOVE',
                    dayOfWeek: daysOfWeek[schedule.dayOfWeek],
                  },
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
