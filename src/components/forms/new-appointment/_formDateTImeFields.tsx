import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useRef, useState } from "react"
import { CalendarIcon, ChevronDown, Loader2 } from "lucide-react"
import { type DateString } from "@/utils/types/datetime/date-string"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { getFormattedDate, getStringAsDateString } from "@/schemas/sharedValidators/dateString"
import { getToday } from "@/utils/date"
import { PopoverClose } from "@radix-ui/react-popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getFormattedHour } from "@/schemas/sharedValidators/timeString"
import { useRouteContext } from "@tanstack/react-router"
import { useDialogContext } from "./_dialog"

function LoadingDatesAndTimeSpans() {
  return (
    <div className="flex gap-x-2">
      <Loader2 className="animate-spin" />
      Carregando datas...
    </div>
  )
}

type CurrentDate = Parameters<Parameters<ReturnType<typeof useDialogContext>['form']['handleSubmit']>[0]>[0]['date']

function LoadedFieldsDatesAndTimeSpans({ currentDate }: { currentDate: CurrentDate }) {
  const { form, barberShopId } = useDialogContext()

  const [queryOptions] = useRouteContext({
    from: '/(authenticated-only)/barber-schedule/new-appointment',
    select: (s) => [
      s.appointmentsQueryOptions,
    ] as const
  })

  const serviceIds = form.watch('serviceIds')

  const { data: startTimes } = useSuspenseQuery(queryOptions(barberShopId, currentDate, serviceIds))

  function getDataAsDayMonth(date: DateString) {
    return getFormattedDate(date).split('/').splice(0, 2).join('/')
  }

  return (
    <>
      <FormField
        control={form.control}
        name="startTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Selecione um horário</FormLabel>
            <ScrollArea className="max-w-[80vw] md:max-w-[500px] overflow-x-auto py-2">
              <div className="flex space-x-2 mb-2 max-w-[250px]">
                {startTimes?.length > 0 ? (
                  startTimes.map((timeString) => (
                    <Badge
                      key={timeString}
                      className={cn(
                        "cursor-pointer",
                        field.value === timeString ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                      )}
                      onClick={() => field.onChange(timeString)}
                    >
                      {getFormattedHour(timeString)}
                    </Badge>
                  ))
                ) : (
                  <Alert variant="warning" className="py-1">
                    <AlertDescription className="text-center my-1">
                      {getDataAsDayMonth(currentDate)} - sem horários
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

function FieldsDatesAndTimeSpans({ currentDate }: { currentDate?: CurrentDate }) {
  if (!currentDate) {
    return null
  }

  return (
    <Suspense fallback={<LoadingDatesAndTimeSpans />}>
      <LoadedFieldsDatesAndTimeSpans
        currentDate={currentDate}
      />
    </Suspense>
  )
}

export function InputFieldsDatesAndTimeSpans() {
  const { form } = useDialogContext()

  const [currentDate, setCurrentDate] = useState<CurrentDate>()
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => {
          return (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        getFormattedDate(field.value)
                      ) : (
                        <span>Escolha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex m-1">
                    <div className="flex-1"></div>
                    <PopoverClose ref={closeBtnRef}>
                      <ChevronDown size={24} className="text-primary/60 hover:text-destructive" />
                    </PopoverClose>
                  </div>
                  <Calendar
                    mode="single"
                    selected={field.value ? getToday({ dateString: field.value }) as Date : undefined}
                    onSelect={date => {
                      const value = date ? getStringAsDateString(date) : undefined
                      field.onChange(value)
                      setCurrentDate(value)
                      closeBtnRef.current?.click()
                    }}
                    fromDate={getToday() as Date}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )
        }}
      />

      <FieldsDatesAndTimeSpans currentDate={currentDate} />
    </>
  )
}
