import { ProxyProvider } from '@/providers/proxyProvider'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { ThemeProvider } from './theme-provider'
import { HandleErrorProvider } from '@/providers/handleErrorProvider'

const client = new QueryClient()

export function MainProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={client}>
        <HandleErrorProvider>
          <ProxyProvider>
            {children}
          </ProxyProvider>
        </HandleErrorProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
