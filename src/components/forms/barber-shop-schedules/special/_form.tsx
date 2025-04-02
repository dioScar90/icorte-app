import { useSpecialScheduleFormContext } from "./_useScheduleForm"

export function BarberShopSpecialScheduleForm() {
  const { action, formId, form } = useSpecialScheduleFormContext()
  
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
        
        {/* <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text" inputMode="numeric" placeholder="06/12/2024"
                  onChange={handleDateChange} onFocus={navigateToEndAfterFocus}
                  disabled={action === 'REMOVE'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Descrição (opcional)" {...field} disabled={action === 'REMOVE'} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="openTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora de abertura</FormLabel>
              <FormControl>
                <Input
                  {...field} ref={openTimeInputRef}
                  type="text" inputMode="numeric" placeholder="08:00:00 (opcional)"
                  onChange={handleTimeChange} onFocus={navigateToEndAfterFocus}
                  disabled={action === 'REMOVE' || isClosed}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="closeTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora de fechamento</FormLabel>
              <FormControl>
                <Input
                  {...field} ref={closeTimeInputRef}
                  type="text" inputMode="numeric" placeholder="18:00:00 (opcional)"
                  onChange={handleTimeChange} onFocus={navigateToEndAfterFocus}
                  disabled={action === 'REMOVE' || isClosed}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isClosed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-x-5 rounded-lg w-fit border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Barbearia Fechada
                </FormLabel>
                <FormDescription>
                  Caso queira fechar nesse dia
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={value => {
                    handleIsCloseChange(value)
                    field.onChange(value)
                  }}
                  disabled={action === 'REMOVE'}
                />
              </FormControl>
            </FormItem>
          )}
        /> */}
        
        {/* <FormRootErrorMessage /> */}
      </div>
    </form>
  )
}
