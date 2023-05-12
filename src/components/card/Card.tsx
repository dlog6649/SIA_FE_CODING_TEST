import { cn } from "@src/shared/utils"
import React from "react"

import styles from "./Card.module.scss"

type Props = {
  className?: string
  onClick?: any
  thumbnailUrl?: string
  text: string
}

export default function Card(p: Props) {
  return (
    <figure className={cn(styles.card, p.className)} title={p.text} onClick={p.onClick}>
      <img className={styles.thumbnail} src={p.thumbnailUrl} alt={p.text} />
      <div className={cn(styles.text, "ellipsis")}>{p.text}</div>
    </figure>
  )
}
