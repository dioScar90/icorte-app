import { buttonVariants } from '@/components/ui/button'
import { useProfileForm } from '@/hooks/forms/use-profile'
import { genders } from '@/schemas/profile'
import { userUpdateSchema } from '@/schemas/user'
import { getEnumAsString } from '@/schemas/sharedValidators/nativeEnumValidator'
import { applyMask } from '@/utils/mask'
import { Link } from '@tanstack/react-router'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import type { z } from 'zod'

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

  const form = useProfileForm({
    defaultValues: {
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        gender: getEnumAsString(genders, profile.gender),
        phoneNumber: applyMask('PHONE_NUMBER', userPhoneNumber),
      },
    } as z.input<typeof userUpdateSchema>,
    validators: {
      onSubmit: userUpdateSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const values = userUpdateSchema.parse(value)
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
        handleError(err)
      }
    },
  })
  
  return (
    <>
      <h3>{profile.fullName}</h3>
      
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.AppField name="profile.firstName">
          {(field) => <field.RegisterFirstNameField />}
        </form.AppField>
        
        <form.AppField name="profile.lastName">
          {(field) => <field.RegisterLastNameField />}
        </form.AppField>
        
        <form.AppField name="profile.phoneNumber">
          {(field) => <field.RegisterPhoneNumberField />}
        </form.AppField>
        
        <form.AppField name="profile.gender">
          {(field) => <field.RegisterGenderField baseEnum={genders} />}
        </form.AppField>
        
        {/* <FormRootErrorMessage /> */}

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

          <form.AppForm>
            <form.SubscribeButton label="Salvar" />
          </form.AppForm>
        </div>
      </form>
    </>
  )
}
