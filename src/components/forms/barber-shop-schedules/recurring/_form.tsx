import { daysOfWeek } from "@/schemas/recurringSchedule"
import { useRecurringScheduleFormContext } from "./_useScheduleForm"

export function BarberShopRecurringScheduleForm() {
  const { action, formId, form } = useRecurringScheduleFormContext()
  
  return (
    <form
      id={formId} className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="grid gap-3">
        <form.AppField name="dayOfWeek">
          {(field) => <field.DayOfWeekField baseEnum={daysOfWeek} disabled={action === 'REMOVE'} />}
        </form.AppField>

        <form.AppField name="openTime">
          {(field) => <field.OpenTimeField disabled={action === 'REMOVE'} />}
        </form.AppField>

        <form.AppField name="closeTime">
          {(field) => <field.CloseTimeField disabled={action === 'REMOVE'} />}
        </form.AppField>
        
        {/* <FormRootErrorMessage /> */}
      </div>
    </form>
  )
}
