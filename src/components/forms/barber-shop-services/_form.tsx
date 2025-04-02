import { useServiceFormContext } from "./_useServicesForm"

export function BarberShopServiceForm() {
  const { form, formId, action } = useServiceFormContext()
  
  return (
    <form
      id={formId} className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="grid gap-3">
        <form.AppField name="name">
          {(field) => <field.NameField label="Nome" placeholder="Nome" disabled={action === 'REGISTER'} />}
        </form.AppField>

        <form.AppField name="description">
          {(field) => <field.DescriptionField label="Descrição" placeholder="Descrição (opcional)" disabled={action === 'REGISTER'} />}
        </form.AppField>

        <form.AppField name="description">
          {(field) => <field.PriceField disabled={action === 'REGISTER'} />}
        </form.AppField>

        <form.AppField name="duration">
          {(field) => <field.DurationField label="Duração" placeholder="00:30:00" disabled={action === 'REGISTER'} />}
        </form.AppField>
        
        {/* <FormRootErrorMessage /> */}
      </div>
    </form>
  )
}
