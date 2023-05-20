import Loading from "@src/components/loading/Loading"
import React, { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import styles from "./LabelingHome.module.scss"
import ThumbnailCards from "./ThumbnailCards"

export default function LabelingHome() {
  return (
    <main className={styles.labelingHome}>
      <h1 className={styles.title}>{"Labeling Home"}</h1>
      <ErrorBoundary fallback={<h2>{"Error occurred when fetching images"}</h2>}>
        <Suspense fallback={<Loading className={"absolute top-30% left-50%"} />}>
          <ThumbnailCards />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}
