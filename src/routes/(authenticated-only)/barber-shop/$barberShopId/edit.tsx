import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SubmitButton } from '@/components/ui/submit-button'
import { StateEnum } from '@/schemas/address'
import { barberShopSchema, type BarberShopZod } from '@/schemas/barberShop'
import { getEnumAsArray, getEnumAsString } from '@/utils/enum-as-array'
import { applyMask } from '@/utils/mask'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, StoreIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

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

  const form = useForm<BarberShopZod>({
    resolver: zodResolver(barberShopSchema),
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
        state: barberShop.address.state,
        postalCode: applyMask('CEP', barberShop.address.postalCode),
        country: barberShop.address.country,
      }
    }
  })

  async function onSubmit(values: BarberShopZod) {
    try {
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
      handleError(err, form)
    }
  }

  const comercialNumber = form.watch('comercialNumber')
  const postalCode = form.watch('address.postalCode')

  useEffect(() => {
    form.setValue('comercialNumber', applyMask('PHONE_NUMBER', comercialNumber))
  }, [comercialNumber])

  useEffect(() => {
    form.setValue('address.postalCode', applyMask('CEP', postalCode))
  }, [postalCode])

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="before-card">
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
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Opcional. Ex.: A sua barbearia..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="comercialNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone Comercial</FormLabel>
                          <FormControl>
                            <Input type="tel" inputMode="tel" placeholder="Telefone comercial" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="comercialEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Comercial</FormLabel>
                          <FormControl>
                            <Input type="email" inputMode="email" placeholder="Email comercial" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rua</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Rua" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input type="text" inputMode="numeric" placeholder="Número" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.complement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complemento</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Complemento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Bairro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={getEnumAsString(StateEnum, field.value)}>
                            <FormControl>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {getEnumAsArray(StateEnum).map(state => (
                                  <SelectItem key={state} value={state}>{state}</SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input type="text" inputMode="numeric" placeholder="CEP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>País</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="País" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormRootErrorMessage />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-2">
                    <Link
                      className={buttonVariants({ variant: "secondary" })}
                      to="/"
                    >
                      <ChevronLeft />
                      Cancelar
                    </Link>

                    <SubmitButton
                      type="submit" variant="default"
                      disabled={form.formState.isLoading || form.formState.isSubmitting}
                      IconLeft={<StoreIcon />}
                    >
                      Salvar
                    </SubmitButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </>
  )
}
