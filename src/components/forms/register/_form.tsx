import { useStore } from '@tanstack/react-form'

import { useFieldContext, useFormContext } from '@/hooks/forms/form-contexts'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useRef, useState, type ComponentProps, type RefObject } from 'react'
import { Eye, EyeOff, LogInIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
// import { Route } from '@/routes/login'
import { Route } from '@/routes/__root'
import { ErrorMessages, Select, TextField } from '../default'
import { SubmitButton } from '@/components/ui/submit-button'
import { GoogleSvg } from '@/components/ui/google-svg'
import { applyMask } from '@/utils/mask'

export function RegisterEmailField() {
  return <TextField type="email" label="Email" placeholder="Digite seu email" />
}

export function RegisterPhoneNumberField() {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  
  return (
    <div>
      <Label htmlFor="Telefone" className="mb-2 text-xl font-bold">
        Telefone
      </Label>
      <Input
        type="tel"
        value={field.state.value}
        placeholder="Telefone"
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(applyMask('PHONE_NUMBER', e.target.value))}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function RegisterGenderField({ baseEnum }: Pick<ComponentProps<typeof Select>, 'baseEnum'>) {
  return (
    <Select
      baseEnum={baseEnum}
      label="Gênero"
    />
  )
}

export function RegisterFirstNameField() {
  return <TextField type="text" label="Nome" placeholder="Nome" />
}

export function RegisterLastNameField() {
  return <TextField type="text" label="Sobrenome" placeholder="Sobrenome" />
}

function EyeViewPasswordIcon({ ref }: { ref: RefObject<HTMLInputElement | null> }) {
  type TPassType = 'text' | 'password'

  const [inputType, setInputType] = useState<TPassType>('password')
  const Icon = inputType === 'password' ? EyeOff : Eye
  
  useEffect(() => {
    if (ref.current) {
      setInputType(() => ref.current!.type as TPassType)
    }
  }, [ref.current?.type])
  
  return (
    <Icon
      className="absolute-middle-y right-4 z-10 cursor-pointer text-gray-500"
      onClick={(e) => {
        e.stopPropagation()
        
        if (ref?.current) {
          const currentType = ref.current.type as TPassType
          ref.current.type = currentType === 'password' ? 'text' : 'password'
        }
      }}
    />
  )
}

function ForgotPasswordButton() {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const unavailableForNow = Route.useRouteContext({ select: (s) => s.unavailableForNow })

  function toggleDisabled(disable = false) {
    if (linkRef?.current) {
      linkRef.current.toggleAttribute('data-disabled', disable)
    }
  }

  return (
    <Button variant="link" asChild className="absolute top-0 right-0">
      <Link
        ref={linkRef}
        to={Route.fullPath}
        tabIndex={-1}
        className="ml-auto inline-block text-sm underline [&[data-disabled]]:opacity-50 [&[data-disabled]]:pointer-events-none"
        title="Indisponível no momento"
        preloadDelay={Number.POSITIVE_INFINITY}
        onClick={(e) => {
          e.preventDefault()

          toggleDisabled(true)
          unavailableForNow(() => toggleDisabled(false))
        }}
      >
          Esqueceu sua senha?
      </Link>
    </Button>
  )
}

export function RegisterPasswordField({ isLogin }: { isLogin?: boolean }) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  const passwordInputRef = useRef<HTMLInputElement>(null)
  
  return (
    <div className="relative">
      <div>
        <Label className="mb-2 text-xl font-bold">
            Senha
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
      
      {!!isLogin && <ForgotPasswordButton />}
    </div>
  )
}

export function RegisterConfirmPasswordField() {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label className="mb-2 text-xl font-bold">
          Confirme sua senha
      </Label>
      
      <Input
        type="password"
        value={field.state.value}
        placeholder={'*'.repeat(8)}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

function RegisterWithGoogleButton({ isSubmitting, isLogin }: { isSubmitting: boolean, isLogin?: boolean }) {
  const unavailableForNow = Route.useRouteContext({ select: (s) => s.unavailableForNow })

  return (
    <SubmitButton
      type="button"
      variant="outline"
      className="w-full"
      title="Indisponível no momento"
      onClick={() => unavailableForNow()}
      disabled={isSubmitting}
      IconLeft={<GoogleSvg />}
    >
      {!!isLogin ? 'Fazer login com Google' : 'Cadastre-se com o Google'}
    </SubmitButton>
  )
}

export function RegisterSubscribeButton({ isLogin }: { isLogin?: boolean }) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <SubmitButton
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          IconLeft={<LogInIcon />}
        >
          {!!isLogin ? 'Login' : 'Cadastrar'}
        </SubmitButton>
      )}
    </form.Subscribe>
  )
}

export function RegisterSubscribeWithGoogleButton({ isLogin }: { isLogin?: boolean }) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <RegisterWithGoogleButton
          isSubmitting={isSubmitting}
          isLogin={isLogin}
        />
      )}
    </form.Subscribe>
  )
}
