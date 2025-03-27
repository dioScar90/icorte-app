import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import { getContext } from './providers/tanstack-query/root-provider.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import '@/styles.css'
import reportWebVitals from '@/reportWebVitals.ts'
import { useProxy } from '@/hooks/use-proxy.ts'
import { useErrorHandler } from '@/providers/errors/error-handler-provider.tsx'
import { useAuth } from '@/hooks/use-auth.ts'
import { MainProviders } from '@/providers/main-providers.tsx'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    ...getContext(),
    handleError: undefined!,
    httpClient: undefined!,
    auth: undefined!,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

declare module '@tanstack/history' {
  interface HistoryState {
    alert?: {
      message?: undefined
    } | {
      message: string
      title?: string
      icon?: 'success' | 'error'
      isHtml?: boolean
    }
  }
}

function App() {
  const { handleError } = useErrorHandler()
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

// Render the app
const rootElement = document.getElementById('root')

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <MainProviders>
        <App />
      </MainProviders>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
