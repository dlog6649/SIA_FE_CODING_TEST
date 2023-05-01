import "uno.css"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import App from "./App"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Suspense fallback={<div>Loading...</div>}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </Suspense>,
)
