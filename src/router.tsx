import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { handleError } from './providers/handleErrorProvider'
import { ErrorRoutePage } from './pages/error-route'

// import { Spinner } from './routes/-components/spinner'

export const queryClient = new QueryClient()

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    context: {
      handleError,
      queryClient,
    },
    // defaultPendingComponent: () => (
    //   <div className={`p-2 text-2xl`}>
    //     <Spinner />
    //   </div>
    // ),
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
    defaultNotFoundComponent: ErrorRoutePage,
  })

  return router
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}

declare module '@tanstack/history' {
  interface HistoryState {
    message?: string
  }
}
