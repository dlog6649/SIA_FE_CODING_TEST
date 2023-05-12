import React, { PropsWithChildren } from "react"
import { ErrorBoundary } from "react-error-boundary"

export default function RootErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4rem">
          <h1>{"Error Occured"}</h1>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
