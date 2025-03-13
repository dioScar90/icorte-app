import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { useProxy } from './hooks/use-proxy'
import { handleError } from './providers/handleErrorProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorRoutePage } from './pages/error-route'
import { useAuth } from './hooks/use-auth'
// import { useAuth } from './hooks/use-auth'

const queryClient = new QueryClient()

// Create a new router instance
// const router = createRouter()
const router = createRouter({
  routeTree,
  context: {
    handleError,
    queryClient,
    httpClient: undefined!,
  },
  scrollRestoration: true,
  defaultPreload: 'intent',
  defaultNotFoundComponent: ErrorRoutePage,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

declare module '@tanstack/history' {
  interface HistoryState {
    message?: string
  }
}

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={router}
          context={{
            httpClient: useProxy(),
          }}
        />
      </QueryClientProvider>
    </StrictMode>,
  )
}
