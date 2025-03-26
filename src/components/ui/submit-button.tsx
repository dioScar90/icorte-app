import type { ComponentProps, ReactNode } from "react"
import { Button } from "./button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type SubmitButtonProps = {
  IconLeft?: ReactNode
  IconRight?: ReactNode
} & ComponentProps<typeof Button>

export function SubmitButton({ IconLeft, IconRight, disabled, className, children, ...props }: SubmitButtonProps) {
  return (
    <Button {...props} className={cn('cursor-pointer', className)}>
      {IconLeft && (!disabled ? IconLeft : <Loader2 className="animate-spin" />)}
      {children}
      {IconRight && (!disabled ? IconRight : <Loader2 className="animate-spin" />)}
    </Button>
  )
}
