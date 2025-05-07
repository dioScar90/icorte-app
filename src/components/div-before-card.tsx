import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

export function DivBeforeCard({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('flex w-full items-start justify-center py-4 px-1 md:px-2 lg:px-4', className)}>
      {children}
    </div>
  )
}
