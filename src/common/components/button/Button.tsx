import React, { ReactChildren, useEffect } from "react"
import styles from "./Button.module.scss"
import cn from "classnames"

type Props = {
  id?: string | number
  className?: string
  onClick?: any
  children?: any
  type?: string
}

export default function Button(p: Props) {
  return (
    <button className={cn(styles.button, p.className)} type={"button"} data-type={p.type} onClick={p.onClick}>
      {p.children}
    </button>
  )
}
