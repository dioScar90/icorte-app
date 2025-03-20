import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { FileRouteTypes, routeTree } from './routeTree.gen'
import { useProxy } from './hooks/use-proxy'
import { useError } from './hooks/use-error'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorRoutePage } from './pages/error-route'
import { useAuth } from './hooks/use-auth'

const queryClient = new QueryClient()

// Create a new router instance
// const router = createRouter()
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    handleError: undefined!,
    httpClient: undefined!,
    auth: undefined!,
  },
  scrollRestoration: true,
  defaultPreload: 'intent',
  defaultNotFoundComponent: ErrorRoutePage,
})

export type AllFuckingRoutes = FileRouteTypes['to']

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

function App() {
  const handleError = useError()
  const httpClient = useProxy()
  const auth = useAuth(httpClient)

  return (
    <RouterProvider
      router={router}
      context={{
        handleError,
        httpClient,
        auth,
      }}
    />
  )
}

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  )
}
