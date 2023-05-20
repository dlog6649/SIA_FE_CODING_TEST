import { cn } from "@src/shared/utils"
import React, { ReactNode, PropsWithChildren } from "react"

import styles from "./Button.module.scss"

interface Props extends PropsWithChildren {
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  icon?: ReactNode
  buttonStyle?: "ghost"
}

export default function Button({ className, onClick, icon, buttonStyle, children }: Props) {
  return (
    <button className={cn(styles.Button, className, buttonStyle)} type={"button"} onClick={onClick}>
      {icon}
      {children}
    </button>
  )
}
