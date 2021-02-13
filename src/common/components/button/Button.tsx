import React from "react"
import styles from "./Button.module.scss"
import cn from "classnames"

type Props = {
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  icon?: React.ReactNode
  type?: "ghost"
  children?: any
}

export default function Button(p: Props) {
  return (
    <button className={cn(styles.button, p.className)} type={"button"} data-type={p.type} onClick={p.onClick}>
      {p.icon}
      {p.children}
    </button>
  )
}
