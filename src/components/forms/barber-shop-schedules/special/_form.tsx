import { useSpecialScheduleFormContext } from "./_useScheduleForm"

export function BarberShopSpecialScheduleForm() {
  const { action, formId, isClosed, form } = useSpecialScheduleFormContext()
  
  return (
    <form
      id={formId} className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="grid gap-3">
        <form.AppField name="date">
          {(field) => <field.DateField label="Data" placeholder="06/12/2024" disabled={action === 'REMOVE'} />}
        </form.AppField>

        <form.AppField name="notes">
          {(field) => <field.NotesField disabled={action === 'REMOVE'} />}
        </form.AppField>

        <form.AppField name="openTime">
          {(field) => <field.OpenTimeField disabled={action === 'REMOVE' || isClosed} />}
        </form.AppField>

        <form.AppField name="closeTime">
          {(field) => <field.OpenTimeField disabled={action === 'REMOVE' || isClosed} />}
        </form.AppField>

        <form.AppField name="isClosed">
          {(field) => <field.IsClosedField disabled={action === 'REMOVE'} />}
        </form.AppField>
        
        {/* <FormRootErrorMessage /> */}
      </div>
    </form>
  )
}
