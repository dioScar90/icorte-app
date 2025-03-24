import { BarberShopRecurringScheduleDialog } from '@/components/barber-shop-schedules/recurring/_dialog'
import { BarberShopSpecialScheduleDialog } from '@/components/barber-shop-schedules/special/_dialog'
import { TableBodyWithRowsRecurringSchedules } from '@/components/barber-shop-schedules/recurring/_tableRows'
import { TableBodyWithRowsSpecialSchedules } from '@/components/barber-shop-schedules/special/_tableRows'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RecurringScheduleService } from '@/data/services/RecurringScheduleService'
import { SpecialScheduleService } from '@/data/services/SpecialScheduleService'
import { cn } from '@/lib/utils'
import { DayOfWeekEnum } from '@/schemas/recurringSchedule'
import { getStringAsDateString, isValidDateString } from '@/schemas/sharedValidators/dateString'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'
import { z } from 'zod'

const scheduleValidateSchema = z.object({
  open: z.discriminatedUnion('action', [
    z.object({
      action: z.enum(['REGISTER']),
      scheduleType: z.enum(['special', 'recurring']),
      date: z.undefined().optional(),
      dayOfWeek: z.undefined().optional(),
    }),
    z.object({
      action: z.enum(['UPDATE', 'REMOVE']),
      scheduleType: z.enum(['special']),
      date: z.string().refine(isValidDateString).transform(getStringAsDateString),
      dayOfWeek: z.undefined().optional(),
    }),
    z.object({
      action: z.enum(['UPDATE', 'REMOVE']),
      scheduleType: z.enum(['recurring']),
      date: z.undefined().optional(),
      dayOfWeek: z.nativeEnum(DayOfWeekEnum),
    }),
  ]).optional()
})

export const Route = createFileRoute(
  '/(authenticated-only)/barber-shop/$barberShopId/schedules',
)({
  component: RouteComponent,
  beforeLoad: ({ context, params }) => {
    const recurringRep = new RecurringScheduleService(context.httpClient)
    const specialRep = new SpecialScheduleService(context.httpClient)

    return {
      recurring: {
        register: recurringRep.createRecurringSchedule,
        update: recurringRep.updateRecurringSchedule,
        remove: recurringRep.deleteRecurringSchedule,

        getAll: () => recurringRep.getAllRecurringSchedules(params.barberShopId)
          .then(res => res)
          .then(res => res.isSuccess && res.value.items?.length > 0 ? res.value.items : [])
          .catch(() => []),
      },

      special: {
        register: specialRep.createSpecialSchedule,
        update: specialRep.updateSpecialSchedule,
        remove: specialRep.deleteSpecialSchedule,

        getAll: () => specialRep.getAllSpecialSchedules(params.barberShopId)
          .then(res => res)
          .then(res => res.isSuccess && res.value.items?.length > 0 ? res.value.items : [])
          .catch(() => []),
      },
    }
  },
  loader: async ({ context }) => ({
    barberShop: await context.barberShop.loadBarber(),
    recurringSchedules: await context.recurring.getAll(),
    specialSchedules: await context.special.getAll(),
  }),
  validateSearch: scheduleValidateSchema,
})

function FullCardWithTableAndOtherStuffs({
  type,
  title,
  description,
  caption,
  tableRowsText,
  onClickBtn,
}: {
  type: NonNullable<typeof Route.types.searchSchema.open>['scheduleType']
  title: string
  description: string
  caption: string
  tableRowsText: Readonly<string[]>
  onClickBtn: () => void
}) {
  return (
    <>
      <CardHeader className="py-4 px-2 md:px-3 lg:px-4">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="py-4 px-2 md:px-3 lg:px-4">
        <Table>
          <TableCaption>{caption}</TableCaption>
          <TableHeader>
            <TableRow>
              {tableRowsText.map((text, i) => (
                <TableHead
                  key={text}
                  className={cn('text-center', i === tableRowsText.length - 1 && 'w-[100px]')}
                >
                  {text}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {type === 'recurring' ? (
              <TableBodyWithRowsRecurringSchedules />
            ) : (
              <TableBodyWithRowsSpecialSchedules />
            )}
          </TableBody>
        </Table>

        <div className="w-full h-14 relative">
          <Button
            type="button" className="absolute-middle-y right-0"
            onClick={onClickBtn}
          >
            <ShoppingBag />
            Novo
          </Button>
        </div>
      </CardContent>
    </>
  )
}

function CardSpecialSchedules({ barberShopName }: { barberShopName: string }) {
  const navigate = useNavigate({ from: Route.fullPath })

  return (
    <FullCardWithTableAndOtherStuffs
      type="special"

      title={`Horários especiais - ${barberShopName}`}
      description="Adicione horários diferentes do habitual, ou informe o fechamento de algum dia específico."
      caption="Sua lista de horários especiais."

      tableRowsText={[
        'Dia',
        'Comentário',
        'Abertura',
        'Fechamento',
        'Fechado',
        'Ação',
      ] as const}

      onClickBtn={() => navigate({
        search: (prev) => ({
          ...prev,
          open: {
            action: 'REGISTER',
            scheduleType: 'special',
          },
        })
      })}
    />
  )
}

function CardRecurringSchedules({ barberShopName }: { barberShopName: string }) {
  const navigate = useNavigate({ from: Route.fullPath })

  return (
    <FullCardWithTableAndOtherStuffs
      type="recurring"

      title={`Horários recorrentes - ${barberShopName}`}
      description="Adicione os dias da semana e horários que você atenderá."
      caption="Sua lista de horários recorrentes."

      tableRowsText={[
        'Dia',
        'Abertura',
        'Fechamento',
        'Ação',
      ] as const}

      onClickBtn={() => navigate({
        search: (prev) => ({
          ...prev,
          open: {
            action: 'REGISTER',
            scheduleType: 'recurring',
          },
        })
      })}
    />
  )
}

function RouteComponent() {
  const barberShopName = Route.useLoaderData({
    select: (s) => s.barberShop?.name!,
  })

  return (
    <>
      <div className="before-card">
        <Card className="mx-auto max-w-sm min-w-[80vw] md:min-w-[750px] lg:min-w-[800px]">
          <CardRecurringSchedules barberShopName={barberShopName} />

          <Separator />

          <CardSpecialSchedules barberShopName={barberShopName} />
        </Card>
      </div>
      
      <BarberShopRecurringScheduleDialog />
      <BarberShopSpecialScheduleDialog />
    </>
  )
}
