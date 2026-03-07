import { Activity, type ComponentProps, type ReactNode } from "react"
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
      <Activity mode={IconLeft ? 'visible' : 'hidden'}>
        <Activity mode={disabled ? 'visible' : 'hidden'}>
          <Loader2 className="animate-spin" />
        </Activity>
        <Activity mode={!disabled ? 'visible' : 'hidden'}>
          IconLeft
        </Activity>
      </Activity>
      
      {children}
      
      <Activity mode={IconRight ? 'visible' : 'hidden'}>
        <Activity mode={disabled ? 'visible' : 'hidden'}>
          <Loader2 className="animate-spin" />
        </Activity>
        <Activity mode={!disabled ? 'visible' : 'hidden'}>
          IconRight
        </Activity>
      </Activity>
    </Button>
  )
}
