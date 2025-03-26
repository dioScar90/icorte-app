import { Button, buttonVariants } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootErrorMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SubmitButton } from '@/components/ui/submit-button'
import { GenderEnum } from '@/schemas/profile'
import { userUpdateSchema, type UserUpdateZod } from '@/schemas/user'
import { getEnumAsArray, getEnumAsString } from '@/utils/enum-as-array'
import { applyMask } from '@/utils/mask'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, UserRoundPlusIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export const Route = createFileRoute(
  '/(authenticated-only)/profile/$userId/edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [handleError, updateProfile, profile, userPhoneNumber] = Route.useRouteContext({
    select: (s) => [
      s.handleError,
      s.updateProfile,
      s.profile,
      s.auth.user?.phoneNumber!,
    ] as const
  })

  const navigate = useNavigate()
  
  const form = useForm<UserUpdateZod>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        gender: profile.gender,
        phoneNumber: applyMask('PHONE_NUMBER', userPhoneNumber),
      }
    }
  })

  async function onSubmit(values: UserUpdateZod) {
    try {
      const result = await updateProfile(profile.id, values.profile)

      if (!result.isSuccess) {
        throw result.error
      }
      
      navigate({
        to: '/profile/$userId',
        params: {
          userId: profile.id,
        },
        state: {
          alert: {
            message: 'Perfil alterado com sucesso',
          },
        },
      })
    } catch (err) {
      handleError(err, form)
    }
  }

  const phoneNumber = form.watch('profile.phoneNumber')

  useEffect(() => {
    form.setValue('profile.phoneNumber', applyMask('PHONE_NUMBER', phoneNumber))
  }, [phoneNumber])

  return (
    <>
      <h3>{profile.fullName}</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="profile.firstName"
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
            name="profile.lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Sobrenome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile.phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input type="tel" inputMode="tel" placeholder="Telefone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile.gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gênero</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={getEnumAsString(GenderEnum, field.value)}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {getEnumAsArray(GenderEnum).map(gender => (
                        <SelectItem key={gender} value={gender} >{gender}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormRootErrorMessage />

          <div className="flex justify-center align-center gap-x-3">
            <Link
              className={buttonVariants({ variant: "secondary" })}
              to="/profile/$userId"
              params={{
                userId: profile.id,
              }}
            >
              <ChevronLeft />
              Voltar
            </Link>
            <SubmitButton
              type="submit" formNoValidate
              disabled={form.formState.isLoading || form.formState.isSubmitting}
              IconLeft={<UserRoundPlusIcon />}
            >
              Salvar
            </SubmitButton>
          </div>
        </form>
      </Form>
    </>
  )
}
