import { DivBeforeCard } from '@/components/div-before-card'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useBarberShopForm } from '@/hooks/forms/use-barber-shop'
import { states } from '@/schemas/address'
import { barberShopSchema } from '@/schemas/barberShop'
import { applyMask } from '@/utils/mask'
import { Link } from '@tanstack/react-router'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, StoreIcon } from 'lucide-react'
import type { z } from 'zod'

export const Route = createFileRoute(
  '/(authenticated-only)/barber-shop/$barberShopId/edit',
)({
  component: RouteComponent,
  loader: async ({ context }) => await context.barberShop.loadBarber(),
})

function RouteComponent() {
  const barberShop = Route.useLoaderData()!

  const [handleError, update] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.barberShop.update,
    ] as const
  })

  const navigate = useNavigate()
  
  const form = useBarberShopForm({
    defaultValues: {
      name: barberShop.name,
      description: barberShop.description,
      comercialNumber: barberShop.comercialNumber,
      comercialEmail: applyMask('PHONE_NUMBER', barberShop.comercialEmail),
      address: {
        street: barberShop.address.street,
        number: barberShop.address.number,
        complement: barberShop.address.complement,
        neighborhood: barberShop.address.neighborhood,
        city: barberShop.address.city,
        state: states[barberShop.address.state],
        postalCode: applyMask('CEP', barberShop.address.postalCode),
        country: barberShop.address.country,
      }
    } as z.input<typeof barberShopSchema>,
    validators: {
      onSubmit: barberShopSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const values = barberShopSchema.parse(value)
        const result = await update(barberShop.id, values)
  
        if (!result.isSuccess) {
          throw result.error
        }
  
        navigate({
          to: '/barber-shop/$barberShopId',
          params: {
            barberShopId: barberShop.id,
          },
          state: {
            alert: {
              message: 'Barbearia alterada com sucesso',
            },
          },
        })
      } catch (err) {
        handleError(err)
      }
    },
  })
  
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <DivBeforeCard>
        <Card className="w-full md:max-w-96">
          <CardHeader>
            <CardTitle className="text-2xl">{barberShop.name}</CardTitle>
            <CardDescription>
              Altere um ou mais campos abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <form.AppField name="name">
                  {(field) => <field.NameField />}
                </form.AppField>

                <form.AppField name="description">
                  {(field) => <field.DescriptionField />}
                </form.AppField>

                <form.AppField name="comercialEmail">
                  {(field) => <field.ComercialNumberField />}
                </form.AppField>

                <form.AppField name="comercialEmail">
                  {(field) => <field.ComercialEmailField />}
                </form.AppField>

                <form.AppField name="address.street">
                  {(field) => <field.StreetField />}
                </form.AppField>

                <form.AppField name="address.number">
                  {(field) => <field.NumberField />}
                </form.AppField>

                <form.AppField name="address.complement">
                  {(field) => <field.ComplementField />}
                </form.AppField>

                <form.AppField name="address.neighborhood">
                  {(field) => <field.NeighborhoodField />}
                </form.AppField>

                <form.AppField name="address.city">
                  {(field) => <field.CityField />}
                </form.AppField>

                <form.AppField name="address.state">
                  {(field) => <field.StateField baseEnum={states} />}
                </form.AppField>

                <form.AppField name="address.postalCode">
                  {(field) => <field.PostalCodeField />}
                </form.AppField>

                <form.AppField name="address.country">
                  {(field) => <field.CountryField />}
                </form.AppField>
                
                {/* <FormRootErrorMessage /> */}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-x-2">
                <Link
                  className={buttonVariants({ variant: "secondary" })}
                  to="/"
                >
                  <ChevronLeft />
                  Cancelar
                </Link>

                <form.AppForm>
                  <form.SubscribeButton label="Salvar" IconLeft={<StoreIcon />} />
                </form.AppForm>
              </div>
            </div>
          </CardContent>
        </Card>
      </DivBeforeCard>
    </form>
  )
}
