import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import * as TanstackQuery from './integrations/tanstack-query/root-provider.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import { useError } from './hooks/use-error.tsx'
import { useProxy } from './hooks/use-proxy.ts'
import { useAuth } from './hooks/use-auth.tsx'
import type { SweetAlertOptions } from "sweetalert2"

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    ...TanstackQuery.getContext(),
    httpClient: undefined!,
    handleError: undefined!,
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
  const httpClient = useProxy()
  // const handleError = useError()
  const auth = useAuth(httpClient)

  return (
    <RouterProvider
      router={router}
      context={{
        ...useError(),
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
      <TanstackQuery.Provider>
        <App />
      </TanstackQuery.Provider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
