import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  limit?: number
  className?: string
}

export function LineClamp({ className, children, limit = 1 }: Props) {
  return (
    <div className={cn(`line-clamp-${limit}`, className)}>
      {children}
    </div>
  )
}
