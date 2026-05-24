import { BarberShopRecurringScheduleDialog } from '@/components/forms/barber-shop-schedules/recurring/_dialog'
import { BarberShopSpecialScheduleDialog } from '@/components/forms/barber-shop-schedules/special/_dialog'
import { TableBodyWithRowsRecurringSchedules } from '@/components/forms/barber-shop-schedules/recurring/_tableRows'
import { TableBodyWithRowsSpecialSchedules } from '@/components/forms/barber-shop-schedules/special/_tableRows'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RecurringScheduleService } from '@/data/services/RecurringScheduleService'
import { SpecialScheduleService } from '@/data/services/SpecialScheduleService'
import { cn } from '@/lib/utils'
import { daysOfWeek } from '@/schemas/recurringSchedule'
import { getStringAsDateString, isValidDateString } from '@/schemas/sharedValidators/dateString'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'
import { z } from 'zod'
import { nativeEnumValidator } from '@/schemas/sharedValidators/nativeEnumValidator'
import { DivBeforeCard } from '@/components/div-before-card'

const dayOfWeekEnumValidator = nativeEnumValidator(daysOfWeek)

const scheduleValidateSchema = z.object({
  open: z.discriminatedUnion('scheduleType', [
    z.object({
      scheduleType: z.literal('recurring'),
      details: z.discriminatedUnion('action', [
        z.object({
          action: z.enum(['REGISTER']),
          dayOfWeek: z.undefined().optional(),
        }),
        z.object({
          action: z.enum(['UPDATE', 'REMOVE']),
          dayOfWeek: dayOfWeekEnumValidator,
        }),
      ]),
    }),
    z.object({
      scheduleType: z.literal('special'),
      details: z.discriminatedUnion('action', [
        z.object({
          action: z.enum(['REGISTER']),
          date: z.undefined().optional(),
        }),
        z.object({
          action: z.enum(['UPDATE', 'REMOVE']),
          date: z.string().refine(isValidDateString).transform(getStringAsDateString),
        }),
      ]),
    }),
  ]).optional(),
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
          .then(res => !res.error && res.data.items.length > 0 ? res.data.items : [])
          .catch(() => []),
      },

      special: {
        register: specialRep.createSpecialSchedule,
        update: specialRep.updateSpecialSchedule,
        remove: specialRep.deleteSpecialSchedule,

        getAll: () => specialRep.getAllSpecialSchedules(params.barberShopId)
          .then(res => res)
          .then(res => !res.error && res.data.items.length > 0 ? res.data.items : [])
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
            type="button" className="absolute-middle-y"
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
            scheduleType: 'special',
            details: {
              action: 'REGISTER',
            },
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
            scheduleType: 'recurring',
            details: {
              action: 'REGISTER',
            },
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
      <DivBeforeCard>
        <Card className="mx-auto max-w-sm min-w-[80vw] md:min-w-[750px] lg:min-w-[800px]">
          <CardRecurringSchedules barberShopName={barberShopName} />

          <Separator />

          <CardSpecialSchedules barberShopName={barberShopName} />
        </Card>
      </DivBeforeCard>
      
      <BarberShopRecurringScheduleDialog />
      <BarberShopSpecialScheduleDialog />
    </>
  )
}
