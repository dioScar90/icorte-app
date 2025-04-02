import { useStore } from '@tanstack/react-form'
import * as LabelPrimitive from "@radix-ui/react-label"

import { useFieldContext, useFormContext } from '@/hooks/forms/form-contexts'

import { Input } from '@/components/ui/input'
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'
import * as ShadcnSelect from '@/components/ui/select'
import { Slider as ShadcnSlider } from '@/components/ui/slider'
import { Switch as ShadcnSwitch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type { ComponentProps } from 'react'
import { SubmitButton } from '@/components/ui/submit-button'
import { getEnumAsString } from '@/schemas/sharedValidators/nativeEnumValidator'
import { cn } from '@/lib/utils'

function FormItem({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="form-item"
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function FormLabel({
  hasErrors,
  className,
  htmlFor,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root> & { hasErrors?: boolean }) {
  return (
    <Label
      data-slot="form-label"
      data-error={!!hasErrors}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={htmlFor}
      {...props}
    />
  )
}

export function ErrorMessages({
  errors,
}: {
  errors: Array<string | { message: string }>
}) {
  return (
    <>
      {errors.map((error) => (
        <div
          key={typeof error === 'string' ? error : error.message}
          className="text-red-500 mt-1 font-semibold text-sm"
          // text-destructive
        >
          {typeof error === 'string' ? error : error.message}
        </div>
      ))}
    </>
  )
}

export function FormRootErrorMessage() {
  return null
}

export function SubscribeButton({ label, ...rest }: { label: string } & ComponentProps<typeof SubmitButton>) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <SubmitButton type="submit" {...rest} disabled={isSubmitting}>
          {label}
        </SubmitButton>
      )}
    </form.Subscribe>
  )
}

export function TextField({
  type,
  label,
  placeholder,
  ...rest
}: ComponentProps<typeof Input> & { label?: string }) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <FormItem>
      <FormLabel htmlFor={label} hasErrors={field.state.meta.isTouched}>
        {label}
      </FormLabel>
      <Input
        {...rest}
        type={type ?? 'text'}
        value={field.state.value}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </FormItem>
  )
}

export function TextArea({
  label,
  rows = 3,
}: {
  label: string
  rows?: number
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <FormItem>
      <FormLabel htmlFor={label} hasErrors={field.state.meta.isTouched}>
        {label}
      </FormLabel>
      <ShadcnTextarea
        id={label}
        value={field.state.value}
        onBlur={field.handleBlur}
        rows={rows}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </FormItem>
  )
}

export function Select({
  label,
  placeholder,
  disabled,
  baseEnum,
}: {
  label: string
  placeholder?: string
  disabled?: boolean
  baseEnum: readonly [string, ...string[]]
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  function getValueAsString(value: unknown) {
    return getEnumAsString(baseEnum, Number(value))
  }
  
  return (
    <FormItem>
      <ShadcnSelect.Select
        name={field.name}
        value={getValueAsString(field.state.value)}
        onValueChange={field.handleChange}
        defaultValue={getValueAsString(field.state.value)}
        disabled={disabled}
      >
        <ShadcnSelect.SelectTrigger className="w-[180px]">
          <ShadcnSelect.SelectValue placeholder={placeholder} />
        </ShadcnSelect.SelectTrigger>

        <ShadcnSelect.SelectContent>
          <ShadcnSelect.SelectGroup>
            <ShadcnSelect.SelectLabel>{label}</ShadcnSelect.SelectLabel>
            {baseEnum.map(value => (
              <ShadcnSelect.SelectItem key={value} value={value}>
                {value}
              </ShadcnSelect.SelectItem>
            ))}
          </ShadcnSelect.SelectGroup>
        </ShadcnSelect.SelectContent>
      </ShadcnSelect.Select>
      
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </FormItem>
  )
}

export function Slider({ label }: { label: string }) {
  const field = useFieldContext<number>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <FormItem>
      <FormLabel htmlFor={label} hasErrors={field.state.meta.isTouched}>
        {label}
      </FormLabel>
      <ShadcnSlider
        id={label}
        onBlur={field.handleBlur}
        value={[field.state.value]}
        onValueChange={(value) => field.handleChange(value[0])}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </FormItem>
  )
}

export function Switch({
  label, description, className, ...shadcnSwitchProps
}: {
  label: string, description?: string, className?: string
} & ComponentProps<typeof ShadcnSwitch>) {
  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  // return (
  //   <FormItem className={className}>
  //     <div className="flex items-center gap-2">
  //       <ShadcnSwitch
  //         id={label}
  //         onBlur={field.handleBlur}
  //         checked={field.state.value}
  //         onCheckedChange={(checked) => field.handleChange(checked)}
  //       />
        
  //       <FormLabel htmlFor={label} hasErrors={field.state.meta.isTouched}>
  //         {label}
  //       </FormLabel>
  //     </div>
  //     {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
  //   </FormItem>
  // )

  return (
    <FormItem className={className}>
      <div className="space-y-0.5">
        <FormLabel className="text-base">
          {label}
          {/* Barbearia Fechada */}
        </FormLabel>
        <FormDescription>
          {description}
          {/* Caso queira fechar nesse dia */}
        </FormDescription>
      </div>
      {/* <div className="flex items-center gap-2"> */}
        <ShadcnSwitch
          {...shadcnSwitchProps}
          id={label}
          onBlur={field.handleBlur}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked)}
        />
        
        {/* <FormLabel htmlFor={label} hasErrors={field.state.meta.isTouched}>
          {label}
        </FormLabel> */}
      {/* </div> */}
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </FormItem>
  )
}
