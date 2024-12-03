import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useBarberScheduleLayout } from "../layouts/barber-schedule-layout"
import { AppointmentZod } from "@/schemas/appointment"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense, useRef, useState } from "react"
import { CalendarIcon, ChevronDown, Loader2 } from "lucide-react"
import { DateOnly } from "@/utils/types/date"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { Calendar } from "../ui/calendar"
import { getFormattedDate, getStringAsDateOnly } from "@/schemas/sharedValidators/dateOnly"
import { getToday } from "@/utils/date"
import { PopoverClose } from "@radix-ui/react-popover"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { Badge } from "../ui/badge"
import { Alert, AlertDescription } from "../ui/alert"

type ActionType<KItem extends keyof ReturnType<typeof useBarberScheduleLayout>> =
  ReturnType<typeof useBarberScheduleLayout>[KItem]
  
export type NewAppointmentProps = {
  barberShopId: number
  serviceIds: number[]
  control: Control<AppointmentZod>
  getAbailableSlots: ActionType<'getAbailableSlots'>
}

function LoadingDatesAndTimeSpans() {
  return (
    <div className="flex gap-x-2">
      <Loader2 className="animate-spin" />
      Carregando datas...
    </div>
  )
}

type TimeSpansType = {
  currentDate: DateOnly
} & Pick<NewAppointmentProps, 'control' | 'getAbailableSlots' | 'barberShopId' | 'serviceIds'>

function LoadedFieldsDatesAndTimeSpans({ control, getAbailableSlots, barberShopId, currentDate, serviceIds }: TimeSpansType) {
  const { data: startTimes } = useSuspenseQuery({
    queryKey: ['available-slots', barberShopId, currentDate, ...serviceIds],
    queryFn: () => getAbailableSlots(barberShopId, currentDate, serviceIds),
  })

  function getDataAsDayMonth(date: DateOnly) {
    return getFormattedDate(date).split('/').splice(0, 2).join('/')
  }
  
  return (
    <>
      <FormField
        control={control}
        name="startTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Selecione um horário</FormLabel>
            <ScrollArea className="max-w-[80vw] md:max-w-[500px] overflow-x-auto py-2">
              <div className="flex space-x-2 mb-2 max-w-[250px]">
                {startTimes?.value?.length > 0 ? (
                  startTimes.value.map((timeOnly) => (
                    <Badge
                      key={timeOnly}
                      className={cn(
                        "cursor-pointer",
                        field.value === timeOnly ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                      )}
                      onClick={() => field.onChange(timeOnly)}
                    >
                      {timeOnly.split(':').splice(0, 2).join(':')}
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

export function InputFieldsDatesAndTimeSpans({ control, getAbailableSlots, barberShopId, serviceIds }: NewAppointmentProps) {
  const [currentDate, setCurrentDate] = useState<DateOnly | undefined>(undefined)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  
  return (
    <>
      <FormField
        control={control}
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
                  selected={field.value ? getToday({ dateOnly: field.value }) as Date : undefined}
                  onSelect={date => {
                    const value = date ? getStringAsDateOnly(date) : undefined
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
        )}}
      />
      
      {!!currentDate && serviceIds.length > 0 && (
        <Suspense fallback={<LoadingDatesAndTimeSpans />}>
          <LoadedFieldsDatesAndTimeSpans
            currentDate={currentDate}
            control={control}
            getAbailableSlots={getAbailableSlots}
            barberShopId={barberShopId}
            serviceIds={serviceIds}
          />
        </Suspense>
      )}
    </>
  )
}
