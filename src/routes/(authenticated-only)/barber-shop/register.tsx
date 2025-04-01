import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useBarberShopForm } from '@/hooks/forms/use-barber-shop'
import { states } from '@/schemas/address'
import { barberShopSchema } from '@/schemas/barberShop'
import { applyMask } from '@/utils/mask'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { StoreIcon } from 'lucide-react'
import type { z } from 'zod'

export const Route = createFileRoute(
  '/(authenticated-only)/barber-shop/register',
)({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.auth.isBarberShop) {
      throw redirect({
        to: '/barber-shop/$barberShopId',
        params: {
          barberShopId: context.auth.user?.barberShop?.id!,
        },
        replace: true,
      })
    }

    return {
      barberShop: {
        register: context.barberShop.service.createBarberShop,
      }
    }
  },
})

function RouteComponent() {
  const [handleError, user, register] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.auth?.user!,
      s.barberShop.register,
    ] as const
  })
  
  const navigate = useNavigate()

  const form = useBarberShopForm({
    defaultValues: {
      name: '',
      description: '',
      comercialNumber: applyMask('PHONE_NUMBER', user.phoneNumber),
      comercialEmail: user.email ?? '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: undefined,
        postalCode: '',
        country: 'Brasil',
      }
    } as z.input<typeof barberShopSchema>,
    validators: {
      onSubmit: barberShopSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const values = barberShopSchema.parse(value)
        const result = await register(values)
  
        if (!result.isSuccess) {
          throw result.error
        }
  
        navigate({
          to: '/barber-shop/$barberShopId/dashboard',
          params: {
            barberShopId: result.value.item.id,
          },
          state: {
            alert: {
              message: result.value?.message,
            },
          },
        })
      } catch (err) {
        handleError(err)
      }
    },
  })
  
  return (
    <>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <div className="before-card">
          <Card className="w-full md:max-w-96">
            <CardHeader>
              <CardTitle className="text-2xl">Cadastrar barbearia</CardTitle>
              <CardDescription>
                Vamos começar. Preencha os campos abaixo.
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
                
                <div className="mt-3">
                  <form.AppForm>
                    <form.SubscribeButton label="Cadastrar" IconLeft={<StoreIcon />} />
                  </form.AppForm>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </>
  )
}
