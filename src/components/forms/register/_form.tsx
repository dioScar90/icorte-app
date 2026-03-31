import { useStore } from '@tanstack/react-form'

import { useFieldContext, useFormContext } from '@/hooks/forms/form-contexts'

import { Input } from '@/components/ui/input'
import { Activity, useRef, type ComponentProps, type PropsWithChildren, type RefObject } from 'react'
import { Eye, EyeOff, LogInIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Route } from '@/routes/__root'
import { ErrorMessages, FormItem, FormLabel, Select, TextField } from '../default'
import { SubmitButton } from '@/components/ui/submit-button'
import { GoogleSvg } from '@/components/ui/google-svg'
import { applyMask } from '@/utils/mask'
import { cn } from '@/lib/utils'

export function RegisterEmailField() {
  return <TextField type="email" label="Email" placeholder="Digite seu email" />
}

export function RegisterPhoneNumberField() {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  
  return (
    <FormItem>
      <FormLabel htmlFor="Telefone">
        Telefone
      </FormLabel>
      <Input
        type="tel"
        value={field.state.value}
        placeholder="Telefone"
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(applyMask('PHONE_NUMBER', e.target.value))}
      />
      <Activity mode={field.state.meta.isTouched ? 'visible' : 'hidden'}>
        <ErrorMessages errors={errors} />
      </Activity>
    </FormItem>
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

function PasswordInputWithEyeIconContainer({ children: passwordInputChild, ref: passwordInputRef }: PropsWithChildren<{ ref: RefObject<HTMLInputElement | null>}>) {
  const toggleInputType = () => {
    if (passwordInputRef?.current) {
      const currentType = passwordInputRef.current.type
      passwordInputRef.current.type = currentType === 'password' ? 'text' : 'password'
    }
  }
  
  return (
    <div className="group relative">
      
      {passwordInputChild}

      <button
        type="button"
        className={cn('absolute-middle-y', 'right-4 z-10 cursor-pointer text-gray-500')}
        onClick={(e) => {
          e.stopPropagation()
          toggleInputType()
        }}
      >
        <EyeOff className="group-not-has-[input[type=password]]:hidden" />
        <Eye className="group-has-[input[type=password]]:hidden" />
      </button>

    </div>
  )
}

function ForgotPasswordButton() {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const unavailableForNow = Route.useRouteContext({ select: (s) => s.unavailableForNow })
  
  const toggleDisabled = (state: boolean) => linkRef?.current?.classList.toggle('disabled', state)
  
  return (
    <div
      data-forgot-password
      className="absolute top-0 right-0 has-[.disabled]:cursor-not-allowed"
    >
      <Link
        ref={linkRef}
        to={Route.fullPath}
        title="Indisponível no momento"
        preloadDelay={Number.POSITIVE_INFINITY}
        className="ml-auto inline-block text-sm font-bold underline [&.disabled]:opacity-50 [&.disabled]:pointer-events-none"
        onClick={(e) => {
          e.preventDefault()
          
          toggleDisabled(true)
          unavailableForNow(() => toggleDisabled(false))
        }}
      >
        Esqueceu sua senha?
      </Link>
    </div>
  )
}

export function RegisterPasswordField({ isLogin }: { isLogin?: boolean }) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  const passwordInputRef = useRef<HTMLInputElement>(null)
  
  return (
    <FormItem className="has-[[data-forgot-password]]:relative">
      <FormLabel>
        Senha
      </FormLabel>
      
      <PasswordInputWithEyeIconContainer ref={passwordInputRef}>
        <Input
          ref={passwordInputRef}
          type="password"
          value={field.state.value}
          placeholder={'*'.repeat(8)}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </PasswordInputWithEyeIconContainer>
      
      <Activity mode={!!isLogin ? 'visible' : 'hidden'}>
        <ForgotPasswordButton />
      </Activity>
      
      <Activity mode={field.state.meta.isTouched ? 'visible' : 'hidden'}>
        <ErrorMessages errors={errors} />
      </Activity>
    </FormItem>
  )
}

export function RegisterConfirmPasswordField() {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <FormItem>
      <FormLabel>
        Confirme sua senha
      </FormLabel>
      
      <Input
        type="password"
        value={field.state.value}
        placeholder={'*'.repeat(8)}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      
      <Activity mode={field.state.meta.isTouched ? 'visible' : 'hidden'}>
        <ErrorMessages errors={errors} />
      </Activity>
    </FormItem>
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
