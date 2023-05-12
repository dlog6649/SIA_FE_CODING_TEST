import { cn } from "@src/shared/utils"
import { useQueryErrorResetBoundary } from "@tanstack/react-query"
import React, { PropsWithChildren } from "react"
import { ErrorBoundary } from "react-error-boundary"

import Button from "../button/Button"

interface Props extends PropsWithChildren {
  className?: string
  onRetryButtonClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export default function QueryErrorBoundary({ className, onRetryButtonClick, children }: Props) {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className={cn("flex items-center", className)}>
          <p>{"데이터를 불러오는데 실패하였습니다."}</p>
          <div className={"ml-1rem"} />
          <pre className={"whitespace-pre-line"}>
            {"cause:"}
            <span className={"text-red"}>{error.message}</span>
          </pre>
          <div className={"ml-1rem"} />
          <Button
            onClick={(e) => {
              onRetryButtonClick && onRetryButtonClick(e)
              resetErrorBoundary()
            }}
          >
            <span className={"i-outline:refresh ml-4px"} />
            {"재시도"}
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
