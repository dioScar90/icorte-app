import type { PropsWithChildren } from "react"
import { ThemeProvider } from 'next-themes'
import * as TanstackQuery from './tanstack-query/root-provider.tsx'
import { ErrorHandlerProvider } from "./errors/error-handler-provider.tsx"

export function MainProviders({ children }: PropsWithChildren) {
  return (
    <ErrorHandlerProvider>
      <TanstackQuery.Provider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {children}
        </ThemeProvider>
      </TanstackQuery.Provider>
    </ErrorHandlerProvider>
  )
}
