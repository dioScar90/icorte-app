import type { PropsWithChildren } from "react";

export function ForTheFuture({ children }: PropsWithChildren) {
  return (
    <div>
      <p><code>(for the future...)</code>{children}</p>
    </div>
  )
}