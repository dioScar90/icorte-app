import { useStore } from '@tanstack/react-form'

import { useFieldContext, useFormContext } from '@/hooks/forms/form-contexts'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRef, useState, type RefObject } from 'react'
import { Eye, EyeOff, LogInIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Route } from '@/routes/login'
import { ErrorMessages, TextField } from '../default'
import { SubmitButton } from '@/components/ui/submit-button'
import { GoogleSvg } from '@/components/ui/google-svg'

export function LoginEmailField() {
  return <TextField type="email" label="Email" placeholder="Digite seu email" />
}

function EyeViewPasswordIcon({ ref }: { ref: RefObject<HTMLInputElement | null> }) {
  const [isViewPassword, setIsViewPassword] = useState(false)
  const Icon = isViewPassword ? Eye : EyeOff
  
  return (
    <Icon
      className="absolute-middle-y right-4 z-10 cursor-pointer text-gray-500"
      onClick={() => {
        setIsViewPassword(prev => !prev)
    
        if (ref?.current) {
          ref.current.setAttribute('type', isViewPassword ? 'text' : 'password')
        }
      }}
    />
  )
}

function ForgotPasswordButton() {
  const unavailableForNow = Route.useRouteContext({ select: (s) => s.unavailableForNow })

  return (
    <Button variant="link" asChild className="absolute right-0">
      <Link
        to={Route.fullPath}
        tabIndex={-1}
        className="ml-auto inline-block text-sm underline [&[data-disabled]]:opacity-50 [&[data-disabled]]:pointer-events-none"
        title="Indisponível no momento"
        onClick={(e) => {
          e.preventDefault()
          e.currentTarget.toggleAttribute('data-disabled', true)

          unavailableForNow()
              
          setTimeout(() => e.currentTarget.toggleAttribute('data-disabled', false), 500)
        }}
      >
          Esqueceu sua senha?
      </Link>
    </Button>
  )
}

export function LoginPasswordField() {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  const passwordInputRef = useRef<HTMLInputElement>(null)
  
  return (
    <div className="relative">
      <div>
        <Label className="mb-2 text-xl font-bold">
            Email
        </Label>
        
        <div className="relative">
            <Input
              ref={passwordInputRef}
              type="password"
              value={field.state.value}
              placeholder={'*'.repeat(8)}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />

            <EyeViewPasswordIcon ref={passwordInputRef} />
        </div>
        
        {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
      </div>
      
      <ForgotPasswordButton />
    </div>
  )
}

function LoginWithGoogleButton({ isSubmitting }: { isSubmitting: boolean }) {
  const unavailableForNow = Route.useRouteContext({ select: (s) => s.unavailableForNow })

  return (
    <SubmitButton
      type="button"
      variant="outline" className="w-full"
      title="Indisponível no momento"
      onClick={unavailableForNow}
      disabled={isSubmitting}
      IconLeft={<GoogleSvg />}
    >
      Fazer login com Google
    </SubmitButton>
  )
}

export function LoginSubscribeButton() {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <>
          <SubmitButton
            type="submit" className="w-full"
            disabled={isSubmitting}
            IconLeft={<LogInIcon />}
          >
            Login
          </SubmitButton>

          <LoginWithGoogleButton isSubmitting={isSubmitting} />
        </>
      )}
    </form.Subscribe>
  )
}
