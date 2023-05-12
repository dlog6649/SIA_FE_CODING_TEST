import "uno.css"
import "./main.css"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import App from "./App"
import RootErrorBoundary from "./components/error-boundary/RootErrorBoundary"
import RootSuspense from "./components/suspense/RootSuspense"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RootErrorBoundary>
    <RootSuspense>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </RootSuspense>
  </RootErrorBoundary>,
)
