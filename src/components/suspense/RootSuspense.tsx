import React, { PropsWithChildren, Suspense } from "react"

import Loading from "../loading/Loading"

export default function RootSuspense({ children }: PropsWithChildren) {
  return <Suspense fallback={<Loading className={"absolute top-50% left-50% translate-[-50%]"} />}>{children}</Suspense>
}
