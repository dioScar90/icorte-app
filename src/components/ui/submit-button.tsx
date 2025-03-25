import type { ComponentProps, ReactNode } from "react"
import { Button } from "./button"
import { Loader2 } from "lucide-react"

type SubmitButtonProps = {
  IconLeft?: ReactNode
  IconRight?: ReactNode
} & ComponentProps<typeof Button>

export function SubmitButton({ IconLeft, IconRight, disabled, children, ...props }: SubmitButtonProps) {
  return (
    <Button {...props}>
      {IconLeft && (!disabled ? IconLeft : <Loader2 className="animate-spin" />)}
      {children}
      {IconRight && (!disabled ? IconRight : <Loader2 className="animate-spin" />)}
    </Button>
  )
}
