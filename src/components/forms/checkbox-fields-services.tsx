import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { useBarberScheduleLayout } from "../layouts/barber-schedule-layout"
import { AppointmentZod } from "@/schemas/appointment"
import { Checkbox } from "../ui/checkbox"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

type ActionType<KItem extends keyof ReturnType<typeof useBarberScheduleLayout>> =
  ReturnType<typeof useBarberScheduleLayout>[KItem]

export type NewAppointmentProps = {
  barberShopId: number
  control: Control<AppointmentZod>
  getAllServices: ActionType<'getAllServices'>
}

function LoadingServices() {
  return (
    <div className="flex gap-x-2">
      <Loader2 className="animate-spin" />
      Carregando serviços...
    </div>
  )
}

function LoadedFieldsServices({ barberShopId, control, getAllServices }: NewAppointmentProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['services', barberShopId],
    queryFn: () => getAllServices(barberShopId),
  })
  
  return (
    <>
      {Array.isArray(data?.value.items) && data.value.items.length > 0 ? (
        data.value.items.map((item) => (
          <FormField
            key={item.id}
            control={control}
            name="serviceIds"
            render={({ field }: { field: any }) => (
              <FormItem
                key={item.id}
                className="flex flex-row items-start space-x-3 space-y-0"
              >
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) =>
                      checked
                        ? field.onChange([...field.value, item.id])
                        : field.onChange(field.value?.filter((id: number) => id !== item.id))
                    }
                  />
                </FormControl>
                <FormLabel className="font-normal">{item.name}</FormLabel>
              </FormItem>
            )}
          />
        ))
      ) : (
        <p>Nenhum item para exibir</p>
      )}
    </>
  )
}

export function CheckboxFieldsServices(props: NewAppointmentProps) {
  return (
    <Suspense fallback={<LoadingServices />}>
      <LoadedFieldsServices { ...props } />
    </Suspense>
  )
}
