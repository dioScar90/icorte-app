import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Checkbox } from "../ui/checkbox"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { useRouteContext } from "@tanstack/react-router"
import { useDialogContext } from "./_dialog"

function LoadingServices() {
  return (
    <div className="flex gap-x-2">
      <Loader2 className="animate-spin" />
      Carregando serviços...
    </div>
  )
}

function LoadedFieldsServices({ control }: { control: Control }) {
  const { barberShopId } = useDialogContext()

  const queryOptions = useRouteContext({
    from: '/(authenticated-only)/barber-schedule/new-appointment/',
    select: (s) => s.allServicesQueryOptions,
  })

  const { data: services } = useSuspenseQuery(queryOptions(barberShopId))

  if (!services?.length) {
    return (
      <p>Nenhum item para exibir</p>
    )
  }
  
  return services.map((item) => (
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
}

export function CheckboxFieldsServices(props: { control: Control }) {
  return (
    <Suspense fallback={<LoadingServices />}>
      <LoadedFieldsServices { ...props } />
    </Suspense>
  )
}
