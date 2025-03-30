import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { useNavigate } from '@tanstack/react-router'
import { Edit, Trash2 } from 'lucide-react'
import { getEnumAsString } from '@/utils/enum-transformer'
import { DayOfWeekEnum } from '@/schemas/recurringSchedule'
import { getFormattedHour } from '@/schemas/sharedValidators/timeString'
import { Route as BarberShopSchedulesRoute } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'

export function TableBodyWithRowsRecurringSchedules() {
  const schedules = BarberShopSchedulesRoute.useLoaderData({
    select: (s) => s.recurringSchedules,
  })

  const navigate = useNavigate({ from: BarberShopSchedulesRoute.fullPath })

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
      <TableCell className="text-center">{getEnumAsString(DayOfWeekEnum, schedule.dayOfWeek)}</TableCell>
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
                  action: 'UPDATE',
                  scheduleType: 'recurring',
                  dayOfWeek: schedule.dayOfWeek,
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
                  scheduleType: 'recurring',
                  dayOfWeek: schedule.dayOfWeek,
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
