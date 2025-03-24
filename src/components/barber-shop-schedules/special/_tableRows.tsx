import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { useNavigate } from '@tanstack/react-router'
import { DoorClosed, DoorOpen, Edit, Trash2 } from 'lucide-react'
import { getFormattedHour } from '@/schemas/sharedValidators/timeString'
import { getFormattedDate } from '@/schemas/sharedValidators/dateString'
import { Route as BarberShopSchedulesRoute } from '@/routes/(authenticated-only)/barber-shop/$barberShopId/schedules'

export function TableBodyWithRowsSpecialSchedules() {
  const schedules = BarberShopSchedulesRoute.useLoaderData({
    select: (s) => s.specialSchedules,
  })

  const navigate = useNavigate({ from: BarberShopSchedulesRoute.fullPath })

  if (!schedules.length) {
    return (
      <TableRow>
        <TableCell colSpan={100}>
          <Alert variant="warning">
            <AlertDescription className="text-center my-1">
              Nenhum horário especial cadastrado
            </AlertDescription>
          </Alert>
        </TableCell>
      </TableRow>
    )
  }

  return schedules.map(({ barberShopId, ...schedule }) => (
    <TableRow key={schedule.date} data-barber-shop-id={barberShopId}>
      <TableCell className="text-center">{getFormattedDate(schedule.date)}</TableCell>
      <TableCell className="text-center">{schedule.notes ?? '---'}</TableCell>
      <TableCell className="text-center">{schedule.isClosed || !schedule.openTime ? '---' : getFormattedHour(schedule.openTime, true)}</TableCell>
      <TableCell className="text-center">{schedule.isClosed || !schedule.closeTime ? '---' : getFormattedHour(schedule.closeTime, true)}</TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center">
          {schedule.isClosed
            ? <DoorClosed className="text-red-600" />
            : <DoorOpen className="text-green-600" />
          }
        </div>
      </TableCell>
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
                  scheduleType: 'special',
                  date: schedule.date,
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
                  scheduleType: 'special',
                  date: schedule.date,
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
