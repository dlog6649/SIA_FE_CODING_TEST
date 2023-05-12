import { cn } from "@src/shared/utils"
import React from "react"

import s from "./Loading.module.scss"

interface Props {
  className?: string
}

export default function Loading({ className }: Props) {
  return <div className={cn(s.Loading, ":uno: w-4rem h-4rem", className)}></div>
}
