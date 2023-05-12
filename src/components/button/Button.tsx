import "./Button.scss"

import { cn } from "@src/shared/utils"
import React from "react"

type Props = {
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  icon?: React.ReactNode
  btnStyle?: "ghost"
  children?: any
}

export default function Button(p: Props) {
  return (
    <button className={cn("button__Xc2iD", p.className, p.btnStyle)} type={"button"} onClick={p.onClick}>
      {p.icon}
      {p.children}
    </button>
  )
}
